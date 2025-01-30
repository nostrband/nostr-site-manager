import { generatePrivateKey, getPublicKey } from "nostr-tools";
import { addOnAuth } from "./nostr";

export async function signup(username: string) {
  const sk = generatePrivateKey();
  const pubkey = getPublicKey(sk);
  const event = {
    type: 'signup',
    method: 'local',
    pubkey,
    name: username,
    localNsec: sk,
  }
  console.log("set auth", event);

  // add listener before sending our event 
  // to make sure we receive the event
  const promise = new Promise<void>(ok => {
    addOnAuth(async (type: string) => {
      if (type === 'login') ok();
    })
  });

  // notify nostr-login
  document.dispatchEvent(new CustomEvent('nlSetAuth', { detail: event }));

  // wait for onAuth from nostr-login
  await promise;
}
