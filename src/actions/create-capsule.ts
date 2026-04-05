"use server";

import { addDays, addYears, isAfter, isBefore } from "date-fns";
import { headers } from "next/headers";
import { createCapsule } from "@/lib/capsules";
import { getAppUrl, hasSupabaseConfig } from "@/lib/env";
import { toCapsuleOpenIso } from "@/lib/time";

export type CreateCapsuleState = {
  status: "idle" | "success" | "error";
  message?: string;
  shareUrl?: string;
  capsuleId?: string;
};

export const initialCreateCapsuleState: CreateCapsuleState = {
  status: "idle",
};

function asText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

async function resolveAppUrl() {
  const headerList = await headers();
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");

  if (host) {
    return `${proto}://${host}`;
  }

  return getAppUrl();
}

export async function createCapsuleAction(
  _: CreateCapsuleState,
  formData: FormData,
): Promise<CreateCapsuleState> {
  if (!hasSupabaseConfig()) {
    return {
      status: "error",
      message:
        "还没连上 Supabase。先在 .env.local 里补齐数据库配置，再创建第一颗胶囊。",
    };
  }

  const title = asText(formData.get("title"));
  const creatorName = asText(formData.get("creatorName"));
  const creatorEmail = asText(formData.get("creatorEmail")).toLowerCase();
  const openAtDate = asText(formData.get("openAtDate"));

  if (!title || title.length > 30) {
    return {
      status: "error",
      message: "标题请控制在 30 个字以内。",
    };
  }

  if (!creatorName || creatorName.length > 10) {
    return {
      status: "error",
      message: "昵称请控制在 10 个字以内。",
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(creatorEmail)) {
    return {
      status: "error",
      message: "邮箱格式看起来不太对。",
    };
  }

  if (!openAtDate) {
    return {
      status: "error",
      message: "请选择开启日期。",
    };
  }

  const openAt = new Date(toCapsuleOpenIso(openAtDate));
  const minDate = addDays(new Date(), 7);
  const maxDate = addYears(new Date(), 1);

  if (isBefore(openAt, minDate) || isAfter(openAt, maxDate)) {
    return {
      status: "error",
      message: "开启时间需要在 7 天后到 1 年内。",
    };
  }

  try {
    const capsule = await createCapsule({
      title,
      creatorName,
      creatorEmail,
      openAt: openAt.toISOString(),
    });

    const appUrl = await resolveAppUrl();

    return {
      status: "success",
      message: "时间胶囊已经安静地落下来了。",
      capsuleId: capsule.id,
      shareUrl: `${appUrl}/c/${capsule.id}`,
    };
  } catch (error) {
    console.error("createCapsuleAction", error);

    return {
      status: "error",
      message: "创建失败了，先确认 Supabase 表结构和环境变量是否都已就绪。",
    };
  }
}
