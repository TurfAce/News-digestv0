import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogoutButton } from "@/components/logout-button"
import { InterestEditor } from "@/app/mypage/interest-editor"
import { prisma } from "@/lib/prisma"

export default async function MyPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    // Fetch user profile from Prisma
    let dbUser = await prisma.user.findUnique({
        where: { id: user.id }
    })

    // If no user record exists yet, we can treat it as empty interests or create one on the fly.
    // However, InterestEditor handles the update (upsert).
    // For display, if dbUser is null, interests are empty.
    const interests = dbUser?.interests || []

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 pt-24">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">マイページ</h1>
                    <LogoutButton />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>プロフィール情報</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">メールアドレス</label>
                                    <p className="text-lg">{user.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">会員ID</label>
                                    <p className="text-sm font-mono text-muted-foreground">{user.id}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>興味・関心のあるジャンル</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {interests.length > 0 ? (
                                    interests.map((interest) => (
                                        <Badge key={interest} variant="secondary">
                                            {interest}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        設定されているジャンルはありません
                                    </p>
                                )}
                                <InterestEditor initialInterests={interests} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
