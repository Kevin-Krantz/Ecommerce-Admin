import mime from "mime";
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { SessionUserWithAdmin } from "@/types/SessionUserWithAdmin";
import { getServerSession } from "next-auth";

const bucketName = "kevin-next-ecommerce";

async function uploadToS3(
  client: S3Client,
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
) {
  const cmd = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: "public-read",
  });
  return client.send(cmd);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const session = await getServerSession(authOptions);
  const { isAdmin } = session?.user as SessionUserWithAdmin;

  if (!isAdmin) {
    return NextResponse.json(
      {
        error:
          "Access Denied: You do not have permission to perform this action.",
      },
      { status: 403 }
    );
  }

  const client = new S3Client({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY as string,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    },
  });

  const file = formData.get("file") as Blob | null;
  if (!file) {
    return NextResponse.json(
      { error: "File blob is required." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${file.name.replace(
    /\.[^/.]+$/,
    ""
  )}-${uniqueSuffix}.${mime.getExtension(file.type)}`;

  try {
    await uploadToS3(client, buffer, filename, file.type);
    return NextResponse.json({
      fileUrl: `https://${bucketName}.s3.eu-north-1.amazonaws.com/${filename}`,
    });
  } catch (e) {
    console.error("Error while trying to upload a file to S3\n", e);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
