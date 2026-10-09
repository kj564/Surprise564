import { NextResponse } from "next/server";

// Pre-render this simple GET endpoint during static export for GitHub Pages.
export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}