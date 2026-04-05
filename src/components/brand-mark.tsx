import Link from "next/link";

export function BrandMark() {
  return (
    <Link href="/" className="inline-flex items-center gap-3 text-sm font-medium">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--paper)] text-lg shadow-sm">
        💊
      </span>
      <span>
        <span className="block display-type text-lg leading-none">See You Later</span>
        <span className="fine-copy text-xs tracking-[0.16em] uppercase">
          Memory Capsule
        </span>
      </span>
    </Link>
  );
}
