import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FLIGHTS_BY_CODE } from "@/data/flight-data";

export async function POST(req: Request) {
  try {
    // lấy từ header đã được middleware set
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // parse body
    const body = await req.json();

    const mappedFlight = FLIGHTS_BY_CODE.get(body.flightCode);

    if (
      !mappedFlight ||
      body.from !== mappedFlight.from ||
      body.to !== mappedFlight.to
    )
      return NextResponse.json({ error: "Flight not found!" }, { status: 404 });

    // tạo request trong DB
    const request = await prisma.request.create({
      data: {
        ...mappedFlight,
        requestorId: userId,
      },
      include: {
        requestor: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    return NextResponse.json(request, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await prisma.request.findMany({
      where: { requestorId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        requestor: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    return NextResponse.json(requests);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
