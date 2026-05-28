// ─── AI Learning Tools (Gemini 1.5 Flash) ────────────────────────────────────
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  generateContent,
  buildLearnerContext,
  LMS_SYSTEM_INSTRUCTION,
} from "../services/gemini.js";
import { truncate } from "../services/formatting.js";

export function registerAITools(server: McpServer): void {
  // ── lms_ai_explain_concept ────────────────────────────────────────────────
  server.registerTool(
    "lms_ai_explain_concept",
    {
      title: "AI — Explain Concept Simply",
      description: `Ask Lumina AI to explain a concept from the current lesson in simple terms.
Uses the learner's course/module/lesson context to make the explanation relevant.

Args:
  - concept (string): The concept or topic to explain (5–300 chars)
  - course_name (string): Name of the current course
  - module_name (string): Name of the current module
  - lesson_title (string): Title of the current lesson
  - provider (string): Course provider
  - progress_percent (number): Student's overall course progress 0–100
  - analogy_style (string, optional): Preferred analogy style ("real-world", "visual", "story")

Returns: AI-generated plain-English explanation of the concept.`,
      inputSchema: z.object({
        concept: z.string().min(5).max(300).describe("Concept or topic to explain"),
        course_name: z.string().describe("Current course name"),
        module_name: z.string().describe("Current module name"),
        lesson_title: z.string().describe("Current lesson title"),
        provider: z.string().describe("Course provider (e.g. NPTEL, DeepLearning.AI)"),
        progress_percent: z.number().min(0).max(100).describe("Student progress 0–100"),
        analogy_style: z
          .enum(["real-world", "visual", "story"])
          .optional()
          .describe("Preferred analogy style"),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async (params) => {
      const ctx = buildLearnerContext({
        courseName: params.course_name,
        moduleName: params.module_name,
        lessonTitle: params.lesson_title,
        provider: params.provider,
        progressPercent: params.progress_percent,
      });

      const styleNote = params.analogy_style
        ? `Use a ${params.analogy_style} analogy to aid understanding.`
        : "";

      const prompt = `${ctx}\n\nExplain this concept in simple, clear terms for the learner:\n"${params.concept}"\n\n${styleNote}\n\nKeep it under 300 words. Use bullet points or short paragraphs. Avoid jargon unless defining it.`;

      try {
        const text = await generateContent(prompt, LMS_SYSTEM_INSTRUCTION, 0.6);
        return { content: [{ type: "text", text: truncate(text) }] };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `AI error: ${msg}` }] };
      }
    }
  );

  // ── lms_ai_lesson_summary ─────────────────────────────────────────────────
  server.registerTool(
    "lms_ai_lesson_summary",
    {
      title: "AI — Generate Lesson Summary",
      description: `Generate a structured summary of the current lesson content.
Returns key points, takeaways, and a quick recap.

Args:
  - lesson_content (string): The raw lesson content or transcript (max 4000 chars)
  - lesson_title (string): Lesson title
  - course_name (string): Course name
  - module_name (string): Module name
  - provider (string): Course provider

Returns: Structured lesson summary with key points and takeaways.`,
      inputSchema: z.object({
        lesson_content: z.string().min(50).max(4000).describe("Lesson content to summarize"),
        lesson_title: z.string().describe("Lesson title"),
        course_name: z.string().describe("Course name"),
        module_name: z.string().describe("Module name"),
        provider: z.string().describe("Course provider"),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async (params) => {
      const prompt = `You are summarizing a lesson for a student in Lumina LMS.

Course: ${params.course_name} (${params.provider})
Module: ${params.module_name}
Lesson: ${params.lesson_title}

Lesson content:
---
${params.lesson_content}
---

Generate a structured summary with:
1. **Overview** (2–3 sentences)
2. **Key Concepts** (bullet list, 4–6 points)
3. **Important Takeaways** (2–3 sentences)
4. **What to Remember** (one memorable sentence)

Keep it concise and student-friendly.`;

      try {
        const text = await generateContent(prompt, LMS_SYSTEM_INSTRUCTION, 0.5);
        return { content: [{ type: "text", text: truncate(text) }] };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `AI error: ${msg}` }] };
      }
    }
  );

  // ── lms_ai_generate_quiz ──────────────────────────────────────────────────
  server.registerTool(
    "lms_ai_generate_quiz",
    {
      title: "AI — Generate Lesson Quiz",
      description: `Generate a multiple-choice quiz based on the lesson topic and context.
Returns questions with options and correct answers.

Args:
  - topic (string): The lesson topic or concept to quiz on
  - course_name (string): Course name
  - difficulty (string): Quiz difficulty — "easy", "medium", "hard"
  - num_questions (number): Number of questions 2–10 (default: 5)
  - weak_topics (array, optional): Topics the student struggles with (used to weight questions)

Returns: JSON-formatted quiz with MCQ questions, options, and correct answers.`,
      inputSchema: z.object({
        topic: z.string().min(5).max(200).describe("Topic to quiz on"),
        course_name: z.string().describe("Course name for context"),
        difficulty: z
          .enum(["easy", "medium", "hard"])
          .default("medium")
          .describe("Quiz difficulty level"),
        num_questions: z.number().int().min(2).max(10).default(5).describe("Number of questions"),
        weak_topics: z
          .array(z.string())
          .optional()
          .describe("Topics to emphasize (student weak areas)"),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async (params) => {
      const weakNote = params.weak_topics?.length
        ? `Emphasize these weak areas in your questions: ${params.weak_topics.join(", ")}.`
        : "";

      const prompt = `Generate a ${params.difficulty} ${params.num_questions}-question multiple-choice quiz for a student studying "${params.topic}" in the course "${params.course_name}".

${weakNote}

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "quiz": [
    {
      "question": "Question text here?",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correct": "A",
      "explanation": "Brief explanation of why this is correct."
    }
  ]
}`;

      try {
        const raw = await generateContent(prompt, undefined, 0.4);
        // Strip markdown fences if present
        const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        let parsed: unknown;
        try {
          parsed = JSON.parse(cleaned);
        } catch {
          parsed = { raw: cleaned };
        }
        return {
          content: [{ type: "text", text: JSON.stringify(parsed, null, 2) }],
          structuredContent: parsed as Record<string, unknown>,
        };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `AI error: ${msg}` }] };
      }
    }
  );

  // ── lms_ai_revision_notes ─────────────────────────────────────────────────
  server.registerTool(
    "lms_ai_revision_notes",
    {
      title: "AI — Generate Revision Notes",
      description: `Create concise revision notes for a module or topic — similar to flash cards or a cheat sheet.

Args:
  - topic (string): Topic or module to generate notes for
  - course_name (string): Course name
  - module_name (string): Module name
  - detail_level (string): "brief" (bullet points only) or "detailed" (with explanations)

Returns: Markdown-formatted revision notes ready for study.`,
      inputSchema: z.object({
        topic: z.string().min(5).max(200).describe("Topic or module for revision"),
        course_name: z.string().describe("Course name"),
        module_name: z.string().describe("Module name"),
        detail_level: z
          .enum(["brief", "detailed"])
          .default("brief")
          .describe("brief = bullets only, detailed = with explanations"),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async (params) => {
      const prompt = `Create ${params.detail_level} revision notes for a student studying "${params.topic}" in module "${params.module_name}" of the course "${params.course_name}".

${params.detail_level === "brief"
  ? "Format as a concise bullet-point cheat sheet. 10–15 key points max."
  : "Include each key concept with a 1–2 sentence explanation. Use headers for sub-topics."}

Start directly with the content — no preamble.`;

      try {
        const text = await generateContent(prompt, LMS_SYSTEM_INSTRUCTION, 0.5);
        return { content: [{ type: "text", text: truncate(text) }] };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `AI error: ${msg}` }] };
      }
    }
  );

  // ── lms_ai_interview_questions ────────────────────────────────────────────
  server.registerTool(
    "lms_ai_interview_questions",
    {
      title: "AI — Generate Interview Questions",
      description: `Generate job-interview practice questions based on the skills learned in a course or module.
Useful for students preparing for technical interviews.

Args:
  - course_name (string): Course being studied
  - skills (array): Skills or topics covered (e.g. ["React", "hooks", "state management"])
  - interview_type (string): "technical", "behavioural", or "mixed"
  - num_questions (number): 3–15 (default: 8)

Returns: Interview questions with tips for answering each.`,
      inputSchema: z.object({
        course_name: z.string().describe("Course name"),
        skills: z
          .array(z.string())
          .min(1)
          .max(10)
          .describe("Skills or topics to generate questions for"),
        interview_type: z
          .enum(["technical", "behavioural", "mixed"])
          .default("technical")
          .describe("Type of interview questions"),
        num_questions: z
          .number()
          .int()
          .min(3)
          .max(15)
          .default(8)
          .describe("Number of questions to generate"),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async (params) => {
      const prompt = `Generate ${params.num_questions} ${params.interview_type} interview questions for a candidate who has completed the course "${params.course_name}" and learned these skills: ${params.skills.join(", ")}.

Format each as:
**Q[N]: [Question]**
_Tip: [Brief answering tip]_

Make questions progressively harder. Focus on practical application.`;

      try {
        const text = await generateContent(prompt, LMS_SYSTEM_INSTRUCTION, 0.7);
        return { content: [{ type: "text", text: truncate(text) }] };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `AI error: ${msg}` }] };
      }
    }
  );

  // ── lms_ai_generate_roadmap ───────────────────────────────────────────────
  server.registerTool(
    "lms_ai_generate_roadmap",
    {
      title: "AI — Generate Learning Roadmap",
      description: `Generate a personalised learning roadmap for a student based on their goal,
current skill level, and time available. Inspired by roadmap.sh structure.

Args:
  - goal (string): The learner's target skill or career goal (e.g. "Become a fullstack developer")
  - current_level (string): "beginner", "intermediate", or "advanced"
  - time_per_week_hours (number): Hours available per week for study (1–40)
  - available_courses (array, optional): List of course names already in the LMS to reference

Returns: Structured roadmap with phases, milestones, and recommended order.`,
      inputSchema: z.object({
        goal: z.string().min(10).max(300).describe("Career or skill goal"),
        current_level: z
          .enum(["beginner", "intermediate", "advanced"])
          .describe("Current skill level"),
        time_per_week_hours: z
          .number()
          .min(1)
          .max(40)
          .describe("Hours available per week"),
        available_courses: z
          .array(z.string())
          .optional()
          .describe("Course names available in the LMS to suggest"),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async (params) => {
      const coursesNote = params.available_courses?.length
        ? `Prioritise these available LMS courses where relevant: ${params.available_courses.join(", ")}.`
        : "";


      const prompt = `Create a personalised learning roadmap for someone who wants to: "${params.goal}"
- Current level: ${params.current_level}
- Study time: ${params.time_per_week_hours} hours/week
${coursesNote}

Structure the roadmap as phases (Phase 1, 2, 3...). For each phase include:
- Phase title and goal
- Duration estimate (weeks)
- Key skills to learn
- 2–4 concrete learning resources or topics
- A milestone to know the phase is complete

End with "What to build" — 2–3 project ideas to validate skills.

Keep it practical, opinionated, and actionable. Format in clear markdown.`;

      try {
        const text = await generateContent(prompt, LMS_SYSTEM_INSTRUCTION, 0.65);
        return { content: [{ type: "text", text: truncate(text, 8000) }] };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `AI error: ${msg}` }] };
      }
    }
  );

  // ── lms_ai_practical_applications ────────────────────────────────────────
  server.registerTool(
    "lms_ai_practical_applications",
    {
      title: "AI — Practical Applications",
      description: `Generate real-world project ideas and practical exercises for a lesson topic.
Helps learners understand how to apply what they've learned.

Args:
  - topic (string): The lesson topic
  - course_name (string): Course name
  - difficulty (string): "beginner", "intermediate", or "advanced"
  - project_type (string): "mini-project", "exercise", or "both"

Returns: 3–5 practical application ideas with brief descriptions.`,
      inputSchema: z.object({
        topic: z.string().min(5).max(200).describe("Lesson topic"),
        course_name: z.string().describe("Course name"),
        difficulty: z
          .enum(["beginner", "intermediate", "advanced"])
          .default("intermediate")
          .describe("Difficulty level"),
        project_type: z
          .enum(["mini-project", "exercise", "both"])
          .default("both")
          .describe("Type of practical application"),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async (params) => {
      const prompt = `Suggest ${params.project_type === "both" ? "3 mini-projects and 3 exercises" : params.project_type === "mini-project" ? "4–5 mini-projects" : "4–5 exercises"} for a ${params.difficulty} student learning "${params.topic}" in the course "${params.course_name}".

For each, provide:
- **Title**: Short name
- **What to build/do**: 1–2 sentences
- **Skills practiced**: bullet list
- **Time estimate**: rough hours

Keep ideas achievable and engaging. Start with simpler ones.`;

      try {
        const text = await generateContent(prompt, LMS_SYSTEM_INSTRUCTION, 0.7);
        return { content: [{ type: "text", text: truncate(text) }] };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { isError: true, content: [{ type: "text", text: `AI error: ${msg}` }] };
      }
    }
  );
}
