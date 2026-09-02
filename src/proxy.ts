import { type NextRequest } from "next/server";
import { oturumYenile } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return oturumYenile(request);
}

export const config = {
  matcher: ["/panel/:path*"],
};
