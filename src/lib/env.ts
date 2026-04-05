export const env = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_PHOTOS_BUCKET: process.env.SUPABASE_PHOTOS_BUCKET ?? "capsule-photos",
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  CRON_SECRET: process.env.CRON_SECRET,
} as const;

export function hasSupabaseConfig() {
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function hasResendConfig() {
  return Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL);
}

export function getAppUrl() {
  return env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
