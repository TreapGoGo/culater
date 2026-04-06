import Link from "next/link";

export function BrandMark() {
  return (
    <Link href="/" className="syl-brand">
      <span className="syl-brand__mark" aria-hidden="true">
        <span className="syl-brand__capsule">
          <span className="syl-brand__capsule-half syl-brand__capsule-half--light" />
          <span className="syl-brand__capsule-half syl-brand__capsule-half--dark" />
          <span className="syl-brand__capsule-shine" />
        </span>
      </span>
      <span className="syl-brand__text">
        <span className="syl-brand__name">See You Later</span>
        <span className="syl-brand__meta">Memory Capsule</span>
      </span>
    </Link>
  );
}
