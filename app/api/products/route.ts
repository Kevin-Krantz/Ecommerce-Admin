import { NextResponse } from "next/server";

export async function POST(req: Request) {
  return NextResponse.json(req.method);
  // const { method } = req;
  // if (method === "POST") {
  // }
}
