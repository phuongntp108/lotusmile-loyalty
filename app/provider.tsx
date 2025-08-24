"use client";

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import "./globals.css";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

export default Providers;
