import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export default function NotFound() {
  return (
    <main className="page-wrap">
      <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 lg:px-10">
        <header className="py-4">
          <BrandMark />
        </header>

        <section className="paper-panel rounded-[2.2rem] px-6 py-12 text-center sm:px-10">
          <div className="section-label text-xs">404</div>
          <h1 className="display-type mt-4 text-4xl sm:text-5xl">
            这颗胶囊不在这里。
          </h1>
          <p className="fine-copy mx-auto mt-4 max-w-2xl text-sm leading-7 sm:text-base">
            链接可能已经写错，或者这颗胶囊还没有被创建。你可以回到首页重新开始。
          </p>
          <Link href="/" className="primary-button mt-8 h-14 px-6 text-sm font-medium">
            回到首页
          </Link>
        </section>
      </div>
    </main>
  );
}
