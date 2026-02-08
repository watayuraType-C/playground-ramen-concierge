// src/app/search/types.ts

// OpenAPIの SearchRamenResult に相当
export type SearchRamenResult = {
  name: string;
  categories: string[];
  rating: number;
  location: string;
  review: string;
  similarity: number; // 0.0 ~ 1.0
  ai_comment: string;
};

// APIレスポンス全体の型
export type SearchResponse = {
  db_match: SearchRamenResult[];
  web_match: SearchRamenResult[];
};