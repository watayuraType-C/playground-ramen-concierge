// src/app/register/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { call_parse_ramen_api } from './call_parse_ramen_api'
import { call_register_ramen_api } from './call_register_ramen_api'
import { RamenEditForm } from './RamenEditForm'
import { RamenData, RegisterRamenData } from './types'

export default function RegisterPage() {
    const router = useRouter();
    const [chat_input, set_chat_input] = useState('')
    const [is_analyzing, set_is_analyzing] = useState(false)
    const [is_registering, set_is_registering] = useState(false)
    const [temp_ramen_data, set_temp_ramen_data] = useState<RamenData | null>(null)
    const [is_editing, set_is_editing] = useState(false)
    const [is_success, set_is_success] = useState(false) // 登録完了フラグ

    // AI解析
    const handle_analyze = async () => {
        set_is_analyzing(true);
        try {
            const data = await call_parse_ramen_api(chat_input);
            set_temp_ramen_data(data);
            set_is_editing(false);
            set_is_success(false); // 解析し直した時はサクセスメッセージを消す
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

    // 本番登録処理
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
            alert("不足している項目があります。「ちょっと修正する」ボタンから全ての情報を入力してくださいね！");
            set_is_editing(true); 
            return;
        }

        set_is_registering(true);
        try {
            const final_data = temp_ramen_data as RegisterRamenData;
            await call_register_ramen_api(final_data);
            
            // 登録完了したらアラート遷移ではなく、チャットUIを出す
            set_is_success(true);
            set_temp_ramen_data(null);
            set_chat_input('');
        } catch (error) {
            alert(error instanceof Error ? error.message : "登録に失敗しました");
        } finally {
            set_is_registering(false);
        }
    };

    // 背景画像は状態によって切り替え (解析中または登録中なら thinking.png)
    const bg_image_class = is_analyzing || is_registering 
        ? "bg-[url('/images/bg-thinking.png')]" 
        : "bg-[url('/images/bg-waiting.png')]";

    return (
        <div className="flex flex-col items-center w-full min-h-screen px-4 pb-24 relative flex-grow overflow-x-hidden">
            
            {/* 背景画像（素の画像） */}
            <div className={`fixed inset-0 z-0 bg-cover bg-center bg-fixed transition-all duration-700 ease-in-out ${bg_image_class}`}>
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none"></div>
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>

            {/* チャット風メインコンテンツ */}
            <div className="relative z-10 w-full px-2 sm:px-4 md:px-6 flex flex-col gap-6 pt-4 md:pt-8">

                {/* 1. タイトルヘッダー */}
                <div className="w-full flex justify-center mb-6">
                    <div className="bg-white/90 backdrop-blur-sm border-2 border-orange-300 px-8 py-3 rounded-full shadow-[0_4px_15px_rgba(249,115,22,0.3)]">
                        <h1 className="text-xl md:text-2xl font-extrabold text-orange-600 tracking-wider">行ったお店を登録する</h1>
                    </div>
                </div>

                {/* 2. AIからの最初の質問（限界まで左寄せ） */}
                <div className="w-full flex justify-start pl-0 md:pl-2">
                    <div className="flex items-end gap-3 max-w-[90%] md:max-w-[50%] lg:max-w-[40%] xl:max-w-[35%]">
                        <div className="shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-4 border-orange-300 shadow-[0_4px_15px_rgba(249,115,22,0.4)] bg-slate-800">
                            <img src="/images/icon.png" alt="アイコン" className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-white border-2 border-orange-200 rounded-3xl rounded-bl-sm py-5 px-6 md:px-8 shadow-[0_8px_25px_rgba(0,0,0,0.15)]">
                            <p className="font-bold text-slate-800 text-sm md:text-lg leading-relaxed">
                                どんなラーメン屋さんだった？📝<br />
                                お店の名前や場所、食べてみた感想を自由に教えてね！
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. ユーザーの回答エリア（限界まで右寄せ / 下にずらして顔を避ける） */}
                <div className="w-full flex justify-end pr-0 md:pr-2 mt-6 md:mt-20">
                    <div className="flex flex-col items-end w-full max-w-[95%] md:max-w-[50%] lg:max-w-[40%] xl:max-w-[32%]">
                        <div className="w-full bg-gradient-to-tl from-orange-50 to-white border border-slate-200 rounded-3xl rounded-br-sm p-4 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
                            <textarea
                                className="w-full h-32 md:h-40 bg-white border border-slate-300 rounded-2xl p-4 text-slate-800 text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-orange-300/50 shadow-inner resize-none transition-all"
                                placeholder="例：新宿の麺屋田所というお店！魚介醤油で星4つ。スープが濃厚でとても美味しかった！"
                                value={chat_input}
                                onChange={(e) => set_chat_input(e.target.value)}
                                disabled={is_analyzing || is_registering}
                            />
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handle_analyze}
                                    disabled={is_analyzing || is_registering || !chat_input.trim()}
                                    className="bg-orange-500 text-white font-extrabold text-sm md:text-base py-3 px-8 rounded-full hover:bg-orange-600 hover:scale-105 hover:shadow-[0_4px_20px_rgba(249,115,22,0.4)] disabled:bg-slate-300 disabled:hover:scale-100 disabled:shadow-none transition-all duration-300"
                                >
                                    {is_analyzing ? 'AIが解析中... 💭' : '送信する！'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. AIの解析結果表示（限界まで左寄せ / 幅を絞ってキャラに被らせない） */}
                {temp_ramen_data && !is_editing && (
                    <div className="w-full flex justify-start pl-0 md:pl-2 mt-8 md:mt-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <div className="flex items-end gap-3 w-full max-w-[95%] md:max-w-[55%] lg:max-w-[45%] xl:max-w-[35%]">
                            <div className="shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-4 border-orange-300 shadow-[0_4px_15px_rgba(249,115,22,0.4)] bg-slate-800 hidden md:block">
                                <img src="/images/icon.png" alt="アイコン" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-full bg-white border-2 border-orange-400 rounded-3xl rounded-bl-sm p-5 md:p-8 shadow-[0_12px_40px_rgba(249,115,22,0.15)] relative">
                                {/* スマホ時のアイコン */}
                                <div className="absolute -top-6 -left-2 md:hidden w-12 h-12 rounded-full overflow-hidden border-2 border-orange-300 shadow bg-slate-800 z-10">
                                    <img src="/images/icon.png" alt="アイコン" className="w-full h-full object-cover" />
                                </div>
                                
                                <p className="font-extrabold text-orange-600 text-base md:text-xl mb-6 flex items-center gap-2">
                                    <span className="text-2xl">🍜</span>
                                    この内容でデータベースに登録していいかな？
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm md:text-base text-slate-700 bg-orange-50/50 p-5 rounded-2xl border border-orange-100 mb-8">
                                    <div><span className="font-bold text-orange-500 block text-xs mb-1">店名</span>{temp_ramen_data.name || <span className="text-red-500 font-bold">未入力</span>}</div>
                                    <div><span className="font-bold text-orange-500 block text-xs mb-1">場所</span>{temp_ramen_data.location || <span className="text-red-500 font-bold">未入力</span>}</div>
                                    <div className="md:col-span-2">
                                        <span className="font-bold text-orange-500 block text-xs mb-1">ジャンル</span>
                                        <div className="flex flex-wrap gap-2">
                                            {temp_ramen_data.categories.length > 0 ? (
                                                temp_ramen_data.categories.map((c) => (
                                                    <span key={c} className="bg-white border border-orange-200 text-orange-700 rounded-full px-3 py-1 text-xs md:text-sm shadow-sm">{c}</span>
                                                ))
                                            ) : <span className="text-red-500 font-bold">未設定</span>}
                                        </div>
                                    </div>
                                    <div><span className="font-bold text-orange-500 block text-xs mb-1">評価</span>{temp_ramen_data.rating ? <span className="text-yellow-500 font-black text-lg">{temp_ramen_data.rating} ⭐</span> : '？'}</div>
                                    <div className="md:col-span-2"><span className="font-bold text-orange-500 block text-xs mb-1">感想</span><span className="whitespace-pre-wrap">{temp_ramen_data.review || <span className="text-red-400">なし</span>}</span></div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button 
                                        onClick={handle_register}
                                        disabled={is_registering}
                                        className="bg-green-500 text-white flex-1 py-4 rounded-xl font-extrabold md:text-lg hover:bg-green-600 hover:scale-[1.02] hover:shadow-lg disabled:bg-slate-400 disabled:hover:scale-100 transition-all shadow-md"
                                    >
                                        {is_registering ? 'データベースに登録中... 🚀' : 'うん！これで登録する！'}
                                    </button>
                                    <button 
                                        disabled={is_registering}
                                        className="bg-white border-2 border-slate-300 text-slate-700 flex-1 py-4 rounded-xl font-bold md:text-lg hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 transition-all shadow-sm"
                                        onClick={() => set_is_editing(true)}
                                    >
                                        ちょっと修正する ✏️
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. ユーザーの編集フォーム（限界まで右寄り / 幅を絞る） */}
                {temp_ramen_data && is_editing && (
                    <div className="w-full flex justify-end pr-0 md:pr-2 mt-8 md:mt-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <div className="w-full max-w-[95%] md:max-w-[55%] lg:max-w-[45%] xl:max-w-[35%]">
                             <div className="w-full rounded-3xl rounded-br-sm shadow-[0_8px_30px_rgba(0,0,0,0.15)] overflow-hidden">
                                <RamenEditForm 
                                    initial_data={temp_ramen_data} 
                                    on_save={handle_save_edit} 
                                    on_cancel={() => set_is_editing(false)} 
                                />
                             </div>
                        </div>
                    </div>
                )}

                {/* 6. 登録完了メッセージ（限界まで左寄せ） */}
                {is_success && (
                    <div className="w-full flex justify-start pl-0 md:pl-2 mt-8 md:mt-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <div className="flex items-end gap-3 max-w-[90%] md:max-w-[50%] lg:max-w-[40%] xl:max-w-[35%]">
                            <div className="shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-4 border-orange-300 shadow-[0_4px_15px_rgba(249,115,22,0.4)] bg-slate-800">
                                <img src="/images/icon.png" alt="アイコン" className="w-full h-full object-cover" />
                            </div>
                            <div className="bg-white border-2 border-green-300 rounded-3xl rounded-bl-sm py-5 px-6 md:px-8 shadow-[0_8px_25px_rgba(34,197,94,0.15)] flex flex-col gap-2">
                                <p className="font-extrabold text-green-600 text-lg md:text-xl flex items-center gap-2">
                                    <span className="text-2xl">✨</span>
                                    登録できたよ！
                                </p>
                                <p className="font-bold text-slate-700 text-sm md:text-base leading-relaxed">
                                    ラーメン手帳にしっかり書き残しておいたよ🍜<br/>
                                    また行きたいお店があったら自由に教えてね！
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}