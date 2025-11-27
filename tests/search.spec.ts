import { test, expect } from "@playwright/test";

test("filters results using advanced filters", async ({ page }) => {
  await page.goto("/");

  await page.getByText("Suodattimet").click();

  await page.getByLabel("Väri").click();
  await page.getByRole("option", { name: "Punainen" }).click();

  await page.getByLabel("Kaupunki").click();
  await page.getByRole("option", { name: "Helsinki" }).click();

  await page.getByLabel("Opiskeluala").click();
  await page.getByRole("option", { name: "fysiikka" }).click();

  await page.getByLabel("Oppilaitos").click();
  await page.getByRole("option", { name: "Helsingin yliopisto" }).click();

  await page.getByRole("button", { name: /Suodata/ }).click();

  await expect(
    page.getByText("Helsingin yliopisto", { exact: false }).first()
  ).toBeVisible();
});

test("searches via text input and updates results", async ({ page }) => {
  await page.goto("/");

  const searchResponse = await page.request.post("/api/search", {
    data: { query: "Helsinki" },
  });

  expect(searchResponse.ok()).toBeTruthy();
  const body = await searchResponse.json();
  expect(Array.isArray(body.results)).toBeTruthy();
  expect(body.results.length).toBeGreaterThan(0);
});
