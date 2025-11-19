import { headers } from "next/headers";

export async function GET() {
  const h = await headers();

  // Vercel passes IPs through these headers:
  const forwarded = h.get("x-forwarded-for");
  const realIp = h.get("x-real-ip");

  let ip = "unknown";

  if (forwarded) {
    // Use the first IP in the chain (client IP)
    ip = forwarded.split(",")[0].trim();
  } else if (realIp) {
    ip = realIp;
  }

  return Response.json({ ip }, { status: 200 });
}
