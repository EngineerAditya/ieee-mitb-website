"use client";

import { useActionState } from "react";
import {
  createSocietyAction,
  updateSocietyAction,
} from "@/lib/actions/societies";
import { initialActionState } from "@/lib/actions/types";
import type { Society } from "@/db/schema";
import {
  FormBanner,
  ImageField,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
} from "./fields";

const TYPE_OPTIONS = [
  { value: "society", label: "Society" },
  { value: "affinity", label: "Affinity" },
];

export default function SocietyForm({ society }: { society?: Society }) {
  const action = society ? updateSocietyAction : createSocietyAction;
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormBanner state={state} />
      {society && <input type="hidden" name="id" value={society.id} />}

      <TextField
        label="Slug"
        name="slug"
        defaultValue={society?.slug}
        required
      />
      <TextField
        label="Name"
        name="name"
        defaultValue={society?.name}
        required
      />
      <TextField
        label="Short name"
        name="shortName"
        defaultValue={society?.shortName}
      />
      <SelectField
        label="Type"
        name="type"
        defaultValue={society?.type ?? "society"}
        options={TYPE_OPTIONS}
      />
      <TextAreaField
        label="About"
        name="about"
        defaultValue={society?.about}
        rows={6}
      />
      <TextField
        label="Tagline"
        name="tagline"
        defaultValue={society?.tagline}
      />
      <ImageField label="Logo" currentUrl={society?.logoUrl} />
      <TextField
        label="Theme color"
        name="themeColor"
        defaultValue={society?.themeColor}
        placeholder="#0EA5E9"
      />
      <TextField label="Email" name="email" defaultValue={society?.email} />
      <TextField
        label="Instagram"
        name="instagram"
        type="url"
        defaultValue={society?.instagram}
      />
      <TextField
        label="LinkedIn"
        name="linkedin"
        type="url"
        defaultValue={society?.linkedin}
      />
      <TextField
        label="Display order"
        name="displayOrder"
        type="number"
        defaultValue={String(society?.displayOrder ?? 0)}
      />
      <SubmitButton label={society ? "Save changes" : "Create society"} />
    </form>
  );
}
