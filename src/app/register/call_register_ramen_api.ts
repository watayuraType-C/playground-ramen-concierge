// src/app/register/call_register_ramen_api.ts
import { RegisterRamenData } from "./types";

/**
 * DB登録APIを呼び出します。
 */
export async function call_register_ramen_api(data: RegisterRamenData) {
  const response = await fetch("/api/register-ramen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "登録に失敗しました。");
  }

  return result as { id: string; message: string };
}