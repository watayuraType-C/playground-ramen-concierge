// src/app/api/search-ramen/rank_ramen_by_similarity.ts
import { RamenRow } from "./types";
import { RankedRamen } from "./types";

/**
 * コサイン類似度計算（純粋関数）
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * メモリ上のデータを類似度順にソートして上位を返す
 */
export function rank_ramen_by_similarity(
  rows: RamenRow[], 
  query_vector: number[],
): RankedRamen {

  const ranked_results = rows.map((row) => {
    // 文字列で来ても配列で来ても対応するパース処理
    let db_vector: number[] = [];
    if (typeof row.embedding === "string") {
      try {
        db_vector = JSON.parse(row.embedding);
      } catch {
        db_vector = [];
      }
    } else if (Array.isArray(row.embedding)) {
      db_vector = row.embedding;
    }

    // 次元数が合わない、またはベクトルがない場合は類似度0
    if (db_vector.length !== query_vector.length) {
      return { ...row, similarity: 0 };
    }

    return {
      ...row,
      similarity: cosineSimilarity(query_vector, db_vector),
    };
  });

  // 類似度が高い順（降順）にソート
  ranked_results.sort((a, b) => b.similarity - a.similarity);

  // 上位K件を返す
  return ranked_results[0];
}