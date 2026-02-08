import { RegisterRamenData } from "@/app/register/types";

// DBから返ってくる生のデータ型（embeddingが含まれる）
export type RamenRow = RegisterRamenData & {
  id: string;
  embedding: number[] | string; 
};

// 計算結果の型（類似度が付与されたもの）
export type RankedRamen = RamenRow & {
  similarity: number;
};

export type FinalRamenData = RankedRamen & {
    ai_comment: string;
};

// 1. 出力したい「潔癖な」型定義
export type SafeSearchRamenResult = {
  name: string;
  categories: string[];
  rating: number;
  location: string;
  review: string;
  similarity: number;
  ai_comment: string;
};

export type SearchRamenResponse = {
  db_match: SafeSearchRamenResult[];
  web_match: SafeSearchRamenResult[];
};