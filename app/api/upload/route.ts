import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

const MAX_BYTES = 8 * 1024 * 1024 // 8MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"]

export async function POST(request: NextRequest) {
  // Only authenticated users (customers, farmers, staff) may upload.
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const folder = (formData.get("folder") as string | null) ?? "uploads"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported image type" }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image exceeds 8MB" }, { status: 400 })
    }

    const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "")
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg"
    const key = `${safeFolder}/${session.user.id}-${Date.now()}.${ext}`

    const blob = await put(key, file, {
      access: "public",
      addRandomSuffix: true,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("[v0] Blob upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
