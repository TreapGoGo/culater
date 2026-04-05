import { addDays, addYears, isAfter, isBefore } from "date-fns";
import { NextResponse } from "next/server";
import { createCapsule } from "@/lib/capsules";
import { getAppUrl, hasSupabaseConfig } from "@/lib/env";
import { toCapsuleOpenIso } from "@/lib/time";

export const runtime = "nodejs";

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function resolveAppUrl(request: Request) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  const host = request.headers.get("host");
  if (host) {
    const url = new URL(request.url);
    return `${url.protocol}//${host}`;
  }

  return getAppUrl();
}

export async function POST(request: Request) {
  if (!hasSupabaseConfig()) {
    return NextResponse.json(
      {
        status: "error",
        message:
          "还没连上 Supabase。先在环境变量里补齐数据库配置，再创建第一颗胶囊。",
      },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      {
        status: "error",
        message: "请求格式不正确。",
      },
      { status: 400 },
    );
  }

  const title = asText(body.title);
  const creatorName = asText(body.creatorName);
  const creatorEmail = asText(body.creatorEmail).toLowerCase();
  const openAtDate = asText(body.openAtDate);

  if (!title || title.length > 30) {
    return NextResponse.json(
      {
        status: "error",
        message: "标题请控制在 30 个字以内。",
      },
      { status: 400 },
    );
  }

  if (!creatorName || creatorName.length > 10) {
    return NextResponse.json(
      {
        status: "error",
        message: "昵称请控制在 10 个字以内。",
      },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(creatorEmail)) {
    return NextResponse.json(
      {
        status: "error",
        message: "邮箱格式看起来不太对。",
      },
      { status: 400 },
    );
  }

  if (!openAtDate) {
    return NextResponse.json(
      {
        status: "error",
        message: "请选择开启日期。",
      },
      { status: 400 },
    );
  }

  const openAt = new Date(toCapsuleOpenIso(openAtDate));
  const minDate = addDays(new Date(), 7);
  const maxDate = addYears(new Date(), 1);

  if (isBefore(openAt, minDate) || isAfter(openAt, maxDate)) {
    return NextResponse.json(
      {
        status: "error",
        message: "开启时间需要在 7 天后到 1 年内。",
      },
      { status: 400 },
    );
  }

  try {
    const capsule = await createCapsule({
      title,
      creatorName,
      creatorEmail,
      openAt: openAt.toISOString(),
    });

    const appUrl = resolveAppUrl(request);

    return NextResponse.json({
      status: "success",
      message: "时间胶囊已经安静地落下来了。",
      capsuleId: capsule.id,
      shareUrl: `${appUrl}/c/${capsule.id}`,
    });
  } catch (error) {
    console.error("POST /api/capsules", error);

    return NextResponse.json(
      {
        status: "error",
        message: "创建失败了，先确认 Supabase 表结构和环境变量是否都已就绪。",
      },
      { status: 500 },
    );
  }
}
