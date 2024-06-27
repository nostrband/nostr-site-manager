import { SITE_RELAY, SERVER_PUBKEY } from "../../../services/nostr/consts"; 

export async function GET() {
  const data = {
    names: {
      "_": SERVER_PUBKEY
    },
    relays: {
    }
  }
  data.relays[SERVER_PUBKEY] = [SITE_RELAY];
 
  return Response.json(data)
}

export async function OPTIONS() {
  return GET();
}
