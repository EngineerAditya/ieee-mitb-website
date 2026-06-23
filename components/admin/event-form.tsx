"use client";

import { useActionState } from "react";
import { createEventAction, updateEventAction } from "@/lib/actions/events";
import { initialActionState } from "@/lib/actions/types";
import type { Event } from "@/db/schema";
import { toDateTimeLocal } from "@/lib/utils";
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

export default function EventForm({
  event,
  societies,
}: {
  event?: Event;
  societies: { id: string; name: string }[];
}) {
  const action = event ? updateEventAction : createEventAction;
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormBanner state={state} />
      {event && <input type="hidden" name="id" value={event.id} />}

      <TextField
        label="Title"
        name="title"
        defaultValue={event?.title}
        required
      />
      <SelectField
        label="Society"
        name="societyId"
        defaultValue={event?.societyId ?? ""}
        blankLabel="— None (organisation-wide) —"
        options={societies.map((s) => ({ value: s.id, label: s.name }))}
      />
      <TextAreaField
        label="Description"
        name="description"
        defaultValue={event?.description}
        rows={5}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField
          label="Starts at"
          name="startAt"
          type="datetime-local"
          defaultValue={toDateTimeLocal(event?.startAt)}
          required
        />
        <TextField
          label="Ends at"
          name="endAt"
          type="datetime-local"
          defaultValue={toDateTimeLocal(event?.endAt)}
        />
      </div>
      <TextField label="Venue" name="venue" defaultValue={event?.venue} />
      <TextField
        label="Registration URL"
        name="registrationUrl"
        type="url"
        defaultValue={event?.registrationUrl}
      />
      <TextField
        label="Event type"
        name="eventType"
        defaultValue={event?.eventType}
        placeholder="Workshop, Talk, Hackathon…"
      />
      <ImageField currentUrl={event?.imageUrl} />
      <SelectField
        label="Status"
        name="status"
        defaultValue={event?.status ?? "draft"}
        options={STATUS_OPTIONS}
      />
      <SubmitButton label={event ? "Save changes" : "Create event"} />
    </form>
  );
}
