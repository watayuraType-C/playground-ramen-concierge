// src/app/api/parse-ramen/generate_ramen_prompt.ts

/**
 * ユーザーが入力した自由なテキストから、
 * ラーメンの情報を抽出するためのAIプロンプトを生成します。
 */
export function generate_prompt(user_text: string): string {
  // プロンプトを作成
  const prompt_template = `
    あなたはラーメンに精通したコンシェルジュです。
    以下の「ユーザーのメモ」から情報を抽出し、指定されたJSON形式で出力してください。

    ### 抽出ルール:
    1. name (店名): 必ず抽出してください。不明な場合は "不明" としてください。
    2. categories (ジャンル): ラーメンの種類（醤油、味噌、家系など）を配列で抽出してください。
    3. rating (評価): 1〜5の数値で抽出してください。不明な場合は null にしてください。
    4. location (場所): 店の場所やエリアを抽出してください。不明な場合は null にしてください。
    5. review (感想): 味や接客などの感想を抽出してください。不明な場合は null にしてください。

    ### 出力形式:
    JSON形式のみで回答してください。余計な解説は不要です。

    ### ユーザーのメモ:
    "${user_text}"
  `;

  return prompt_template.trim();
}