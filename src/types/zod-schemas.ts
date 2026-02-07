import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const ParseRamenRequest = z
  .object({ text: z.string().min(1).max(1000) })
  .passthrough();
const RamenData = z
  .object({
    name: z.string(),
    categories: z.array(z.string()).default([]),
    rating: z.number().int().gte(1).lte(5).nullable().default(null),
    location: z.string().nullable().default(null),
    review: z.string().nullable().default(null),
  })
  .passthrough();
const ErrorResponse = z
  .object({ error: z.string(), code: z.string() })
  .passthrough();

export const schemas = {
  ParseRamenRequest,
  RamenData,
  ErrorResponse,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/api/parse-ramen",
    alias: "parseRamen",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ text: z.string().min(1).max(1000) }).passthrough(),
      },
    ],
    response: RamenData,
    errors: [
      {
        status: 400,
        description: `リクエスト不備（入力テキストが空、または不正）`,
        schema: ErrorResponse,
      },
      {
        status: 422,
        description: `LLM解析失敗（データが仕様を満たさない）`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `サーバー内部エラー`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `外部サービスエラー（Gemini APIへの接続失敗）`,
        schema: ErrorResponse,
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
