// src/app/register/types.ts
import { components } from "@/types/api";

// 巨大な components の中から RamenData だけを抜き出して、名前をつけて export する
export type RamenData = components["schemas"]["RamenData"];

// ついでにリクエスト型も抜き出しておくと後で便利です
export type ParseRamenRequest = components["schemas"]["ParseRamenRequest"];