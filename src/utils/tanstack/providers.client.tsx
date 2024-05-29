"use client";
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

function Providers({ children }: React.PropsWithChildren) {
  const [client] = React.useState(() => new QueryClient());

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export default Providers;
