"use client";
import { ReactNode, useEffect, useState } from "react";
import { SnackbarProvider } from "notistack";
import { AuthContext, onAuth, userPubkey } from "@/services/nostr/nostr";
import { Notification } from "../Notification";

let addedHandlers = false;
const AppWrapper = ({ children }: { children: ReactNode }) => {
  const [authed, setAuthed] = useState({
    isAuth: !!userPubkey,
    isLoading: false,
  });

  useEffect(() => {
    if (addedHandlers) return;

    // we're being added 2 times without this check
    addedHandlers = true;
    document.addEventListener("nlAuth", async (e: any) => {
      console.log("nlAuth", e);

      setAuthed((prev) => ({
        ...prev,
        isLoading: true,
      }));

      try {
        const getAuth = await onAuth(e);

        setAuthed({
          isAuth: getAuth,
          isLoading: false,
        });
      } catch (err) {
        setAuthed({
          isAuth: false,
          isLoading: false,
        });
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={authed}>
      <SnackbarProvider
        Components={{
          error: Notification,
          success: Notification,
          info: Notification,
          default: Notification,
          warning: Notification,
        }}
      >
        {children}
      </SnackbarProvider>
    </AuthContext.Provider>
  );
};

export default AppWrapper;
