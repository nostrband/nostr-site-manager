import { SiteType } from "@/services/nostr/onboard";

export type TypeAuthor = {
  pubkey: string;
  type: SiteType;
  kinds: number[];
  typename: string;
  img?: string;
  name?: string;
  about?: string;
};

export type SelectTypeSite = {
  type: SiteType;
  typename: string;
  description: string;
  kinds: number[];
};

export type TaskType = {
  text: string;
  isCompleted: boolean;
  paymentPlan: string;
  id: string;
};