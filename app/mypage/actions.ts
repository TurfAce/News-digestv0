"use server"

import { createClient } from "@/utils/supabase/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateInterests(interests: string[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("Unauthorized")
    }

    try {
        await prisma.user.upsert({
            where: {
                id: user.id
            },
            update: {
                interests: interests
            },
            create: {
                id: user.id,
                email: user.email!, // Assuming email is present, though it might be good to handle null
                interests: interests
            }
        })

        revalidatePath("/mypage")
    } catch (error) {
        console.error("Error updating interests:", error)
        throw new Error("Failed to update interests")
    }
}
