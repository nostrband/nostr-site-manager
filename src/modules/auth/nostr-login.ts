import { init } from "nostr-login";

export let authed = false;

export async function initNostrLogin() {

  init({
    perms: "sign_event:30512,sign_event:512,sign_event:30513,sign_event:30514",
  })
  
  document.addEventListener("nlAuth", (e: any) => {
    console.log("nlAuth", e);
    authed = e.detail.type !== 'logout';
  });  
}
