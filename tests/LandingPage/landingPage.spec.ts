import { test, expect } from "@playwright/test";
import { LandingPage } from "../page-objects/LandingPage";

test.describe("Landing Page Tests", () => {
  let landingPage: LandingPage;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await landingPage.navigate();

    // const __nostrlogin_accounts =
    //   '[{"authMethod":"connect","pubkey":"b33f4a427387a151c82a5925b3c9fa631b240563a9c8b82f42af18655845fb2f","signerPubkey":"b33f4a427387a151c82a5925b3c9fa631b240563a9c8b82f42af18655845fb2f","sk":"a125131e742541bcf691f4f96d27ba40fc198757e2768f9978f472404f4749dd","domain":"nsec.app","relays":["wss://relay.nsec.app/"],"iframeUrl":"","bunkerUrl":"bunker://b33f4a427387a151c82a5925b3c9fa631b240563a9c8b82f42af18655845fb2f?relay=wss://relay.nsec.app/","picture":"https://image.nostr.build/535960683182e3284dd54b97bf180266e59ffe1c6a33c64c3e9fcadcb61d94f9.png","name":"Jhon Show"}]';
    // await page.evaluate((__nostrlogin_accounts) => {
    //   localStorage.setItem("__nostrlogin_accounts", __nostrlogin_accounts);
    // }, __nostrlogin_accounts);

    // const __nostrlogin_nip46 =
    //   '{"authMethod":"connect","pubkey":"b33f4a427387a151c82a5925b3c9fa631b240563a9c8b82f42af18655845fb2f","signerPubkey":"b33f4a427387a151c82a5925b3c9fa631b240563a9c8b82f42af18655845fb2f","sk":"a125131e742541bcf691f4f96d27ba40fc198757e2768f9978f472404f4749dd","domain":"nsec.app","relays":["wss://relay.nsec.app/"],"iframeUrl":"","bunkerUrl":"bunker://b33f4a427387a151c82a5925b3c9fa631b240563a9c8b82f42af18655845fb2f?relay=wss://relay.nsec.app/","picture":"https://image.nostr.build/535960683182e3284dd54b97bf180266e59ffe1c6a33c64c3e9fcadcb61d94f9.png","name":"Jhon Show"}';
    // await page.evaluate((__nostrlogin_nip46) => {
    //   localStorage.setItem("__nostrlogin_nip46", __nostrlogin_nip46);
    // }, __nostrlogin_nip46);

    // const localAuth =
    //   '{"type":"login","pubkey":"b33f4a427387a151c82a5925b3c9fa631b240563a9c8b82f42af18655845fb2f","localNsec":"nsec15yj3x8n5y4qmea537nuk6fa6gr7pnp6hufmglxtc73eyqn68f8wsq9dt2y","relays":["wss://relay.nsec.app/"],"method":"connect"}';
    // await page.evaluate((localAuth) => {
    //   localStorage.setItem("localAuth", localAuth);
    // }, localAuth);

    // const localUserProfile =
    //   '{"created_at":1730202166,"content":"{\"picture\":\"https://image.nostr.build/535960683182e3284dd54b97bf180266e59ffe1c6a33c64c3e9fcadcb61d94f9.png\",\"website\":\"\",\"lud16\":\"\",\"nip05\":\"\",\"name\":\"Jhon Show\"}","tags":[],"kind":0,"pubkey":"b33f4a427387a151c82a5925b3c9fa631b240563a9c8b82f42af18655845fb2f","id":"5b77a8cc8dc97f2a9c1d07a0214b92cb9ccac9130cf72ed3e7dc7b114d7dce10","sig":"8cc9b8931f3ef60a764c0308d2e504489c8d68153643fe5890225d26d284fda3da1fea3e19a46579b96727af3b09c1fd8f6e70a0bb89b617b11ea32dea694c57"}';
    // await page.evaluate((localUserProfile) => {
    //   localStorage.setItem("localUserProfile", localUserProfile);
    // }, localUserProfile);

    // const localUserPubkey =
    //   "b33f4a427387a151c82a5925b3c9fa631b240563a9c8b82f42af18655845fb2f";
    // await page.evaluate((localUserPubkey) => {
    //   localStorage.setItem("localUserPubkey", localUserPubkey);
    // }, localUserPubkey);

    // const localUserRelays =
    //   '["wss://nos.lol/","wss://relay.damus.io/","wss://nostr-pub.wellorder.net/","wss://atlas.nostr.land/","wss://eden.nostr.land/","wss://relay.minibolt.info/","wss://relay.snort.social/","wss://relaypag.es/","wss://relay.nostr.bg/","wss://purplerelay.com/","wss://nos.lol","wss://relay.primal.net","wss://relay.damus.io","wss://purplepag.es","wss://relay.npubpro.com"]';
    // await page.evaluate((localUserRelays) => {
    //   localStorage.setItem("localUserRelays", localUserRelays);
    // }, localUserRelays);

    // const token = "";
    // await page.evaluate((token) => {
    //   localStorage.setItem("token", token);
    // }, token);

    // const tokenPubkey = "";
    // await page.evaluate((tokenPubkey) => {
    //   localStorage.setItem("tokenPubkey", tokenPubkey);
    // }, tokenPubkey);
  });

  test("Full page", async ({ page }) => {
    await page.reload();
    await expect(landingPage.mySitesButton).toBeVisible();
    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot).toMatchSnapshot("landing-page.png");
  });

  test("Full page scroll and view sticky header", async ({ page }) => {
    await page.evaluate(() => window.scrollBy(0, 500));
    await expect(landingPage.getStartedButton).toBeVisible();
    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot).toMatchSnapshot("landing-page-scroll.png");
  });

  test("Scroll to themes section & hover theme", async ({ page }) => {
    await landingPage.scrollToThemesSection();
    await landingPage.hoverThemeElementImage();
    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot).toMatchSnapshot("landing-page-scroll-to-themes.png");
  });
});
