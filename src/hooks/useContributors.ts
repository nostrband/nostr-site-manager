import { fetchProfiles } from "@/services/nostr/api";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useState, useEffect } from "react";

const useContributors = (pubkeysContributors: string[]) => {
  const [contributors, setContributors] = useState<NDKEvent[]>([]);

  useEffect(() => {
    fetchProfiles(pubkeysContributors)
      .then(setContributors)
      .catch(() => {
        setContributors([]);
      });
  }, [pubkeysContributors]);

  return contributors;
};

export default useContributors;
