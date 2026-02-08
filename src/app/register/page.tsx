// src/app/register/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation' // 追加：登録後の画面遷移用
import { call_parse_ramen_api } from './call_parse_ramen_api'
import { call_register_ramen_api } from './call_register_ramen_api' // 追加
import { RamenEditForm } from './RamenEditForm'
import { RamenData, RegisterRamenData } from './types' // 型をtypesから取得

export default function RegisterPage() {
    const router = useRouter();
    const [chat_input, set_chat_input] = useState('')
    const [is_analyzing, set_is_analyzing] = useState(false)
    const [is_registering, set_is_registering] = useState(false)
    const [temp_ramen_data, set_temp_ramen_data] = useState<RamenData | null>(null)
    const [is_editing, set_is_editing] = useState(false)

    // AI解析
    const handle_analyze = async () => {
        set_is_analyzing(true);
        try {
            const data = await call_parse_ramen_api(chat_input);
            set_temp_ramen_data(data);
            set_is_editing(false);
        } catch (error) {
            alert(error instanceof Error ? error.message : "予期せぬエラーが発生しました");
        } finally {
            set_is_analyzing(false);
        }
    };

    // 編集内容の保存（メモリ上）
    const handle_save_edit = (updated_data: RamenData) => {
        set_temp_ramen_data(updated_data);
        set_is_editing(false);
    };

    // --- 追加：本番登録処理 ---
    const handle_register = async () => {
        if (!temp_ramen_data) return;

        // バリデーション：RegisterRamenDataの基準を満たしているかチェック
        const { name, categories, rating, location, review } = temp_ramen_data;
        const is_valid = 
            name && name.trim() !== "" &&
            location && location.trim() !== "" &&
            review && review.trim() !== "" &&
            categories.length > 0 &&
            rating !== null;

        if (!is_valid) {
            alert("不足している項目があります。「修正する」ボタンから全ての情報を入力してください。");
            set_is_editing(true); // 自動で編集モードへ
            return;
        }

        set_is_registering(true);
        try {
            // 厳格な型（RegisterRamenData）としてキャストして送信
            const final_data = temp_ramen_data as RegisterRamenData;
            const result = await call_register_ramen_api(final_data);
            
            alert(result.message);
            // 登録成功後、ダッシュボードなどへ遷移
            router.push('/dashboard'); 
        } catch (error) {
            alert(error instanceof Error ? error.message : "登録に失敗しました");
        } finally {
            set_is_registering(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto p-4">
            <h1 className="text-xl font-bold border-b pb-2">新規ラーメン登録</h1>

            {/* コンシェルジュのメッセージエリア */}
            <div className="bg-slate-100 p-4 rounded-lg">
                <p>コンシェルジュ：どんなラーメン屋さんでしたか？特徴を教えてください。</p>
            </div>

            <div className="flex flex-col gap-2">
                <textarea
                    className="border p-3 rounded-md w-full h-32 text-slate-800"
                    placeholder="例：新宿の麺屋田所。魚介醤油で星4つ。"
                    value={chat_input}
                    onChange={(e) => set_chat_input(e.target.value)}
                    disabled={is_analyzing || is_registering}
                />
                <button
                    onClick={handle_analyze}
                    disabled={is_analyzing || is_registering || !chat_input.trim()}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-slate-300 transition-colors"
                >
                    {is_analyzing ? 'AIが解析中...' : '解析する'}
                </button>
            </div>

            {/* AI解析結果の表示エリア */}
            {temp_ramen_data && (
                <>
                    {is_editing ? (
                        <RamenEditForm 
                          initial_data={temp_ramen_data} 
                          on_save={handle_save_edit} 
                          on_cancel={() => set_is_editing(false)} 
                        />
                    ) : (
                        <div className="border-2 border-blue-200 p-6 rounded-xl bg-blue-50 animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="font-bold text-lg mb-4 text-blue-800">こちらの内容で登録しますか？</h2>
                            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                                <div><span className="font-semibold text-slate-500">店名：</span>{temp_ramen_data.name}</div>
                                <div><span className="font-semibold text-slate-500">場所：</span>{temp_ramen_data.location ?? <span className="text-red-500 font-bold">未入力</span>}</div>
                                <div className="col-span-2">
                                    <span className="font-semibold text-slate-500">ジャンル：</span>
                                    {temp_ramen_data.categories.length > 0 ? (
                                        temp_ramen_data.categories.map((c) => (
                                            <span key={c} className="bg-white border rounded px-2 py-0.5 mr-1 text-xs">{c}</span>
                                        ))
                                    ) : <span className="text-red-500 font-bold">未設定</span>}
                                </div>
                                <div><span className="font-semibold text-slate-500">評価：</span>{temp_ramen_data.rating ?? '？'} ⭐</div>
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={handle_register}
                                    disabled={is_registering}
                                    className="bg-green-600 text-white flex-1 py-2 rounded-md font-bold hover:bg-green-700 disabled:bg-slate-400"
                                >
                                    {is_registering ? '登録中...' : 'Yes（登録する）'}
                                </button>
                                <button 
                                    disabled={is_registering}
                                    className="bg-white border-2 border-slate-300 flex-1 py-2 rounded-md hover:bg-slate-50 disabled:opacity-50"
                                    onClick={() => set_is_editing(true)}
                                >
                                    修正する
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}