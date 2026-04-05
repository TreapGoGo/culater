import { BrandMark } from "@/components/brand-mark";
import { CreateCapsuleForm } from "@/components/create-capsule-form";

export default function CreatePage() {
  return (
    <main className="page-wrap">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
        <header className="py-4">
          <BrandMark />
        </header>
        <section className="py-6 lg:py-12">
          <CreateCapsuleForm />
        </section>
      </div>
    </main>
  );
}
