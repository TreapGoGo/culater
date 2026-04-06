import { addYears, isAfter } from "date-fns";
import { NextResponse } from "next/server";
import { createCapsule } from "@/lib/capsules";
import { getAppUrl, hasSupabaseConfig } from "@/lib/env";

export const runtime = "nodejs";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
          "现在还没连上数据层，所以这颗胶囊还建不起来。先补齐环境变量和数据表，再试一次。",
      },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      {
        status: "error",
        message: "这次提交的内容没有读出来，请刷新后再试一次。",
      },
      { status: 400 },
    );
  }

  const title = asText(body.title);
  const creatorName = asText(body.creatorName);
  const creatorEmail = asText(body.creatorEmail).toLowerCase();
  const openAtInput = asText(body.openAt);

  if (!title || title.length > 30) {
    return NextResponse.json(
      {
        status: "error",
        message: "请填写胶囊标题，并控制在 30 个字以内。",
      },
      { status: 400 },
    );
  }

  if (!creatorName || creatorName.length > 10) {
    return NextResponse.json(
      {
        status: "error",
        message: "请填写创建者昵称，并控制在 10 个字以内。",
      },
      { status: 400 },
    );
  }

  if (!emailPattern.test(creatorEmail)) {
    return NextResponse.json(
      {
        status: "error",
        message: "邮箱格式看起来不太对。",
      },
      { status: 400 },
    );
  }

  if (!openAtInput) {
    return NextResponse.json(
      {
        status: "error",
        message: "请选择开启时间。",
      },
      { status: 400 },
    );
  }

  const openAt = new Date(openAtInput);
  if (Number.isNaN(openAt.getTime())) {
    return NextResponse.json(
      {
        status: "error",
        message: "开启时间没有读出来，请重新选择一次。",
      },
      { status: 400 },
    );
  }

  const maxDate = addYears(new Date(), 1);

  if (isAfter(openAt, maxDate)) {
    return NextResponse.json(
      {
        status: "error",
        message: "开启时间需要在 1 年内。",
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
      message: "胶囊已经创建好了。把下面的链接发出去，就可以开始收集内容。",
      capsuleId: capsule.id,
      shareUrl: `${appUrl}/c/${capsule.id}`,
    });
  } catch (error) {
    console.error("POST /api/capsules", error);

    return NextResponse.json(
      {
        status: "error",
        message:
          "这颗胶囊还没创建成功。请先确认数据表、环境变量和数据库连接都正常，再试一次。",
      },
      { status: 500 },
    );
  }
}
