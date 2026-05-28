// ─── Gemini AI Service ────────────────────────────────────────────────────────
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const MODEL = "gemini-1.5-flash";
function getApiKey() {
    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!key) {
        throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable.");
    }
    return key;
}
export async function generateContent(prompt, systemInstruction, temperature = 0.7) {
    const apiKey = getApiKey();
    const body = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
            temperature,
            maxOutputTokens: 2048,
            topP: 0.95,
        },
    };
    if (systemInstruction) {
        body.systemInstruction = { parts: [{ text: systemInstruction }] };
    }
    const url = `${GEMINI_API_BASE}/models/${MODEL}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const err = (await response.json());
        throw new Error(`Gemini API error ${response.status}: ${err.error?.message ?? "Unknown error"}`);
    }
    const result = (await response.json());
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
        throw new Error("Gemini returned empty response.");
    }
    return text;
}
// ─── LMS-specific prompt builders ────────────────────────────────────────────
export function buildLearnerContext(ctx) {
    return `
Course: ${ctx.courseName} (${ctx.provider})
Module: ${ctx.moduleName}
Current Lesson: ${ctx.lessonTitle}
Overall Progress: ${ctx.progressPercent}%
${ctx.weakTopics?.length ? `Identified weak areas: ${ctx.weakTopics.join(", ")}` : ""}
`.trim();
}
export const LMS_SYSTEM_INSTRUCTION = `You are Lumina, an expert AI learning coach embedded in Lumina LMS.
You provide clear, contextual, and encouraging educational support.
Always tailor your response to the specific course, lesson, and learner context provided.
Be concise, structured, and practical. Use markdown formatting where helpful.`;
//# sourceMappingURL=gemini.js.map