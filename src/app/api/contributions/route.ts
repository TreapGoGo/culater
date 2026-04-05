import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createContribution, getCapsuleById } from "@/lib/capsules";
import { env, hasSupabaseConfig } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { slugifyFilename } from "@/lib/utils";

export const runtime = "nodejs";

function asText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  if (!hasSupabaseConfig()) {
    return NextResponse.json(
      {
        message: "Supabase 环境变量还没配好。",
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
        message: "请把昵称、邮箱和照片补完整。",
      },
      { status: 400 },
    );
  }

  const capsule = await getCapsuleById(capsuleId);
  if (!capsule) {
    return NextResponse.json(
      {
        message: "这颗胶囊不存在了。",
      },
      { status: 404 },
    );
  }

  if (new Date(capsule.openAt) <= new Date() || capsule.status === "opened") {
    return NextResponse.json(
      {
        message: "这颗胶囊已经醒了，不能继续封存内容。",
      },
      { status: 409 },
    );
  }

  const supabase = getSupabaseAdminClient();

  try {
    const uploadedPaths = await Promise.all(
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

    await createContribution({
      capsuleId,
      nickname,
      email,
      message: message || null,
      photos: uploadedPaths,
    });

    return NextResponse.json({
      ok: true,
      message: "已封入胶囊。",
    });
  } catch (error) {
    console.error("POST /api/contributions", error);

    return NextResponse.json(
      {
        message: "上传失败了，先确认 Storage bucket 和数据表是否都已经创建。",
      },
      { status: 500 },
    );
  }
}
