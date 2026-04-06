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
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start xl:gap-6 xl:grid-cols-[minmax(0,1fr)_21.5rem]">
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

            <aside className="lg:sticky lg:top-8">
              <JourneySteps current="create" layout="stack" />
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
