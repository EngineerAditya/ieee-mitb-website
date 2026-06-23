"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/auth/require-admin";
import {
  createArticle,
  deleteArticle,
  updateArticle,
} from "@/lib/data/articles";
import { articleInputSchema } from "@/lib/validations/article";
import {
  type ActionState,
  errorState,
  resolveImageUrl,
  toObject,
  validationError,
} from "./_shared";

function revalidateArticles() {
  revalidatePath("/articles");
  revalidatePath("/admin/articles");
}

export async function createArticleAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await assertAdmin();
    const obj = toObject(formData);
    obj.imageUrl = await resolveImageUrl(formData, "articles");
    const parsed = articleInputSchema.safeParse(obj);
    if (!parsed.success) return validationError(parsed.error);
    await createArticle(parsed.data);
  } catch (e) {
    return errorState(e);
  }
  revalidateArticles();
  redirect("/admin/articles");
}

export async function updateArticleAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  try {
    await assertAdmin();
    if (!id) return { ok: false, error: "Missing article id." };
    const obj = toObject(formData);
    obj.imageUrl = await resolveImageUrl(formData, "articles");
    const parsed = articleInputSchema.safeParse(obj);
    if (!parsed.success) return validationError(parsed.error);
    await updateArticle(id, parsed.data);
  } catch (e) {
    return errorState(e);
  }
  revalidateArticles();
  redirect("/admin/articles");
}

export async function deleteArticleAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await deleteArticle(id);
  revalidateArticles();
  redirect("/admin/articles");
}
