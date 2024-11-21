import { fetchProfiles } from "@/services/nostr/api";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useState, useEffect } from "react";

const useContributors = (
  pubkeysContributors: string[],
  isSeveralAuthor: boolean,
) => {
  const [contributors, setContributors] = useState<NDKEvent[]>([]);

  useEffect(() => {
    if (isSeveralAuthor) {
      fetchProfiles(pubkeysContributors)
        .then((p) => {
          if (p.length) {
            setContributors(p);
          } else {
            setContributors([]);
          }
        })
        .catch(() => {
          setContributors([]);
        });
    } else {
      setContributors([]);
    }
  }, [pubkeysContributors, isSeveralAuthor]);

  return contributors;
};

export default useContributors;
