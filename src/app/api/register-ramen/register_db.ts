// src/app/api/register-ramen/register_db.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { RegisterRamenData } from "@/app/register/types";
import { CustomError } from "@/lib/CustomError";

export async function register_db(supabase: SupabaseClient, data: RegisterRamenData, embedding: number[]) {
    const { data: inserted_row, error } = await supabase
    .from('ramen_stores')
    .insert([{
      ...data,
      embedding: embedding
    }])
    .select()
    .single();

  if (error) {
    console.error("Supabase Insert Error:", error);
    throw new CustomError(500, "DATABASE_INSERT_ERROR", "DBへの登録中にエラーが発生しました。");
  }
  return inserted_row;
}