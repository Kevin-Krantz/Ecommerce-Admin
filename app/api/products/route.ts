import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import { _id } from "@next-auth/mongodb-adapter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await mongooseConnect();
  const data = await req.json();
  const { title, description, price, images } = data;

  const productDoc = await Product.create({
    title,
    description,
    price,
    images,
  });

  return NextResponse.json(productDoc);
}

export async function GET(req: NextRequest) {
  await mongooseConnect();

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    return NextResponse.json(await Product.findById(id));
  } else return NextResponse.json(await Product.find());
}

export async function PUT(req: NextRequest) {
  await mongooseConnect();

  const data = await req.json();
  const { title, description, price, images, _id } = data;
  return NextResponse.json(
    await Product.updateOne({ _id }, { title, description, price, images })
  );
}

export async function DELETE(req: NextRequest) {
  await mongooseConnect();

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    return NextResponse.json(await Product.deleteOne({ _id: id }));
  }
}
