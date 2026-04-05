import Link from "next/link";

export function BrandMark() {
  return (
    <Link href="/" className="inline-flex min-h-12 items-center gap-4 text-sm font-medium">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--paper)] text-xl shadow-[0_14px_28px_color-mix(in_oklab,var(--shadow)_60%,transparent)]">
        💊
      </span>
      <span className="flex flex-col justify-center">
        <span className="block display-type text-[1.35rem] leading-none">See You Later</span>
        <span className="fine-copy text-[0.7rem] tracking-[0.22em] uppercase">
          Memory Capsule
        </span>
      </span>
    </Link>
  );
}
