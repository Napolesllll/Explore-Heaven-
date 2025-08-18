// src/app/api/uploads/image/route.ts
export const runtime = "nodejs"; // <— fuerza el runtime a Node.js

import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1) Leemos el formData de la petición
    const form = await req.formData();
    const file = form.get("file") as Blob;
    if (!file) {
      return NextResponse.json({ error: "No se encontró el archivo" }, { status: 400 });
    }

    // 2) Preparamos un FormData web API para Cloudinary
    const uploadData = new FormData();
    // @ts-ignore: name property sólo para que Cloudinary reconozca el archivo
    uploadData.append("file", file, "upload.jpg");
    uploadData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET!);

    // 3) Hacemos fetch a Cloudinary con la FormData web API
    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: uploadData as unknown as BodyInit,
      }
    );

    // 4) Si falla, leemos el texto (puede ser JSON de error o HTML) y devolvemos
    if (!cloudRes.ok) {
      const text = await cloudRes.text();
      console.error("Cloudinary error:", text);
      return NextResponse.json({ error: text }, { status: cloudRes.status });
    }

    // 5) Si va bien, parseamos JSON y devolvemos sólo la URL
    const data = await cloudRes.json();
    return NextResponse.json({ url: data.secure_url });
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
