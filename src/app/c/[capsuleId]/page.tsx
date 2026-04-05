import { notFound, redirect } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { ConfigNotice } from "@/components/config-notice";
import { CountdownChip } from "@/components/countdown-chip";
import { JourneySteps } from "@/components/journey-steps";
import { UploadContributionForm } from "@/components/upload-contribution-form";
import { ShareLinkButton } from "@/components/share-link-button";
import { getCapsuleById } from "@/lib/capsules";
import { hasSupabaseConfig } from "@/lib/env";
import { formatOpenDate } from "@/lib/time";

type CapsulePageProps = {
  params: Promise<{
    capsuleId: string;
  }>;
};

export default async function CapsulePage({ params }: CapsulePageProps) {
  const { capsuleId } = await params;

  if (!hasSupabaseConfig()) {
    return (
      <main className="page-wrap">
        <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 lg:px-10">
          <header className="py-4">
            <BrandMark />
          </header>
          <ConfigNotice
            title="上传页已经搭好 但还没连上数据层"
            description="这个页面的表单 照片压缩和封存体验已经可以看了 要让它真正写入 Supabase 请先补齐环境变量并执行 schema.sql"
          />
        </div>
      </main>
    );
  }

  const capsule = await getCapsuleById(capsuleId);

  if (!capsule) {
    notFound();
  }

  const isOpen = capsule.status === "opened" || new Date(capsule.openAt) <= new Date();
  if (isOpen) {
    redirect(`/c/${capsule.id}/open`);
  }

  return (
    <main className="page-wrap">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
        <header className="py-4">
          <BrandMark />
        </header>

        <JourneySteps current="collect" className="mb-6 lg:mb-8" />

        <section className="grid gap-6 py-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 lg:py-10">
          <aside className="space-y-6 lg:space-y-8">
            <div className="paper-panel panel-amber rounded-[2.3rem] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="section-label text-xs">Capsule In Sleep</div>
                <ShareLinkButton />
              </div>
              <h1 className="display-type mt-4 text-5xl leading-[0.98] sm:text-6xl">
                {capsule.title}
              </h1>
              <p className="fine-copy body-copy mt-5 text-sm sm:text-base">
                <span className="block" style={{ whiteSpace: "nowrap" }}>这颗胶囊会在 {formatOpenDate(capsule.openAt)} 开启</span>
                <span className="block" style={{ whiteSpace: "nowrap" }}>距离大家重新看到里面的内容</span>
              </p>
              <div className="mt-6">
                <CountdownChip openAt={capsule.openAt} large />
              </div>
            </div>

            <div className="paper-panel panel-amber rounded-[2.3rem] p-6 sm:p-8 lg:sticky lg:top-6">
              <div className="section-label text-xs">Before It Opens</div>
              <p className="display-type mt-4 text-2xl leading-tight sm:text-3xl" style={{ whiteSpace: "nowrap" }}>
                现在还不能看 只能继续往里放内容
              </p>
              <p className="body-copy mt-4 text-sm leading-7">
                <span className="block" style={{ whiteSpace: "nowrap" }}>开启前不会展示任何已上传内容 包括创建者自己</span>
                <span className="block" style={{ whiteSpace: "nowrap" }}>你现在能做的 就是继续上传照片和一句话</span>
              </p>
            </div>
          </aside>

          <UploadContributionForm
            capsuleId={capsule.id}
            capsuleTitle={capsule.title}
            openAt={capsule.openAt}
          />
        </section>
      </div>
    </main>
  );
}
