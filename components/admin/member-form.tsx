"use client";

import { useActionState } from "react";
import {
  createMemberAction,
  updateMemberAction,
} from "@/lib/actions/societies";
import { initialActionState } from "@/lib/actions/types";
import type { SocietyMember } from "@/db/schema";
import {
  FormBanner,
  ImageField,
  SelectField,
  SubmitButton,
  TextField,
} from "./fields";

const MEMBER_TYPE_OPTIONS = [
  { value: "student", label: "Student" },
  { value: "faculty", label: "Faculty" },
];

export default function MemberForm({
  societyId,
  member,
}: {
  societyId: string;
  member?: SocietyMember;
}) {
  const action = member ? updateMemberAction : createMemberAction;
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormBanner state={state} />
      {member && <input type="hidden" name="id" value={member.id} />}
      <input type="hidden" name="societyId" value={societyId} />

      <SelectField
        label="Member type"
        name="memberType"
        defaultValue={member?.memberType ?? "student"}
        options={MEMBER_TYPE_OPTIONS}
      />
      <TextField
        label="Name"
        name="name"
        defaultValue={member?.name}
        required
      />
      <TextField
        label="Role / Title"
        name="roleTitle"
        defaultValue={member?.roleTitle}
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
        label="Display order"
        name="displayOrder"
        type="number"
        defaultValue={String(member?.displayOrder ?? 0)}
      />
      <SubmitButton label={member ? "Save changes" : "Create member"} />
    </form>
  );
}
