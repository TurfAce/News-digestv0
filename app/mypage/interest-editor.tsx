"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { updateInterests } from "./actions" // Will create this next
import { INTEREST_GENRES } from "@/lib/constants"

interface InterestEditorProps {
    initialInterests: string[]
}

export function InterestEditor({ initialInterests }: InterestEditorProps) {
    const [open, setOpen] = useState(false)
    const [selectedInterests, setSelectedInterests] = useState<string[]>(initialInterests)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    // const { toast } = useToast() // Commenting out to avoid error if hook doesn't exist yet, checking lists later.

    const handleToggle = (genre: string) => {
        setSelectedInterests((current) =>
            current.includes(genre)
                ? current.filter((i) => i !== genre)
                : [...current, genre]
        )
    }

    const handleSave = async () => {
        try {
            setLoading(true)
            await updateInterests(selectedInterests)
            setOpen(false)

            // Optimistic update or waiting for revalidation
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Failed to update interests")
        } finally {
            setLoading(false)
        }
    }

    // Reset selection when opening
    const onOpenChange = (newOpen: boolean) => {
        if (newOpen) {
            setSelectedInterests(initialInterests)
        }
        setOpen(newOpen)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Badge variant="outline" className="text-muted-foreground border-dashed cursor-pointer hover:bg-muted">
                    編集する
                </Badge>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>興味・関心のあるジャンル</DialogTitle>
                    <DialogDescription>
                        興味のあるニュースジャンルを選択してください。
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {INTEREST_GENRES.map((genre) => (
                        <div key={genre} className="flex items-center space-x-2">
                            <Checkbox
                                id={genre}
                                checked={selectedInterests.includes(genre)}
                                onCheckedChange={() => handleToggle(genre)}
                            />
                            <Label
                                htmlFor={genre}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                {genre}
                            </Label>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        キャンセル
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "保存中..." : "保存する"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
