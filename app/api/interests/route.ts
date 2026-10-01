import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
export async function GET() {
  let interests: string[] = [];
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.DATABASE_URL
  ) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user)
        interests =
          (
            await prisma.user.findUnique({
              where: { id: user.id },
              select: { interests: true },
            })
          )?.interests ?? [];
    } catch {
      /* Optional account preferences must not block guest browsing. */
    }
  }
  return NextResponse.json(
    { interests },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
