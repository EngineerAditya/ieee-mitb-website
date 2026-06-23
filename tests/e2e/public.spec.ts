import { expect, test } from "@playwright/test";

/**
 * Smoke tests for the public site and the admin auth gate.
 *
 * These run a production build against a live, migrated + seeded Supabase
 * project (set the env in `.env.local` / CI secrets). Without a real database
 * the dynamic pages will error, so this suite is excluded from the default CI
 * job — run it with `npm run test:e2e` once Supabase is connected.
 */
test("home page renders the hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /IEEE MIT/i })).toBeVisible();
});

test("events page renders", async ({ page }) => {
  await page.goto("/events");
  await expect(
    page.getByRole("heading", { name: "IEEE Events" }),
  ).toBeVisible();
});

test("societies overview renders", async ({ page }) => {
  await page.goto("/societies");
  await expect(
    page.getByRole("heading", { name: "IEEE Societies" }),
  ).toBeVisible();
});

test("admin area redirects unauthenticated users to login", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
});
