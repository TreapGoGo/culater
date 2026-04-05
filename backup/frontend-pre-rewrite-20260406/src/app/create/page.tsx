import { addMinutes, format } from "date-fns";
import { BrandMark } from "@/components/brand-mark";
import { CreateCapsuleForm } from "@/components/create-capsule-form";
import { JourneySteps } from "@/components/journey-steps";

type CreatePageProps = {
  searchParams: Promise<{
    mode?: string;
  }>;
};

export default async function CreatePage({ searchParams }: CreatePageProps) {
  const resolvedSearchParams = await searchParams;
  const isDemoMode = resolvedSearchParams.mode === "demo";

  return (
    <main className="page-wrap">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
        <header className="py-4">
          <BrandMark />
        </header>
        <section className="py-6 lg:py-12">
          <JourneySteps current="create" className="mb-8 lg:mb-10" />

          <div className="mb-8 grid gap-5 lg:mb-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <div className="editorial-kicker">Create A Capsule</div>
              <h1 className="display-type mt-4 text-4xl leading-tight sm:text-6xl">
                先决定，
                <br />
                它要在哪一分钟醒来。
              </h1>
            </div>
            <p className="hero-note fine-copy body-copy max-w-2xl text-sm sm:text-base">
              这一页不只是填表。它更像是在替一段回忆写好投递时间，让你们在未来某个具体时刻，
              再被轻轻叫回同一段空气里。
            </p>
          </div>
          <CreateCapsuleForm
            preset={
              isDemoMode
                ? {
                    mode: "demo",
                    title: "今晚的测试胶囊",
                    openAt: format(addMinutes(new Date(), 2), "yyyy-MM-dd'T'HH:mm"),
                  }
                : undefined
            }
          />
        </section>
      </div>
    </main>
  );
}
