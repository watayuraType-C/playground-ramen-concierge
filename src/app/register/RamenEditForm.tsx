// src/app/register/RamenEditForm.tsx
import { RamenData, RegisterRamenData } from "./types";

type Props = {
  initial_data: RamenData;
  on_save: (updated_data: RamenData) => void;
  on_cancel: () => void;
};

export function RamenEditForm({ initial_data, on_save, on_cancel }: Props) {
  // フォームの状態管理もスネークケースで徹底
  // initial_data.categories（配列）をカンマ区切りの文字列に変換して初期化
  const [name, set_name] = useState(initial_data.name);
  const [location, set_location] = useState(initial_data.location ?? "");
  const [categories_text, set_categories_text] = useState(initial_data.categories.join(", "));
  const [rating, set_rating] = useState(initial_data.rating ?? 3);
  const [review, set_review] = useState(initial_data.review ?? "");

  const handle_submit = (e: React.FormEvent) => {
    e.preventDefault();
    const category_list = categories_text.split(",").map(c => c.trim()).filter(c => c !== "");

    // --- 厳格なチェック ---
    if (
      name.trim() === "" ||
      location.trim() === "" ||
      review.trim() === "" ||
      category_list.length === 0 ||
      rating === null
    ) {
      alert("すべての項目を埋めてください。空の項目があると登録できません。");
      return; 
    }

    // ここで渡すのは「完成品」としての RegisterRamenData
    on_save({
      name: name.trim(),
      location: location.trim(),
      categories: category_list,
      rating: rating,
      review: review.trim(),
    } as RegisterRamenData);
  };

  return (
    <form onSubmit={handle_submit} className="flex flex-col gap-4 border-2 border-orange-200 p-6 rounded-xl bg-orange-50">
      <h2 className="font-bold text-lg text-orange-800">内容を修正する</h2>
      
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-500">店名</label>
        <input className="border p-2 rounded" value={name} onChange={e => set_name(e.target.value)} required />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-500">場所</label>
        <input className="border p-2 rounded" value={location} onChange={e => set_location(e.target.value)} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-500">ジャンル（カンマ区切り）</label>
        <input className="border p-2 rounded" value={categories_text} onChange={e => set_categories_text(e.target.value)} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-500">評価 (1-5)</label>
        <input type="number" min="1" max="5" className="border p-2 rounded w-20" value={rating} onChange={e => set_rating(Number(e.target.value))} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-500">感想</label>
        <textarea className="border p-2 rounded h-20" value={review} onChange={e => set_review(e.target.value)} />
      </div>

      <div className="flex gap-4 mt-2">
        <button type="submit" className="bg-orange-600 text-white flex-1 py-2 rounded-md font-bold">保存して戻る</button>
        <button type="button" onClick={on_cancel} className="bg-white border-2 border-slate-300 flex-1 py-2 rounded-md">キャンセル</button>
      </div>
    </form>
  );
}

import { useState } from "react"; // useStateのimportが必要