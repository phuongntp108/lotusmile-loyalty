import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "changeme"
);

export async function middleware(req: NextRequest) {
  // chỉ apply cho API cần auth
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // verify token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    // bạn có thể gắn payload vào request header để downstream API dùng
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.userId as string);
    requestHeaders.set("x-user-email", payload.email as string);

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

// áp dụng middleware cho các route cụ thể
export const config = {
  matcher: ["/api/profile", "/api/request"], // chỉ những API trong /api/protected/*
};
