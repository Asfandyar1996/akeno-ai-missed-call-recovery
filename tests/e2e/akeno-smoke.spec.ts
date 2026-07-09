import { expect, test } from "@playwright/test";

test.describe("public product pages", () => {
  test("landing page exposes enterprise navigation and primary CTA", async ({ page, isMobile }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Sign in to every roofing call you almost lost." })).toBeVisible();
    if (isMobile) {
      await page.getByRole("button", { name: "Open menu" }).click();
      const drawer = page.getByRole("complementary", { name: "Mobile homepage navigation" });
      await expect(drawer).toContainText("Privacy");
      await expect(drawer).toContainText("Contact");
      await expect(drawer.getByRole("link", { name: "Start setup" })).toBeVisible();
    } else {
      await expect(page.getByRole("navigation", { name: "Primary navigation" })).toContainText("Privacy");
      await expect(page.getByRole("navigation", { name: "Primary navigation" })).toContainText("Contact");
      await expect(page.getByRole("link", { name: "Start client setup" })).toBeVisible();
    }
  });

  test("privacy, contact, demo, and styleguide routes render", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();
    await expect(page.getByRole("link", { name: "contact@akenobuilds.com" })).toBeVisible();

    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: "Contact Akeno" })).toBeVisible();
    await expect(page.getByText("info@akenobuilds.com")).toBeVisible();

    await page.goto("/demo");
    await expect(page.getByRole("heading", { name: "Missed Call Recovery Simulator" })).toBeVisible();
    await page.getByRole("button", { name: "Trigger missed call" }).click();
    await expect(page.getByText("Instant missed-call text")).toBeVisible();
    await page.getByRole("button", { name: /Yes, water is actively coming in/ }).click();
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText("Active kitchen ceiling leak")).toBeVisible();
    await expect(page.getByText("Owner alert queued")).toBeVisible();

    await page.goto("/demo-chat");
    await expect(page.getByRole("heading", { name: "A roof leak, one missed call, and an urgent lead ready for dispatch." })).toBeVisible();

    await page.goto("/styleguide");
    await expect(page.getByRole("heading", { name: "Akeno styleguide" })).toBeVisible();
  });
});

test.describe("app workflows", () => {
  test("onboarding starts blank and shows setup guidance", async ({ page }) => {
    await page.goto("/onboarding?start=1");
    await expect(page.getByRole("heading", { name: "Akeno client onboarding setup" })).toBeAttached();
    await expect(page.getByText("Client setup workspace")).toBeVisible();
    await expect(page.getByText("Roofing company name")).toBeVisible();
  });

  test("dashboard and leads operations render with filters", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: "Recovery operations dashboard" })).toBeVisible();
    await expect(page.getByText("AI operating controls")).toBeVisible();

    await page.goto("/dashboard/leads");
    await expect(page.getByRole("heading", { name: "Roofing leads" })).toBeVisible();
    await expect(page.getByText("Lead operations")).toBeVisible();
    await expect(page.getByLabel("Search leads")).toBeVisible();
    await expect(page.getByRole("button", { name: "Export CSV" })).toBeVisible();
  });
});

test.describe("mobile navigation", () => {
  test("public mobile drawer includes home privacy and contact", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile-only drawer behavior");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("complementary", { name: "Mobile homepage navigation" })).toContainText("Home");
    await expect(page.getByRole("complementary", { name: "Mobile homepage navigation" })).toContainText("Privacy");
    await expect(page.getByRole("complementary", { name: "Mobile homepage navigation" })).toContainText("Contact");
  });

  test("dashboard mobile drawer includes public and app navigation", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile-only drawer behavior");
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("complementary", { name: "Mobile dashboard navigation" })).toContainText("Home");
    await expect(page.getByRole("complementary", { name: "Mobile dashboard navigation" })).toContainText("Leads");
    await expect(page.getByRole("complementary", { name: "Mobile dashboard navigation" })).toContainText("Contact");
  });
});
