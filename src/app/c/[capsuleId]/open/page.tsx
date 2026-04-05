import { notFound, redirect } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { CapsuleOpening } from "@/components/capsule-opening";
import { ConfigNotice } from "@/components/config-notice";
import {
  getCapsuleById,
  getPhotoUrl,
  listContributionsByCapsule,
} from "@/lib/capsules";
import { hasSupabaseConfig } from "@/lib/env";
import { daysSince as getDaysSince, formatOpenDate as getFormattedOpenDate } from "@/lib/time";
import type { ContributionGroup } from "@/lib/types";

type CapsuleOpenPageProps = {
  params: Promise<{
    capsuleId: string;
  }>;
};

export default async function CapsuleOpenPage({
  params,
}: CapsuleOpenPageProps) {
  const { capsuleId } = await params;

  if (!hasSupabaseConfig()) {
    return (
      <main className="page-wrap">
        <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 lg:px-10">
          <header className="py-4">
            <BrandMark />
          </header>
          <ConfigNotice
            title="开启页已经就位，等 Supabase 接入后就能看到真实内容"
            description="现在的开启动画、分组瀑布流和回忆叙事已经全部就位。接上数据和存储桶后，这里会展示真实上传内容。"
          />
        </div>
      </main>
    );
  }

  const capsule = await getCapsuleById(capsuleId);
  if (!capsule) {
    notFound();
  }

  const isReady = capsule.status === "opened" || new Date(capsule.openAt) <= new Date();

  if (!isReady) {
    redirect(`/c/${capsule.id}`);
  }

  const contributions = await listContributionsByCapsule(capsule.id);
  const grouped = new Map<string, ContributionGroup>();

  for (const contribution of contributions) {
    const key = `${contribution.nickname}::${contribution.email}`;
    const current = grouped.get(key);

    if (current) {
      current.contributions.push(contribution);
      continue;
    }

    grouped.set(key, {
      id: key,
      nickname: contribution.nickname,
      email: contribution.email,
      contributions: [contribution],
    });
  }

  const photoUrls: Record<string, string> = {};
  contributions.forEach((contribution) => {
    contribution.photos.forEach((path) => {
      photoUrls[path] = getPhotoUrl(path);
    });
  });

  return (
    <main className="page-wrap">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
        <header className="py-4">
          <BrandMark />
        </header>

        <section className="py-6 lg:py-10">
          <CapsuleOpening
            capsuleTitle={capsule.title}
            elapsedDays={getDaysSince(capsule.createdAt)}
            formattedOpenAt={getFormattedOpenDate(capsule.openAt)}
            groups={[...grouped.values()]}
            photoUrls={photoUrls}
          />
        </section>
      </div>
    </main>
  );
}
