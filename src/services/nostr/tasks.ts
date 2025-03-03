import { SETTINGS_CONFIG } from "@/consts";
import { TaskType } from "@/types";
import { parseAddr } from "libnostrsite";
import { fetchWithSession } from "./nostr";

const SITE_TASKS: TaskType[] = [
  {
    text: "Set site info",
    isCompleted: false,
    paymentPlan: "base",
    id: "1",
  },
  {
    text: "Set site logo",
    isCompleted: false,
    paymentPlan: "base",
    id: "2",
  },
  {
    text: "Set accent color",
    isCompleted: false,
    paymentPlan: "base",
    id: "3",
  },
  {
    text: "Set site address",
    isCompleted: false,
    paymentPlan: "base",
    id: "4",
  },
  {
    text: "Set auto-import for new posts",
    isCompleted: false,
    paymentPlan: "base",
    id: "5",
  },
  {
    text: "Edit theme settings",
    isCompleted: false,
    paymentPlan: "base",
    id: "6",
  },
  {
    text: "Edit top menu",
    isCompleted: false,
    paymentPlan: "base",
    id: "7",
  },
  {
    text: "Set call-to-action",
    isCompleted: false,
    paymentPlan: "base",
    id: "8",
  },
  {
    text: "Attach custom domain",
    isCompleted: false,
    paymentPlan: "pro",
    id: "9",
  },
];

export const SITE_TASK_SETTINGS = [
  { id: "1,", anchor: SETTINGS_CONFIG.titleDescription.anchor },
  { id: "2", anchor: SETTINGS_CONFIG.logo.anchor },
  { id: "3", anchor: SETTINGS_CONFIG.accentColor.anchor },
  { id: "4", anchor: SETTINGS_CONFIG.websiteAddress.anchor },
  { id: "5", anchor: SETTINGS_CONFIG.content.anchor },
  { id: "6", anchor: SETTINGS_CONFIG.theme.anchor },
  { id: "7", anchor: SETTINGS_CONFIG.navigation.anchor },
  { id: "8", anchor: SETTINGS_CONFIG.other.anchor },
  { id: "9", anchor: SETTINGS_CONFIG.customDomains.anchor },
];

function formatKey(siteId: string) {
  const addr = parseAddr(siteId);
  return `doneTasks_${addr.pubkey}_${addr.identifier}`;
}

async function fetchDoneTasks(siteId: string) {
  const key = formatKey(siteId);
  const reply = await fetchWithSession(`/data?key=${key}`);
  if (reply.status !== 200) throw new Error("Failed to get data");
  const r = await reply.json();
  return r[key] ? JSON.parse(r[key]) : {};
}

export async function fetchTasks(siteId: string) {
  const tasks = [...SITE_TASKS];
  const value = await fetchDoneTasks(siteId);
  for (const t of tasks) {
    t.isCompleted = t.id in value && value[t.id];
  }

  return tasks;
}

export async function setDoneTask(siteId: string, taskId: string) {
  const value = await fetchDoneTasks(siteId);
  value[taskId] = true;

  const key = formatKey(siteId);
  const reply = await fetchWithSession(
    `/data?key=${key}&value=${encodeURIComponent(JSON.stringify(value))}`,
    "POST"
  );
  if (reply.status !== 200) throw new Error("Failed to reserve");
}
