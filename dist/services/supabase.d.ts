import { SupabaseClient } from "@supabase/supabase-js";
export declare function getSupabaseClient(): SupabaseClient;
export declare function queryTable<T>(table: string, options?: {
    select?: string;
    filters?: Record<string, string | number | boolean | null>;
    limit?: number;
    offset?: number;
    order?: {
        column: string;
        ascending?: boolean;
    };
}): Promise<{
    data: T[];
    count: number | null;
    error: string | null;
}>;
export declare function getById<T>(table: string, id: string, select?: string): Promise<{
    data: T | null;
    error: string | null;
}>;
export declare function insertRow<T>(table: string, row: Record<string, unknown>): Promise<{
    data: T | null;
    error: string | null;
}>;
export declare function updateRow<T>(table: string, id: string, updates: Record<string, unknown>): Promise<{
    data: T | null;
    error: string | null;
}>;
//# sourceMappingURL=supabase.d.ts.map