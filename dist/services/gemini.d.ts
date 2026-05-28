export declare function generateContent(prompt: string, systemInstruction?: string, temperature?: number): Promise<string>;
export declare function buildLearnerContext(ctx: {
    courseName: string;
    moduleName: string;
    lessonTitle: string;
    provider: string;
    progressPercent: number;
    weakTopics?: string[];
}): string;
export declare const LMS_SYSTEM_INSTRUCTION = "You are Lumina, an expert AI learning coach embedded in Lumina LMS.\nYou provide clear, contextual, and encouraging educational support.\nAlways tailor your response to the specific course, lesson, and learner context provided.\nBe concise, structured, and practical. Use markdown formatting where helpful.";
//# sourceMappingURL=gemini.d.ts.map