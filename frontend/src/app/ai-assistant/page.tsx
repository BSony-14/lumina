"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Send, User, Loader as Loader2, Sparkles, BookOpen, FileText, Lightbulb, RefreshCw } from "lucide-react";
import { mockUsers } from "@/lib/api/mock-data";
import type { ChatMessage } from "@/lib/api/types";

const userName = "Sony";
const currentUser = mockUsers[0];

const suggestedQuestions = [
  { icon: BookOpen, text: "Explain React hooks in simple terms", category: "Course Help" },
  { icon: FileText, text: "Generate practice quiz on async/await", category: "Practice" },
  { icon: Lightbulb, text: "Create revision notes for Data Structures", category: "Review" },
  { icon: Sparkles, text: "Suggest next steps for my ML journey", category: "Path" },
];

const contextPrompt = `You are ${userName}'s AI learning coach on Lumina. Context: They're learning web development (React, Node.js) and machine learning. Current progress: React hooks module (68%), ML fundamentals (45%).`;

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hey ${userName}! I noticed you're making great progress on React hooks (68% complete). Ready to dive deeper into \`useEffect\` or would you like to tackle the async/await concepts from your ML course?

I can also:
- **Generate practice quizzes** based on what you've learned
- **Create revision notes** for quick review
- **Explain complex concepts** in simpler terms
- **Suggest learning paths** tailored to your goals`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponses: Record<string, string> = {
        "react hooks":
          `Great question, ${userName}! Let me break down React hooks for you:\n\n**useState** - Manages component state:\n\`\`\`jsx\nconst [count, setCount] = useState(0);\nconst [user, setUser] = useState(null);\n\`\`\`\n\n**useEffect** - Side effects (API calls, subscriptions):\n\`\`\`jsx\nuseEffect(() => {\n  fetchData();\n}, []); // Empty deps = runs once on mount\n\`\`\`\n\n**Key Rules:**\n1. Only call hooks at the top level\n2. Only call hooks from React functions\n3. Dependencies array controls when effects run\n\nWant me to generate a practice quiz on hooks?`,
        quiz:
          `**Practice Quiz: JavaScript Async/Await**\n\nLet's test your knowledge:\n\n**Q1:** What does \`async\` do to a function?\n\nA) Makes it run faster  \nB) Returns a Promise automatically  \nC) Blocks the thread  \n\n> Think about it... Async functions always return Promises!\n\n**Q2:** How do you handle errors in async/await?\n\nA) \`error()\` block  \nB) \`try/catch\` block  \nC) \`handle()\` block  \n\n<details>\n<summary>Reveal Answer</summary>\n\n**Q1:** B - Async functions automatically wrap return values in Promises  \n**Q2:** B - Use try/catch around await statements\n\n</details>\n\nWould you like more questions or explanations?`,
        revision:
          `**Quick Revision: Data Structures** ${userName}\n\n### Arrays\n- Access: O(1) | Insert/Delete: O(n)\n- Contiguous memory\n- Best for: Index-based access\n\n### Linked Lists\n- Access: O(n) | Insert/Delete: O(1) at known position\n- Non-contiguous memory\n- Best for: Frequent insertions/deletions\n\n### Stacks (LIFO)\n- Operations: push, pop, peek\n- Use cases: Undo systems, parsing\n\n### Queues (FIFO)\n- Operations: enqueue, dequeue\n- Use cases: Task scheduling, BFS\n\n### Quick Tip 💡\nFor your ML course, focus on **Hash Tables** - they're crucial for efficient feature lookup!\n\nWant me to generate practice problems?`,
        suggest:
          `Based on your progress, ${userName}, here's what I recommend:\n\n**Immediate Next Steps:**\n1. Complete the React hooks module (you're at 68% - almost there!)\n2. Practice \`useEffect\` with real API calls\n3. Start the ML assignment on neural networks\n\n**This Week's Focus:**\n- Build a small React app using useState + useEffect\n- Review gradient descent before the ML Q&A session\n\n**Long-term Path:**\n- Your ML journey is 45% complete - consider the AWS cloud course next for deployment skills\n\nShall I create a personalized study schedule for you?`,
      };

      let responseText =
        `I'd be happy to help, ${userName}! I can:\n\n- **Explain concepts** from your courses\n- **Generate practice material** (quizzes, exercises)\n- **Create study aids** (revision notes, summaries)\n- **Plan your learning path** based on your goals\n\nWhat would you like to work on?`;

      for (const [key, value] of Object.entries(aiResponses)) {
        if (currentInput.toLowerCase().includes(key)) {
          responseText = value;
          break;
        }
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickAction = (text: string) => {
    setInputValue(text);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-muted/20">
      {/* Header */}
      <div className="border-b bg-background/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">AI Learning Coach</h1>
              <p className="text-xs text-muted-foreground">
                Personalized help for your learning journey
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="gap-1">
            <RefreshCw className="h-3 w-3" />
            Clear Chat
          </Button>
        </div>
      </div>

      {/* Context Bar */}
      <div className="border-b bg-background/50 px-6 py-2">
        <div className="mx-auto flex max-w-4xl items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            React (68%)
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            ML Fundamentals (45%)
          </span>
          <span>•</span>
          <span>Active learner since Jan 2024</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border shadow-sm"
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
              </div>
              {message.role === "user" && (
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={currentUser.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {userName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="rounded-2xl bg-background border px-4 py-3 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Actions */}
      {messages.length <= 2 && (
        <div className="border-t bg-background/80 px-6 py-4 backdrop-blur">
          <div className="mx-auto max-w-4xl">
            <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              Suggested for you, {userName}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {suggestedQuestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(item.text)}
                  className="flex items-center gap-3 rounded-xl border bg-background p-3 text-left transition-all hover:border-primary hover:shadow-sm"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t bg-background px-6 py-4">
        <div className="mx-auto max-w-4xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              placeholder={`Ask anything about your courses, ${userName}...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 rounded-xl"
              disabled={isTyping}
            />
            <Button type="submit" disabled={isTyping || !inputValue.trim()} size="default">
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Press Enter to send • AI responses are tailored to your learning progress
          </p>
        </div>
      </div>
    </div>
  );
}
