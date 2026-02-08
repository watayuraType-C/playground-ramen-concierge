import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { create_embedding } from "../search-ramen/create_embedding";

// GET: 登録されているラーメン屋を全件取得
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // embedding は除外して、必要なカラムだけを指定して取得
    // created_at の降順（新しい順）で並べる
    const { data, error } = await supabase
      .from("ramen_stores")
      .select("id, name, categories, rating, location, review, created_at")
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json(
        { message: "データの取得に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Fetch API Error:", error);
    return NextResponse.json(
      { message: "予期せぬエラーが発生しました" },
      { status: 500 }
    );
  }
}

// DELETE: IDを指定して削除
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "削除するIDが指定されていません" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { error } = await supabase
      .from("ramen_stores")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase Delete Error:", error);
      throw error;
    }

    return NextResponse.json({ message: "削除しました" });

  } catch {
    return NextResponse.json(
      { message: "削除に失敗しました" },
      { status: 500 }
    );
  }
}

// PUT: ラーメン屋情報の更新 (Embedding再計算含む)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, categories, rating, location, review } = body;

    // バリデーション (ID必須)
    if (!id) {
      return NextResponse.json(
        { message: "更新するIDが指定されていません" },
        { status: 400 }
      );
    }

    // 1. Embeddingの再計算
    // 検索に使われる「統合テキスト」をもう一度作ります
    const text_for_embedding = `${name} ${location} ${categories.join(" ")} ${review}`;
    const new_embedding = await create_embedding(text_for_embedding);

    // 2. Supabaseの更新
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from("ramen_stores")
      .update({
        name,
        categories, // 配列のまま渡せばOK
        rating,
        location,
        review,
        embedding: new_embedding // ★ここが重要！ベクトルも更新
      })
      .eq("id", id);

    if (error) {
      console.error("Supabase Update Error:", error);
      throw error;
    }

    return NextResponse.json({ message: "更新しました" });

  } catch (error) {
    console.error("Update API Error:", error);
    return NextResponse.json(
      { message: "更新に失敗しました" },
      { status: 500 }
    );
  }
}