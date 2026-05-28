import type { PaginatedResponse, ResponseFormat } from "../types.js";
/** Serialize any value to a plain Record for MCP structuredContent */
export declare function toRecord(data: unknown): Record<string, unknown>;
export declare function formatPagination<T>(items: T[], total: number, offset: number, _limit: number): PaginatedResponse<T>;
export declare function jsonResponse(data: unknown): string;
export declare function truncate(text: string, limit?: number): string;
export declare function formatDate(iso: string): string;
export declare function difficultyBadge(level: string): string;
export declare function makeTextContent(data: unknown, format: ResponseFormat, markdownFn: (d: unknown) => string): Array<{
    type: "text";
    text: string;
}>;
//# sourceMappingURL=formatting.d.ts.map