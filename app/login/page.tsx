import { login, signup } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
    const params = await searchParams
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 flex items-center justify-center p-4 bg-muted/20">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">アカウント作成・ログイン</CardTitle>
                        <CardDescription>
                            メールアドレスを入力して、アカウントを作成またはログインしてください。
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {params.error && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4 font-medium">
                                {params.error}
                            </div>
                        )}
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">メールアドレス</Label>
                                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">パスワード</Label>
                                <Input id="password" name="password" type="password" required />
                            </div>
                            <div className="flex flex-col gap-2 pt-4">
                                <Button formAction={login}>ログイン</Button>
                                <Button variant="outline" formAction={signup}>新規登録</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    )
}
