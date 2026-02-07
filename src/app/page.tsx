'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [stores, setStores] = useState<any[]>([])

  useEffect(() => {
    // Supabaseからラーメン屋一覧を取得する関数
    const fetchStores = async () => {
      const { data, error } = await supabase.from('ramen_stores').select('*')
      if (data) setStores(data)
    }
    fetchStores()
  }, [])

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">マイ・ラーメンリスト</h1>
      <ul>
        {stores.length > 0 ? (
          stores.map(store => <li key={store.id}>{store.name}</li>)
        ) : (
          <p>まだデータがありません。Supabaseで1件追加してみる？</p>
        )}
      </ul>
    </main>
  )
}