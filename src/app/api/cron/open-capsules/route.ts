import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  listContributionsByCapsule,
  listDueCapsules,
  markCapsuleOpened,
} from "@/lib/capsules";
import { env, getAppUrl, hasResendConfig, hasSupabaseConfig } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

function buildEmailHtml(title: string, openUrl: string) {
  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; padding: 32px; background: #0a0a0a; color: #f5f0eb;">
      <div style="max-width: 520px; margin: 0 auto; background: #141414; border-radius: 24px; padding: 32px; border: 1px solid #333333;">
        <div style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #6b6b6b;">See You Later</div>
        <h1 style="font-family: Georgia, serif; font-size: 32px; margin: 16px 0 12px;">你有一颗时间胶囊醒了</h1>
        <p style="line-height: 1.8; font-size: 16px; color: #aea39a;">
          「${title}」已经到点了。照片和文字还保持着你们当时的温度，等你点开它。
        </p>
        <a href="${openUrl}" style="display: inline-block; margin-top: 24px; padding: 14px 22px; border-radius: 16px; background: #e8b86d; color: #0a0a0a; font-weight: bold; text-decoration: none;">
          打开回忆页
        </a>
      </div>
    </div>
  `;
}

async function handleOpenCapsules(request: Request) {
  if (env.CRON_SECRET) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${env.CRON_SECRET}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }

  if (!hasSupabaseConfig()) {
    return NextResponse.json(
      {
        message: "Missing Supabase configuration.",
      },
      { status: 500 },
    );
  }

  if (!hasResendConfig()) {
    return NextResponse.json(
      {
        message: "Missing Resend configuration.",
      },
      { status: 500 },
    );
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const dueCapsules = await listDueCapsules(new Date().toISOString());
  const appUrl = resolveAppUrl(request);
  const results: Array<{ capsuleId: string; sent: number }> = [];

  for (const capsule of dueCapsules) {
    const contributions = await listContributionsByCapsule(capsule.id);
    const recipients = [
      capsule.creatorEmail,
      ...contributions.map((contribution) => contribution.email),
    ].filter(Boolean);

    const uniqueRecipients = [...new Set(recipients)];

    if (uniqueRecipients.length) {
      await resend.emails.send({
        from: env.RESEND_FROM_EMAIL!,
        to: uniqueRecipients,
        subject: `你有一颗时间胶囊醒了 —「${capsule.title}」`,
        html: buildEmailHtml(capsule.title, `${appUrl}/c/${capsule.id}/open`),
      });
    }

    await markCapsuleOpened(capsule.id);
    results.push({
      capsuleId: capsule.id,
      sent: uniqueRecipients.length,
    });
  }

  return NextResponse.json({
    ok: true,
    processed: results.length,
    results,
  });
}

export async function GET(request: Request) {
  return handleOpenCapsules(request);
}

export async function POST(request: Request) {
  return handleOpenCapsules(request);
}
