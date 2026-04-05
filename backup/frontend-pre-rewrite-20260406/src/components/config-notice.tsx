type ConfigNoticeProps = {
  title: string;
  description: string;
};

const requiredEnv = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
];

export function ConfigNotice({ title, description }: ConfigNoticeProps) {
  return (
    <div className="paper-panel grain-overlay rounded-[2rem] p-8">
      <div className="section-label text-xs">Setup Required</div>
      <h2 className="display-type mt-3 text-3xl">{title}</h2>
      <p className="fine-copy mt-3 max-w-2xl text-sm leading-7">{description}</p>
      <div className="capsule-divider my-6" />
      <div className="grid gap-3 sm:grid-cols-2">
        {requiredEnv.map((item) => (
          <div
            key={item}
            className="rounded-[1.25rem] border border-[color:var(--line)] bg-white/70 px-4 py-3 text-sm"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
