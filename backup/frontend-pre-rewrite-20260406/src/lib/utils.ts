import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugifyFilename(filename: string) {
  const [name = "photo", extension = "jpg"] = filename.split(/\.(?=[^.]+$)/);
  const safeName = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  const safeExt = extension.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);

  return `${safeName || "photo"}.${safeExt || "jpg"}`;
}
