import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/data/public";

type Tag = keyof typeof CACHE_TAGS;

/** Purge cached public content so admin edits appear on the site immediately. */
export function revalidatePublicContent(...tags: Tag[]) {
  for (const tag of tags.length ? tags : (Object.keys(CACHE_TAGS) as Tag[])) {
    revalidateTag(CACHE_TAGS[tag]);
  }
  revalidatePath("/", "layout");
}
