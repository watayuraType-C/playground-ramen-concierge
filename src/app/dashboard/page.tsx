'use client';

import { useState, useEffect } from "react";
import { PenSquare, Trash2, PlusCircle } from "lucide-react";

// APIデータ型
type RamenStore = {
  id?: string;
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

  // モーダル用の状態管理
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

  // 新規登録ボタンの処理
  const handle_create_click = () => {
    setModalMode("create");
    setModalData(INITIAL_DATA);
    setCategoryInput("");
    setIsModalOpen(true);
  };

  // 編集ボタンの処理
  const handle_edit_click = (store: RamenStore) => {
    setModalMode("edit");
    setModalData(store);
    setCategoryInput(store.categories.join(", "));
    setIsModalOpen(true);
  };

  // 保存処理
  const handle_save = async () => {
    try {
      const updatedCategories = categoryInput.split(",").map(s => s.trim()).filter(Boolean);
      const payload = { ...modalData, categories: updatedCategories };

      let res;
      if (modalMode === "create") {
        res = await fetch("/api/register-ramen", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/manage-ramen", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("保存に失敗しました");

      await fetch_stores(); // リストを最新化
      setIsModalOpen(false);
      alert(modalMode === "create" ? "新規登録しました！" : "更新しました！");

    } catch (err) {
      alert("エラーが発生しました");
      console.error(err);
    }
  };

  const handle_delete = async (id: string, name: string) => {
    if (!window.confirm(`「${name}」を本当に削除しますか？`)) return;
    try {
      await fetch(`/api/manage-ramen?id=${id}`, { method: "DELETE" });
      set_stores((prev) => prev.filter((s) => s.id !== id));
    } catch { alert("削除失敗"); }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <p className="text-orange-500 font-bold text-xl animate-pulse">データを読み込み中...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-red-500 font-bold">
            {error}
        </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative overflow-x-hidden flex flex-col items-center pb-20">
      
      {/* 1. 背景画像（ぼかし無し） */}
      <div className="fixed inset-0 z-0 bg-[url('/images/bg-happy.png')] bg-cover bg-center bg-fixed transition-all duration-700 ease-in-out">
      </div>

      {/* グラデーションオーバーレイ (可読性のため) */}
      <div className="fixed inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-0"></div>

      {/* メインコンテンツ */}
      <div className="relative z-10 w-full max-w-7xl px-4 md:px-8 flex flex-col gap-8 pt-8">

        {/* 2. ヘッダーエリア */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md border-2 border-orange-300 px-6 py-4 rounded-3xl shadow-[0_8px_30px_rgba(249,115,22,0.15)]">
            <h1 className="text-xl md:text-2xl font-extrabold text-orange-600 tracking-wider flex items-center gap-2">
                <span className="text-3xl">🍜</span> これまでの記録
            </h1>
            <button 
              onClick={handle_create_click}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-bold transition-all shadow-[0_4px_15px_rgba(249,115,22,0.4)] hover:scale-105"
            >
              <PlusCircle size={20} />
              新しいお店を登録
            </button>
        </div>

        {/* 3. ラーメンショップのカードグリッド */}
        <div className="w-full">
            {stores.length === 0 ? (
                <div className="bg-white/90 backdrop-blur-md rounded-3xl p-12 text-center shadow-xl border-2 border-orange-200">
                    <p className="text-slate-500 text-lg font-bold">まだ記録がありません。</p>
                    <p className="text-slate-400 mt-2">新しく行ったお店を登録して、あなただけのラーメン手帳を作りましょう！</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {stores.map((store) => (
                        <div key={store.id} className="group bg-white/85 backdrop-blur-sm hover:bg-white/95 border-2 border-orange-200 hover:border-orange-400 rounded-3xl p-6 shadow-lg hover:shadow-[0_8px_30px_rgba(249,115,22,0.2)] transition-all flex flex-col gap-3 relative overflow-hidden">
                            
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button onClick={() => handle_edit_click(store)} className="bg-white text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-full shadow-md transition-all">
                                    <PenSquare size={18} />
                                </button>
                                <button onClick={() => store.id && handle_delete(store.id, store.name)} className="bg-white text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full shadow-md transition-all">
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <h3 className="text-xl font-black text-slate-800 pr-16 line-clamp-2 leading-tight">{store.name}</h3>
                            
                            <div className="flexitems-center gap-1 mt-1">
                                <p className="text-lg text-yellow-500 font-black leading-none tracking-widest">
                                    {"⭐".repeat(store.rating)}{"☆".repeat(5 - store.rating)}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {store.categories.map((c) => (
                                    <span key={c} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold">
                                        {c}
                                    </span>
                                ))}
                            </div>
                            
                            <p className="text-sm font-bold text-slate-500 mt-1 line-clamp-1">📍 {store.location || '場所未登録'}</p>
                            
                            <div className="bg-orange-50/80 p-3 rounded-xl border border-orange-100 flex-grow mt-2">
                                <p className="text-xs font-bold text-orange-600 mb-1">📝 あなたのメモ</p>
                                <p className="text-sm text-slate-700 line-clamp-3 leading-snug">{store.review}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>

      {/* 4. モーダル (新規・編集) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 md:p-8 border-4 border-orange-300 relative overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl md:text-2xl font-extrabold mb-6 text-orange-600 flex items-center gap-2">
              {modalMode === "create" ? "✨ 新しいお店を登録" : "📝 記録の編集"}
            </h2>
            
            <div className="space-y-5">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-slate-600">店名 <span className="text-red-500">*</span></label>
                <input 
                  className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-xl focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 outline-none transition-all font-bold text-slate-800"
                  value={modalData.name}
                  onChange={(e) => setModalData({...modalData, name: e.target.value})}
                  placeholder="例: ラーメン二郎 三田本店"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-slate-600">場所</label>
                  <input 
                    className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-xl focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 outline-none transition-all font-bold text-slate-800"
                    value={modalData.location}
                    onChange={(e) => setModalData({...modalData, location: e.target.value})}
                    placeholder="例: 東京都港区"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-slate-600">評価 (1-5) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" min="1" max="5"
                    className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-xl focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 outline-none transition-all font-bold text-slate-800"
                    value={modalData.rating}
                    onChange={(e) => setModalData({...modalData, rating: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-slate-600">特徴 (カンマ区切り)</label>
                <input 
                  className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-xl focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 outline-none transition-all text-slate-800"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  placeholder="例: 豚骨, 家系, ニンニク"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-slate-600">自分のメモ・感想 <span className="text-red-500">*</span></label>
                <textarea 
                  className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-xl h-28 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 outline-none resize-none transition-all text-slate-800"
                  value={modalData.review}
                  onChange={(e) => setModalData({...modalData, review: e.target.value})}
                  placeholder="味の感想や店内の雰囲気などを自由に書いてね"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 rounded-full transition-all"
              >
                キャンセル
              </button>
              <button 
                onClick={handle_save}
                disabled={!modalData.name || !modalData.review}
                className="px-8 py-3 bg-orange-500 text-white font-extrabold rounded-full hover:bg-orange-600 shadow-lg transition-all disabled:bg-slate-300 disabled:cursor-not-allowed hover:scale-105"
              >
                {modalMode === "create" ? "登録する！" : "更新する！"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}