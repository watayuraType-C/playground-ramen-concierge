// src/app/register/types.ts
import { components } from "@/types/api";

// AIからの「下書き」型
export type RamenData = components["schemas"]["RamenData"];

// DBへの「完成品」型
export type RegisterRamenData = components["schemas"]["RegisterRamenData"];