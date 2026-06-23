"use client";

import { useActionState } from "react";
import {
  createArticleAction,
  updateArticleAction,
} from "@/lib/actions/articles";
import { initialActionState } from "@/lib/actions/types";
import type { Article } from "@/db/schema";
import { toDateInput } from "@/lib/utils";
import {
  FormBanner,
  ImageField,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
} from "./fields";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export default function ArticleForm({
  article,
  societies,
}: {
  article?: Article;
  societies: { id: string; name: string }[];
}) {
  const action = article ? updateArticleAction : createArticleAction;
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormBanner state={state} />
      {article && <input type="hidden" name="id" value={article.id} />}

      <TextField
        label="Title"
        name="title"
        defaultValue={article?.title}
        required
      />
      <SelectField
        label="Society"
        name="societyId"
        defaultValue={article?.societyId ?? ""}
        blankLabel="— None —"
        options={societies.map((s) => ({ value: s.id, label: s.name }))}
      />
      <TextField label="Author" name="author" defaultValue={article?.author} />
      <TextField
        label="Publication"
        name="publication"
        defaultValue={article?.publication}
      />
      <TextField
        label="Publication date"
        name="publicationDate"
        type="date"
        defaultValue={toDateInput(article?.publicationDate)}
      />
      <TextField
        label="External URL"
        name="externalUrl"
        type="url"
        defaultValue={article?.externalUrl}
      />
      <TextAreaField
        label="Excerpt"
        name="excerpt"
        defaultValue={article?.excerpt}
        rows={3}
      />
      <TextAreaField
        label="Body"
        name="body"
        defaultValue={article?.body}
        rows={8}
      />
      <ImageField currentUrl={article?.imageUrl} />
      <SelectField
        label="Status"
        name="status"
        defaultValue={article?.status ?? "draft"}
        options={STATUS_OPTIONS}
      />
      <SubmitButton label={article ? "Save changes" : "Create article"} />
    </form>
  );
}
