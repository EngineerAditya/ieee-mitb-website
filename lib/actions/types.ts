/**
 * Client-safe action types/state. Kept separate from `_shared.ts` (which pulls
 * in server-only code: storage / service-role client / env) so Client Component
 * forms can import `initialActionState` / `ActionState` WITHOUT dragging
 * server-only modules into the client bundle.
 */
export type ActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const initialActionState: ActionState = { ok: false };
