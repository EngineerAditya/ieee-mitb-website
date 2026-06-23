"use client";

import { useActionState } from "react";
import {
  createTeamMemberAction,
  updateTeamMemberAction,
} from "@/lib/actions/team";
import { initialActionState } from "@/lib/actions/types";
import type { TeamMember } from "@/db/schema";
import {
  CheckboxField,
  FormBanner,
  ImageField,
  SubmitButton,
  TextField,
} from "./fields";

export default function TeamForm({ member }: { member?: TeamMember }) {
  const action = member ? updateTeamMemberAction : createTeamMemberAction;
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormBanner state={state} />
      {member && <input type="hidden" name="id" value={member.id} />}

      <TextField
        label="Name"
        name="name"
        defaultValue={member?.name}
        required
      />
      <TextField
        label="Position"
        name="position"
        defaultValue={member?.position}
        required
      />
      <ImageField label="Photo" currentUrl={member?.photoUrl} />
      <TextField label="Email" name="email" defaultValue={member?.email} />
      <TextField
        label="LinkedIn"
        name="linkedin"
        type="url"
        defaultValue={member?.linkedin}
      />
      <TextField
        label="Term"
        name="term"
        defaultValue={member?.term}
        placeholder="2025-26"
      />
      <CheckboxField
        label="Current"
        name="isCurrent"
        defaultChecked={member?.isCurrent ?? true}
      />
      <TextField
        label="Display order"
        name="displayOrder"
        type="number"
        defaultValue={String(member?.displayOrder ?? 0)}
      />
      <SubmitButton label={member ? "Save changes" : "Create member"} />
    </form>
  );
}
