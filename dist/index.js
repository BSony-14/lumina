#!/usr/bin/env node
// ─── Lumina LMS MCP Server ────────────────────────────────────────────────────
// Exposes courses, lessons, students, AI coaching, assignments, and mentor
// workflows to AI agents via the Model Context Protocol.
//
// Transport: stdio (default) | set TRANSPORT=http for HTTP mode
// Required env vars:
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY  (or NEXT_PUBLIC_SUPABASE_ANON_KEY)
//   GOOGLE_GENERATIVE_AI_API_KEY
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerCourseTools } from "./tools/courses.js";
import { registerStudentTools } from "./tools/students.js";
import { registerAITools } from "./tools/ai.js";
import { registerAssignmentTools } from "./tools/assignments.js";
import { registerMentorTools } from "./tools/mentors.js";
// ─── Server initialisation ────────────────────────────────────────────────────
const server = new McpServer({
    name: "lumina-lms-mcp-server",
    version: "1.0.0",
});
// ─── Register all tool groups ─────────────────────────────────────────────────
registerCourseTools(server);
registerStudentTools(server);
registerAITools(server);
registerAssignmentTools(server);
registerMentorTools(server);
// ─── Transport ────────────────────────────────────────────────────────────────
async function runStdio() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Lumina LMS MCP server running (stdio)");
}
async function runHTTP() {
    const { default: express } = await import("express");
    const { StreamableHTTPServerTransport } = await import("@modelcontextprotocol/sdk/server/streamableHttp.js");
    const app = express();
    app.use(express.json());
    app.post("/mcp", async (req, res) => {
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
            enableJsonResponse: true,
        });
        res.on("close", () => transport.close());
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    });
    app.get("/health", (_req, res) => {
        res.json({ status: "ok", server: "lumina-lms-mcp-server", version: "1.0.0" });
    });
    const port = parseInt(process.env.PORT ?? "3001");
    app.listen(port, () => {
        console.error(`Lumina LMS MCP server running on http://localhost:${port}/mcp`);
    });
}
// ─── Entry ────────────────────────────────────────────────────────────────────
const transport = process.env.TRANSPORT ?? "stdio";
if (transport === "http") {
    runHTTP().catch((err) => {
        console.error("Server error:", err);
        process.exit(1);
    });
}
else {
    runStdio().catch((err) => {
        console.error("Server error:", err);
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map