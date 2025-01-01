"use client";

import { QueryClientProvider as Provider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";

const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider client={queryClient}>{children}</Provider>
  );
};

export default QueryClientProvider;