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
const RegisterRamenData = z.object({
  name: z.string().min(1),
  categories: z.array(z.string().min(1)).min(1),
  rating: z.number().int().gte(1).lte(5),
  location: z.string().min(1),
  review: z.string().min(1),
});
const RegisterRamenResponse = z
  .object({ id: z.string().uuid(), message: z.string() })
  .passthrough();
const SearchRamenRequest = z
  .object({ text: z.string().min(1).max(1000) })
  .passthrough();
const SearchRamenResult = z.object({
  name: z.string().min(1),
  categories: z.array(z.string().min(1)).min(1),
  rating: z.number().int().gte(1).lte(5),
  location: z.string().min(1),
  review: z.string().min(1),
  similarity: z.number().gte(0).lte(1),
  ai_comment: z.string().min(1),
});
const ManageRamenData = RegisterRamenData.and(
  z
    .object({
      id: z.string().uuid(),
      created_at: z.string().datetime({ offset: true }),
    })
    .passthrough()
);
const UpdateRamenRequest = RegisterRamenData.and(
  z.object({ id: z.string().uuid() }).passthrough()
);

export const schemas = {
  ParseRamenRequest,
  RamenData,
  ErrorResponse,
  RegisterRamenData,
  RegisterRamenResponse,
  SearchRamenRequest,
  SearchRamenResult,
  ManageRamenData,
  UpdateRamenRequest,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/api/manage-ramen",
    alias: "getAllRamenStores",
    description: `管理画面用に全件取得します。データ量削減のためembeddingは返しません。`,
    requestFormat: "json",
    response: z.array(ManageRamenData),
    errors: [
      {
        status: 500,
        description: `予期せぬエラー`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/api/manage-ramen",
    alias: "deleteRamenStore",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Query",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ message: z.string() }).partial().passthrough(),
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
    ],
  },
  {
    method: "put",
    path: "/api/manage-ramen",
    alias: "updateRamenStore",
    description: `内容が変更された場合、AIによるEmbeddingの再計算も自動で行います。`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateRamenRequest,
      },
    ],
    response: z.object({ message: z.string() }).partial().passthrough(),
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
    ],
  },
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
        schema: RegisterRamenData,
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
  {
    method: "post",
    path: "/api/search-ramen",
    alias: "searchRamen",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ text: z.string().min(1).max(1000) }).passthrough(),
      },
    ],
    response: z
      .object({
        db_match: z.array(SearchRamenResult),
        web_match: z.array(SearchRamenResult),
      })
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `リクエストの形式が正しくありません`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `リソースが見つかりません`,
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
