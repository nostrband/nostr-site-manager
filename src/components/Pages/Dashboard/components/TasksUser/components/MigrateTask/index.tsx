import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { migrateToConnectedKey } from "@/services/nostr/migrate";
import { ItemButton } from "../ItemButton";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";

export const MigrateTask = ({ siteId }: { siteId: string }) => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [isLoadingConnectKeys, setLoadingConnectKeys] = useState(false);

  const handleConnectKeys = async () => {
    setLoadingConnectKeys(true);

    try {
      const newSiteId = await migrateToConnectedKey(siteId);
      enqueueSnackbar("Keys connected!", {
        autoHideDuration: 3000,
        variant: "success",
        anchorOrigin: {
          horizontal: "right",
          vertical: "bottom",
        },
      });

      setTimeout(() => {
        setLoadingConnectKeys(false);

        router.push(`/admin/${newSiteId}`);
      }, 500);
    } catch (e: any) {
      setLoadingConnectKeys(false);

      console.log("error", e);
      enqueueSnackbar("Error: " + e.toString(), {
        autoHideDuration: 3000,
        variant: "error",
        anchorOrigin: {
          horizontal: "right",
          vertical: "bottom",
        },
      });
    }
  };

  return (
    <>
      <ItemButton
        isLoading={isLoadingConnectKeys}
        onClick={handleConnectKeys}
      />

      <Dialog open={isLoadingConnectKeys}>
        <DialogTitle>Please wait for 30 seconds...</DialogTitle>
        <DialogContent>
          <SpinerWrap>
            <SpinerCircularProgress />
          </SpinerWrap>
        </DialogContent>
      </Dialog>
    </>
  );
};
