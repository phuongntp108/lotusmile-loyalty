import { ofetch } from "ofetch";
import { QueryClient } from "@tanstack/react-query";

// ofetch đã auto parse JSON, nên trả về type an toàn hơn Response
export async function apiRequest<T = any>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  data?: Record<string, any> | BodyInit | null | undefined
): Promise<T> {
  return ofetch<T>(url, {
    method,
    body: data, // ofetch tự JSON.stringify
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
