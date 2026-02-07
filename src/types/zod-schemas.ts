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
  .object({ message: z.string(), code: z.string() })
  .passthrough();
const RegisterRamenResponse = z
  .object({ id: z.string().uuid(), message: z.string() })
  .passthrough();

export const schemas = {
  ParseRamenRequest,
  RamenData,
  ErrorResponse,
  RegisterRamenResponse,
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
        description: `リクエストの形式が正しくありません`,
        schema: ErrorResponse,
      },
      {
        status: 422,
        description: `AIの解析に失敗しました`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `予期せぬエラー`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `外部サービス（Gemini/Supabase）に接続できません`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/api/register-ramen",
    alias: "registerRamen",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: RamenData,
      },
    ],
    response: RegisterRamenResponse,
    errors: [
      {
        status: 400,
        description: `リクエストの形式が正しくありません`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `予期せぬエラー`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `外部サービス（Gemini/Supabase）に接続できません`,
        schema: ErrorResponse,
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
