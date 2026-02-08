'use client';

import { useState, useEffect } from "react";

// APIデータ型
type RamenStore = {
  id?: string; // 新規登録時はIDがないので optional
  name: string;
  categories: string[];
  rating: number;
  location: string;
  review: string;
  created_at?: string;
};

// 初期データ（空のフォーム用）
const INITIAL_DATA: RamenStore = {
  name: "",
  categories: [],
  rating: 3,
  location: "",
  review: "",
};

export default function DashboardPage() {
  const [stores, set_stores] = useState<RamenStore[]>([]);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);

  // ★変更: モーダル用の状態管理
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalData, setModalData] = useState<RamenStore>(INITIAL_DATA);
  const [categoryInput, setCategoryInput] = useState("");

  // データ取得
  const fetch_stores = async () => {
    try {
      const res = await fetch("/api/manage-ramen");
      if (!res.ok) throw new Error("データの取得に失敗しました");
      const data = await res.json();
      set_stores(data);
    } catch {
      set_error("ラーメンデータの読み込みに失敗しました。");
    } finally {
      set_loading(false);
    }
  };

  useEffect(() => {
    fetch_stores();
  }, []);

  // ★追加: 新規登録ボタンの処理
  const handle_create_click = () => {
    setModalMode("create");
    setModalData(INITIAL_DATA);
    setCategoryInput("");
    setIsModalOpen(true);
  };

  // ★変更: 編集ボタンの処理
  const handle_edit_click = (store: RamenStore) => {
    setModalMode("edit");
    setModalData(store);
    setCategoryInput(store.categories.join(", "));
    setIsModalOpen(true);
  };

  // ★変更: 保存処理（分岐ロジック）
  const handle_save = async () => {
    try {
      const updatedCategories = categoryInput.split(",").map(s => s.trim()).filter(Boolean);
      const payload = { ...modalData, categories: updatedCategories };

      let res;
      if (modalMode === "create") {
        // 新規登録 API (POST)
        // ※以前作成した /api/register-ramen を再利用します
        res = await fetch("/api/register-ramen", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // 更新 API (PUT)
        res = await fetch("/api/manage-ramen", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("保存に失敗しました");

      // 成功したらリロードしてモーダルを閉じる
      await fetch_stores(); // リストを最新化
      setIsModalOpen(false);
      alert(modalMode === "create" ? "新規登録しました！" : "更新しました！");

    } catch (err) {
      alert("エラーが発生しました");
      console.error(err);
    }
  };

  const handle_delete = async (id: string) => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      await fetch(`/api/manage-ramen?id=${id}`, { method: "DELETE" });
      set_stores((prev) => prev.filter((s) => s.id !== id));
    } catch { alert("削除失敗"); }
  };

  if (loading) return <div className="p-8 text-center">読み込み中...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 relative min-h-screen pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">🍜 ラーメン管理ダッシュボード</h1>
        <button 
          onClick={handle_create_click} // ★ここをクリックイベントに接続
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm"
        >
          + 新規登録
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-bold text-slate-600">店名</th>
              <th className="p-4 text-sm font-bold text-slate-600">評価</th>
              <th className="p-4 text-sm font-bold text-slate-600">場所</th>
              <th className="p-4 text-sm font-bold text-slate-600">特徴</th>
              <th className="p-4 text-sm font-bold text-slate-600">メモ</th>
              <th className="p-4 text-sm font-bold text-slate-600 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stores.map((store) => (
              <tr key={store.id} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-800">{store.name}</td>
                <td className="p-4 text-yellow-500">{"★".repeat(store.rating)}</td>
                <td className="p-4 text-sm text-slate-600">{store.location}</td>
                <td className="p-4 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {store.categories.map((c) => (
                      <span key={c} className="bg-slate-100 px-2 py-1 rounded text-slate-600">{c}</span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-500 truncate max-w-xs">{store.review}</td>
                <td className="p-4 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => handle_edit_click(store)} className="text-blue-600 font-bold hover:underline text-sm">編集</button>
                  <button onClick={() => store.id && handle_delete(store.id)} className="text-red-600 font-bold hover:underline text-sm">削除</button>
                </td>
              </tr>
            ))}
             {stores.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">データがありません。新規登録してください。</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 共通モーダル (新規・編集) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-4 text-slate-800">
              {modalMode === "create" ? "✨ 新しいラーメン屋の登録" : "📝 店舗情報の編集"}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">店名 <span className="text-red-500">*</span></label>
                <input 
                  className="w-full border border-slate-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={modalData.name}
                  onChange={(e) => setModalData({...modalData, name: e.target.value})}
                  placeholder="例: ラーメン二郎 三田本店"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">場所</label>
                  <input 
                    className="w-full border border-slate-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={modalData.location}
                    onChange={(e) => setModalData({...modalData, location: e.target.value})}
                    placeholder="例: 東京都港区"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">評価 (1-5)</label>
                  <input 
                    type="number" min="1" max="5"
                    className="w-full border border-slate-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={modalData.rating}
                    onChange={(e) => setModalData({...modalData, rating: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">特徴 (カンマ区切り)</label>
                <input 
                  className="w-full border border-slate-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  placeholder="豚骨, 家系, 醤油, ニンニク"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">自分のメモ・レビュー <span className="text-red-500">*</span></label>
                <textarea 
                  className="w-full border border-slate-300 p-2 rounded h-24 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  value={modalData.review}
                  onChange={(e) => setModalData({...modalData, review: e.target.value})}
                  placeholder="味の感想や特徴を詳しく書いてください（AI検索に使われます）"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded transition-colors"
              >
                キャンセル
              </button>
              <button 
                onClick={handle_save}
                disabled={!modalData.name || !modalData.review}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 shadow-md transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {modalMode === "create" ? "登録する" : "更新する"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}