import { nip19 } from "nostr-tools";

// https://stackoverflow.com/a/12646864
export function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function countItems<T>(array: T[]): Map<T, number> {
  const count = new Map<T, number>();
  array.forEach(function (i) {
    count.set(i, (count.get(i) || 0) + 1);
  });
  return count;
}

type MutexEntry = {
  cb: () => Promise<any>;
  ok: (r: any) => void;
  err: (r: any) => void;
};

export class Mutex {
  private queue: MutexEntry[] = [];
  private running = false;

  private async execute() {
    const { cb, ok, err } = this.queue.shift()!;
    this.running = true;
    try {
      ok(await cb());
    } catch (e) {
      err(e);
    }
    this.running = false;
    if (this.queue.length > 0) this.execute();
  }

  public hasPending() {
    return this.queue.length > 0;
  }

  public async run<T>(cb: () => Promise<T>) {
    return new Promise<T>((ok, err) => {
      this.queue.push({ cb, ok, err });
      if (!this.running && this.queue.length === 1) this.execute();
    });
  }
}

export function eventIdToTag(id: string) {
  const { type, data } = nip19.decode(id);
  switch (type) {
    case "note":
      return data;
    case "naddr":
      return `${data.kind}:${data.pubkey}:${data.identifier}`;
    default:
      throw new Error("Invalid related id " + id);
  }
}
