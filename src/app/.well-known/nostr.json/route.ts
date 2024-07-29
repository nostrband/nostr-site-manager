import {
  SITE_RELAY,
  SERVER_PUBKEY,
  SUPPORT_PUBKEY,
} from "../../../services/nostr/consts";

export async function GET() {
  const data = {
    names: {
      _: SERVER_PUBKEY,
      support: SUPPORT_PUBKEY,
    },
    relays: {},
  };
  for (const i in data.names)
    data.relays[data.names[i]] = [SITE_RELAY, "wss://nos.lol"];

  return Response.json(data);
}

export async function OPTIONS() {
  return GET();
}
