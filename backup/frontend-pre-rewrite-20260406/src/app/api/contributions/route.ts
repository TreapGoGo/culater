import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createContribution, getCapsuleById } from "@/lib/capsules";
import { env, hasSupabaseConfig } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { slugifyFilename } from "@/lib/utils";

export const runtime = "nodejs";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maxNicknameLength = 10;
const maxMessageLength = 200;
const maxPhotoSize = 20 * 1024 * 1024;
const maxPhotoCount = 20;

function asText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  if (!hasSupabaseConfig()) {
    return NextResponse.json(
      {
        message: "现在还没连上数据层，所以这份内容还存不进去。",
      },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const capsuleId = asText(formData.get("capsuleId"));
  const nickname = asText(formData.get("nickname"));
  const email = asText(formData.get("email")).toLowerCase();
  const message = asText(formData.get("message"));
  const files = formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File);

  if (!capsuleId || !nickname || !email || !files.length) {
    return NextResponse.json(
      {
        message: "还差一点：请把昵称、邮箱和照片都补完整。",
      },
      { status: 400 },
    );
  }

  if (nickname.length > maxNicknameLength) {
    return NextResponse.json(
      {
        message: `昵称请控制在 ${maxNicknameLength} 个字以内。`,
      },
      { status: 400 },
    );
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json(
      {
        message: "邮箱格式看起来不太对。",
      },
      { status: 400 },
    );
  }

  if (message.length > maxMessageLength) {
    return NextResponse.json(
      {
        message: `想说的话请控制在 ${maxMessageLength} 个字以内。`,
      },
      { status: 400 },
    );
  }

  if (files.length > maxPhotoCount) {
    return NextResponse.json(
      {
        message: `一次最多上传 ${maxPhotoCount} 张照片。可以分几次提交。`,
      },
      { status: 400 },
    );
  }

  const invalidFile = files.find(
    (file) => !file.type.startsWith("image/") || file.size > maxPhotoSize,
  );

  if (invalidFile) {
    const messageText = !invalidFile.type.startsWith("image/")
      ? `${invalidFile.name} 不是可用的图片文件。`
      : `${invalidFile.name} 超过 20MB 了。`;

    return NextResponse.json(
      {
        message: messageText,
      },
      { status: 400 },
    );
  }

  const uploadedPaths: string[] = [];

  try {
    const capsule = await getCapsuleById(capsuleId);
    if (!capsule) {
      return NextResponse.json(
        {
          message: "这颗胶囊不存在，或者链接已经失效了。",
        },
        { status: 404 },
      );
    }

    if (capsule.status !== "collecting" || new Date(capsule.openAt) <= new Date()) {
      return NextResponse.json(
        {
          message: "这颗胶囊已经开启了，所以不能再继续上传内容。",
        },
        { status: 409 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const nextUploadedPaths = await Promise.all(
      files.map(async (file) => {
        const safeName = slugifyFilename(file.name);
        const path = `${capsuleId}/${Date.now()}-${randomUUID()}-${safeName}`;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error } = await supabase.storage
          .from(env.SUPABASE_PHOTOS_BUCKET)
          .upload(path, buffer, {
            contentType: file.type || "image/jpeg",
            upsert: false,
          });

        if (error) {
          throw error;
        }

        return path;
      }),
    );
    uploadedPaths.push(...nextUploadedPaths);

    await createContribution({
      capsuleId,
      nickname,
      email,
      message: message || null,
      photos: nextUploadedPaths,
    });

    return NextResponse.json({
      ok: true,
      message: "这份内容已经封进胶囊了。",
    });
  } catch (error) {
    console.error("POST /api/contributions", error);

    if (uploadedPaths.length) {
      const supabase = getSupabaseAdminClient();
      const { error: cleanupError } = await supabase.storage
        .from(env.SUPABASE_PHOTOS_BUCKET)
        .remove(uploadedPaths);

      if (cleanupError) {
        console.error("POST /api/contributions cleanup", cleanupError);
      }
    }

    return NextResponse.json(
      {
        message: "这次上传没有成功。请确认存储桶和数据表都已经创建好，然后再试一次。",
      },
      { status: 500 },
    );
  }
}
