import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import crypto from "crypto";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/x-m4a"];

// Limits — compression on client side handles the rest
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;  // 5MB (client compresses to ~300KB before this)
const MAX_AUDIO_SIZE = 5 * 1024 * 1024;  // 5MB

/**
 * Cloudinary signature: SHA1( sorted_params_string + apiSecret )
 *
 * CRITICAL RULE: signatureParams must contain EXACTLY the same keys
 * that are appended to the uploadForm — no more, no less.
 * If a param is in signatureParams but not sent in the form → invalid signature.
 * If a param is sent in the form but not in signatureParams → invalid signature.
 *
 * EXCLUDED from signature (per Cloudinary docs):
 *   file, api_key, resource_type, cloud_name
 *
 * NOTE: quality/fetch_format/transformation are DELIVERY params, not upload params.
 * They cannot be set during upload via the REST API this way.
 * Cloudinary auto-optimizes on delivery when you use their SDK (next-cloudinary).
 * Just upload cleanly — delivery optimization happens automatically.
 */
function buildSignature(params: Record<string, string>, apiSecret: string): string {
  const stringToSign =
    Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join("&") + apiSecret;

  return crypto.createHash("sha1").update(stringToSign).digest("hex");
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey    = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Upload not configured. Add CLOUDINARY_* env vars." },
      { status: 500 }
    );
  }

  try {
    const formData   = await req.formData();
    const file       = formData.get("file") as File | null;
    const uploadType = (formData.get("type") as string) ?? "photo";

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const isPhoto = uploadType === "photo";
    const isAudio = uploadType === "music";

    // Validate type
    if (isPhoto && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Use JPG, PNG, WebP, or GIF." }, { status: 400 });
    }
    if (isAudio && !ALLOWED_AUDIO_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Use MP3, WAV, OGG, or M4A." }, { status: 400 });
    }

    // Validate size (client-side compression already runs before this)
    if (file.size > MAX_IMAGE_SIZE && isPhoto) {
      return NextResponse.json({ error: "Photo too large. Max 5MB." }, { status: 400 });
    }
    if (file.size > MAX_AUDIO_SIZE && isAudio) {
      return NextResponse.json({ error: "Audio too large. Max 5MB." }, { status: 400 });
    }

    const timestamp    = String(Math.round(Date.now() / 1000));
    const folder       = isPhoto ? "wedcraft/photos" : "wedcraft/music";
    const resourceType = isAudio ? "video" : "image";

    // signatureParams = ONLY the params also appended to uploadForm below
    // (excluding file, api_key, resource_type)
    const signatureParams: Record<string, string> = {
      folder,
      timestamp,
    };

    const signature = buildSignature(signatureParams, apiSecret);

    // Build the upload form — must match signatureParams exactly
    const uploadForm = new FormData();
    uploadForm.append("file",      file);
    uploadForm.append("api_key",   apiKey);
    uploadForm.append("timestamp", timestamp);
    uploadForm.append("folder",    folder);
    uploadForm.append("signature", signature);
    // Note: do NOT add quality/fetch_format/transformation here —
    // those are delivery params handled by next-cloudinary on render,
    // not upload params. Adding them breaks the signature.

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      { method: "POST", body: uploadForm }
    );

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      console.error("Cloudinary error:", JSON.stringify(uploadData));
      return NextResponse.json(
        { error: uploadData.error?.message ?? "Upload failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success:      true,
      url:          uploadData.secure_url,
      publicId:     uploadData.public_id,
      resourceType: uploadData.resource_type,
    });

  } catch (err) {
    console.error("upload route:", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}