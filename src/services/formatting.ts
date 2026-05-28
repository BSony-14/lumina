// ─── Formatting Utilities ─────────────────────────────────────────────────────
import type { PaginatedResponse, ResponseFormat } from "../types.js";

/** Serialize any value to a plain Record for MCP structuredContent */
export function toRecord(data: unknown): Record<string, unknown> {
  return JSON.parse(JSON.stringify(data)) as Record<string, unknown>;
}

export function formatPagination<T>(
  items: T[],
  total: number,
  offset: number,
  _limit: number
): PaginatedResponse<T> {
  const hasMore = total > offset + items.length;
  return {
    items,
    total,
    count: items.length,
    offset,
    has_more: hasMore,
    ...(hasMore ? { next_offset: offset + items.length } : {}),
  };
}

export function jsonResponse(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

export function truncate(text: string, limit = 6000): string {
  if (text.length <= limit) return text;
  return text.slice(0, limit) + `\n\n...[truncated, ${text.length - limit} chars omitted]`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function difficultyBadge(level: string): string {
  const badges: Record<string, string> = {
    beginner: "🟢 Beginner",
    intermediate: "🟡 Intermediate",
    advanced: "🔴 Advanced",
  };
  return badges[level] ?? level;
}

export function makeTextContent(
  data: unknown,
  format: ResponseFormat,
  markdownFn: (d: unknown) => string
): Array<{ type: "text"; text: string }> {
  const text =
    format === "json"
      ? truncate(jsonResponse(data))
      : truncate(markdownFn(data));
  return [{ type: "text", text }];
}
