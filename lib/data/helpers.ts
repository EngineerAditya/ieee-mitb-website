import { slugify } from "@/lib/utils";

/**
 * Generate a slug from `base` that is unique according to `exists`. Appends
 * `-2`, `-3`, … on collision.
 */
export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const root = slugify(base) || "item";
  let slug = root;
  let n = 2;
  while (await exists(slug)) {
    slug = `${root}-${n++}`;
  }
  return slug;
}
