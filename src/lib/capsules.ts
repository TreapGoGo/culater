import { env } from "@/lib/env";
import type { Database } from "@/lib/database.types";
import { getSupabaseAdminClient } from "@/lib/supabase";
import type { Capsule, Contribution } from "@/lib/types";

type CapsuleRow = Database["public"]["Tables"]["capsules"]["Row"];
type ContributionRow = Database["public"]["Tables"]["contributions"]["Row"];

type CreateCapsuleInput = {
  title: string;
  creatorName: string;
  creatorEmail: string;
  openAt: string;
};

type CreateContributionInput = {
  capsuleId: string;
  nickname: string;
  email: string;
  message: string | null;
  photos: string[];
};

function mapCapsule(row: CapsuleRow): Capsule {
  return {
    id: row.id,
    title: row.title,
    creatorName: row.creator_name,
    creatorEmail: row.creator_email,
    openAt: row.open_at,
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapContribution(row: ContributionRow): Contribution {
  return {
    id: row.id,
    capsuleId: row.capsule_id,
    nickname: row.nickname,
    email: row.email,
    message: row.message,
    photos: row.photos,
    createdAt: row.created_at,
  };
}

export async function createCapsule(input: CreateCapsuleInput) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("capsules")
    .insert({
      title: input.title,
      creator_name: input.creatorName,
      creator_email: input.creatorEmail,
      open_at: input.openAt,
      status: "collecting",
    })
    .select("*")
    .single<CapsuleRow>();

  if (error) {
    throw error;
  }

  return mapCapsule(data);
}

export async function getCapsuleById(capsuleId: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("capsules")
    .select("*")
    .eq("id", capsuleId)
    .maybeSingle<CapsuleRow>();

  if (error) {
    throw error;
  }

  return data ? mapCapsule(data) : null;
}

export async function createContribution(input: CreateContributionInput) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("contributions")
    .insert({
      capsule_id: input.capsuleId,
      nickname: input.nickname,
      email: input.email,
      message: input.message,
      photos: input.photos,
    })
    .select("*")
    .single<ContributionRow>();

  if (error) {
    throw error;
  }

  return mapContribution(data);
}

export async function listContributionsByCapsule(capsuleId: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("contributions")
    .select("*")
    .eq("capsule_id", capsuleId)
    .order("created_at", { ascending: true })
    .returns<ContributionRow[]>();

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapContribution);
}

export async function listDueCapsules(nowIso: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("capsules")
    .select("*")
    .in("status", ["collecting", "sealed"])
    .lte("open_at", nowIso)
    .returns<CapsuleRow[]>();

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapCapsule);
}

export async function markCapsuleOpened(capsuleId: string) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("capsules")
    .update({
      status: "opened",
    })
    .eq("id", capsuleId);

  if (error) {
    throw error;
  }
}

export function getPhotoUrl(path: string) {
  const supabase = getSupabaseAdminClient();
  const { data } = supabase.storage
    .from(env.SUPABASE_PHOTOS_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}
