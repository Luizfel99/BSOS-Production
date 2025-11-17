import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/prisma";

/**
 * POST /api/profile/avatar
 *
 * Uploads avatar to Cloudinary and updates user.avatar
 */

// Configure Cloudinary server-side
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

export async function POST(req: Request) {
  let userJwt;
  try {
    userJwt = requireUser(req);
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "file_required" }, { status: 400 });
  }

  // Upload via buffer to keep on server
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const upload = await new Promise<{ url: string; public_id: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "bsos/avatars", resource_type: "image", overwrite: true },
        (error, result) => {
          if (error || !result)
            return reject(error || new Error("upload_failed"));
          resolve({ url: result.secure_url, public_id: result.public_id });
        }
      );
      stream.end(buffer);
    }
  );

  await db.user.update({
    where: { id: userJwt.id },
    data: { avatar: upload.url },
  });

  return NextResponse.json({ ok: true, avatar: upload.url });
}
