import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set(
            "next",
            `${request.nextUrl.pathname}${request.nextUrl.search}`,
        );
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard", "/add-studio","/my-bookings", "/my-listings", "/studios/edit/:path*", ],
};