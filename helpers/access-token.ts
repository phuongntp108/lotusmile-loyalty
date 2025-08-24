const TOKEN_KEY = "access_token";

/**
 * Lưu token vào localStorage
 */
export function saveAccessToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * Lấy token từ localStorage
 */
export function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * Xóa token khỏi localStorage
 */
export function clearAccessToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}
