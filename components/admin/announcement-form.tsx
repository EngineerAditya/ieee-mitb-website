"use client";

import { useActionState } from "react";
import {
  createAnnouncementAction,
  updateAnnouncementAction,
} from "@/lib/actions/announcements";
import { initialActionState } from "@/lib/actions/types";
import type { Announcement } from "@/db/schema";
import { toDateTimeLocal } from "@/lib/utils";
import {
  FormBanner,
  ImageField,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
} from "./fields";

const KIND_OPTIONS = [
  { value: "announcement", label: "Announcement" },
  { value: "achievement", label: "Achievement" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export default function AnnouncementForm({
  announcement,
  societies,
}: {
  announcement?: Announcement;
  societies: { id: string; name: string }[];
}) {
  const action = announcement
    ? updateAnnouncementAction
    : createAnnouncementAction;
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormBanner state={state} />
      {announcement && (
        <input type="hidden" name="id" value={announcement.id} />
      )}

      <SelectField
        label="Kind"
        name="kind"
        defaultValue={announcement?.kind ?? "announcement"}
        options={KIND_OPTIONS}
      />
      <TextField
        label="Title"
        name="title"
        defaultValue={announcement?.title}
        required
      />
      <TextAreaField
        label="Body"
        name="body"
        defaultValue={announcement?.body}
        rows={6}
      />
      <ImageField currentUrl={announcement?.imageUrl} />
      <SelectField
        label="Society"
        name="societyId"
        defaultValue={announcement?.societyId ?? ""}
        blankLabel="— None —"
        options={societies.map((s) => ({ value: s.id, label: s.name }))}
      />
      <SelectField
        label="Status"
        name="status"
        defaultValue={announcement?.status ?? "draft"}
        options={STATUS_OPTIONS}
      />
      <TextField
        label="Published at"
        name="publishedAt"
        type="datetime-local"
        defaultValue={toDateTimeLocal(announcement?.publishedAt)}
      />
      <SubmitButton
        label={announcement ? "Save changes" : "Create announcement"}
      />
    </form>
  );
}
