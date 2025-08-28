import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FetchError } from "ofetch";

const getAllRequest = () =>
  prisma.request.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      requestor: {
        select: { id: true, email: true, name: true },
      },
    },
  });

export type AdminAllRequests = Awaited<ReturnType<typeof getAllRequest>>;

export async function GET(req: Request) {
  try {
    // lấy tất cả request (có thể paginate sau này)
    const requests = await getAllRequest();

    return NextResponse.json(requests, { status: 200 });
  } catch (err) {
    console.error("GET /api/requests error:", err);
    return NextResponse.json(
      { error: (err as FetchError).data },
      { status: 500 }
    );
  }
}
