/** Serialize any value to a plain Record for MCP structuredContent */
export function toRecord(data) {
    return JSON.parse(JSON.stringify(data));
}
export function formatPagination(items, total, offset, _limit) {
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
export function jsonResponse(data) {
    return JSON.stringify(data, null, 2);
}
export function truncate(text, limit = 6000) {
    if (text.length <= limit)
        return text;
    return text.slice(0, limit) + `\n\n...[truncated, ${text.length - limit} chars omitted]`;
}
export function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
export function difficultyBadge(level) {
    const badges = {
        beginner: "🟢 Beginner",
        intermediate: "🟡 Intermediate",
        advanced: "🔴 Advanced",
    };
    return badges[level] ?? level;
}
export function makeTextContent(data, format, markdownFn) {
    const text = format === "json"
        ? truncate(jsonResponse(data))
        : truncate(markdownFn(data));
    return [{ type: "text", text }];
}
//# sourceMappingURL=formatting.js.map