"use client";

export default function DeleteButton({
  action,
  id,
  label = "Delete",
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Delete this item? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-md px-2 py-1 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10"
      >
        {label}
      </button>
    </form>
  );
}
