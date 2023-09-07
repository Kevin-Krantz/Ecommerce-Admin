import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import { _id } from "@next-auth/mongodb-adapter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await mongooseConnect();
  const data = await req.json();
  const { title, description, price, images, category, properties } = data;

  const newProductData: Partial<IProduct> = {
    title,
    description,
    price,
    images,
  };

  if (category !== "") {
    newProductData.category = category;
    newProductData.properties = properties;
  }

  const productDoc = await Product.create(newProductData);
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
  const { title, description, price, images, _id, category, properties } = data;

  const updateFields: Partial<IProduct> = {
    title,
    description,
    price,
    images,
  };

  let updateOperation: {
    $set: Partial<IProduct>;
    $unset?: Partial<Record<keyof IProduct, string>>;
  } = {
    $set: updateFields,
  };

  if (category === "") {
    updateOperation["$unset"] = { category: "", properties: "" };
  } else {
    updateFields.category = category;
    updateFields.properties = properties;
  }

  try {
    await Product.updateOne({ _id }, updateOperation);
    return NextResponse.json(await Product.findById(_id));
  } catch (error) {
    return NextResponse.json({ error: "Could not update product" });
  }
}

export async function DELETE(req: NextRequest) {
  await mongooseConnect();

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    return NextResponse.json(await Product.deleteOne({ _id: id }));
  }
}
