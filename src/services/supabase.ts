// ─── Supabase Service ─────────────────────────────────────────────────────────
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and " +
      "SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in environment."
    );
  }

  _client = createClient(url, key, {
    auth: { persistSession: false },
  });

  return _client;
}

// ─── Generic query helpers ────────────────────────────────────────────────────

export async function queryTable<T>(
  table: string,
  options: {
    select?: string;
    filters?: Record<string, string | number | boolean | null>;
    limit?: number;
    offset?: number;
    order?: { column: string; ascending?: boolean };
  } = {}
): Promise<{ data: T[]; count: number | null; error: string | null }> {
  const supabase = getSupabaseClient();
  const { select = "*", filters = {}, limit = 20, offset = 0, order } = options;

  let query = supabase
    .from(table)
    .select(select, { count: "exact" })
    .range(offset, offset + limit - 1);

  for (const [key, value] of Object.entries(filters)) {
    if (value === null) {
      query = query.is(key, null);
    } else {
      query = query.eq(key, value);
    }
  }

  if (order) {
    query = query.order(order.column, { ascending: order.ascending ?? true });
  }

  const { data, count, error } = await query;

  return {
    data: (data as T[]) ?? [],
    count,
    error: error ? error.message : null,
  };
}

export async function getById<T>(
  table: string,
  id: string,
  select = "*"
): Promise<{ data: T | null; error: string | null }> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(table)
    .select(select)
    .eq("id", id)
    .single();

  return {
    data: (data as T) ?? null,
    error: error ? error.message : null,
  };
}

export async function insertRow<T>(
  table: string,
  row: Record<string, unknown>
): Promise<{ data: T | null; error: string | null }> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(table)
    .insert(row)
    .select()
    .single();

  return {
    data: (data as T) ?? null,
    error: error ? error.message : null,
  };
}

export async function updateRow<T>(
  table: string,
  id: string,
  updates: Record<string, unknown>
): Promise<{ data: T | null; error: string | null }> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  return {
    data: (data as T) ?? null,
    error: error ? error.message : null,
  };
}
