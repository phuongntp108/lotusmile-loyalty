"use client";

import { createContext, ReactNode, useContext, createElement } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import { LoginUser, RegisterUser, User } from "@/types";
import { useToast } from "./use-toast";
import { getAccessToken, saveAccessToken } from "@/helpers/access-token";
import { useRouter } from "next/navigation";
import { FetchError } from "ofetch";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<
    {
      user: User;
    },
    FetchError,
    LoginUser,
    unknown
  >;
  logoutMutation: any;
  registerMutation: UseMutationResult<
    {
      user: User;
    },
    Error,
    RegisterUser,
    unknown
  >;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const router = useRouter();

  const {
    data: user,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["/api/user"],
    queryFn: async () => {
      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${getAccessToken() ?? ""}` },
      });

      if (!res.ok) {
        router.push("/auth-page");
        throw new Error("Unauthorized");
      }

      return (await res.json()).profile.user;
    },
    retry: false,
    enabled: !!getAccessToken(),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginUser) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      saveAccessToken(res.token);
      return res.data;
    },
    onSuccess: (res: { user: User }) => {
      queryClient.setQueryData(["/api/user"], res.user);
      router.push("/requests");
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    },
    onError: (error: FetchError) => {
      toast({
        title: "Login failed",
        description: error.data.error ?? error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterUser) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      saveAccessToken(res.token);
      return res.data;
    },
    onSuccess: (res: { user: User }) => {
      queryClient.setQueryData(["/api/user"], res.user);
      router.push("/requests");
      toast({
        title: "Welcome to Smile Airlines!",
        description: "Your account has been created successfully.",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Goodbye!",
        description: "You have been logged out successfully.",
      });
    },
    onError: (error: Error) => {
      // toast({
      //   title: "Logout failed",
      //   description: error.message,
      //   variant: "destructive",
      // });
    },
  });

  const value: AuthContextType = {
    user: user ?? null,
    isLoading: !isSuccess,
    error,
    loginMutation,
    logoutMutation,
    registerMutation,
    isAuthenticated: !!user,
  };

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
