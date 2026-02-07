'use client'
import { useState } from 'react'
import { components } from '@/types/api';

export default function RegisterPage() {
    const [chatInput, setChatInput] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [tempRamenData, setTempRamenData] = useState<any>(null)

    // AIに解析を依頼する関数（後で中身を作ります）
    const handleAnalyze = async () => {
        if (!chatInput) return;
        setIsAnalyzing(true);

        try {
            const response = await fetch('/api/parse-ramen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: chatInput }),
            });
            const data = await response.json();
            console.log("Geminiの回答:", data); // これを追加！
            setTempRamenData(data); // AIの結果をセット！
        } catch (error) {
            alert("エラーが発生しました");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
            <h1 className="text-xl font-bold border-b pb-2">新規ラーメン登録</h1>

            {/* コンシェルジュのメッセージエリア */}
            <div className="bg-slate-100 p-4 rounded-lg">
                <p>コンシェルジュ：どんなラーメン屋さんでしたか？特徴を自由に教えてください。</p>
            </div>

            {/* ユーザー入力エリア */}
            <div className="flex flex-col gap-2">
                <textarea
                    className="border p-3 rounded-md w-full h-32"
                    placeholder="例：昨日、新宿の麺屋〇〇に行った。魚介醤油で星4つ。少し並んだけど美味しかった！"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                />
                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-slate-400"
                >
                    {isAnalyzing ? 'AIが解析中...' : '送信する'}
                </button>
            </div>

            {/* AI解析結果の確認カード（データがある時だけ表示） */}
            {tempRamenData && (
                <div className="border-2 border-blue-200 p-6 rounded-xl bg-blue-50 animate-in fade-in slide-in-from-bottom-4">
                    <h2 className="font-bold text-lg mb-4 text-blue-800">こちらの内容で登録しますか？</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                        <div><span className="font-semibold text-slate-500">店名：</span>{tempRamenData.name}</div>
                        <div><span className="font-semibold text-slate-500">場所：</span>{tempRamenData.location}</div>
                        <div className="col-span-2">
                            <span className="font-semibold text-slate-500">ジャンル：</span>
                            {tempRamenData.categories.map((c: string) => (
                                <span key={c} className="bg-white border rounded px-2 py-1 mr-1">{c}</span>
                            ))}
                        </div>
                        <div><span className="font-semibold text-slate-500">評価：</span>{tempRamenData.rating} ⭐</div>
                    </div>

                    <div className="flex gap-4">
                        <button className="bg-green-600 text-white flex-1 py-2 rounded-md font-bold">Yes（登録する）</button>
                        <button className="bg-white border-2 border-slate-300 flex-1 py-2 rounded-md">修正する</button>
                    </div>
                </div>
            )}
        </div>
    )
}