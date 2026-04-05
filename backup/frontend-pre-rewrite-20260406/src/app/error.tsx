"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BrandMark } from "@/components/brand-mark";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("GlobalError", error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body className="page-wrap">
        <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 lg:px-10">
          <header className="py-4">
            <BrandMark />
          </header>

          <main className="paper-panel rounded-[2.2rem] px-6 py-12 text-center sm:px-10">
            <div className="section-label text-xs">Something Went Wrong</div>
            <h1 className="display-type mt-4 text-4xl sm:text-5xl">
              这页刚刚没能打开。
            </h1>
            <p className="fine-copy body-copy mx-auto mt-4 max-w-2xl text-sm sm:text-base">
              可能是网络波动、数据连接暂时异常，或者这条链接对应的内容正在更新。
              你可以先重试一次；如果还是不行，再回到首页重新进入。
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="primary-button h-14 px-6 text-sm font-medium"
              >
                重新试一次
              </button>
              <Link href="/" className="secondary-button h-14 px-6 text-sm">
                回到首页
              </Link>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
