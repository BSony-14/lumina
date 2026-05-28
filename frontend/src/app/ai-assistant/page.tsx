"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Send, User, Loader as Loader2, Sparkles } from "lucide-react";
import { mockUsers } from "@/lib/api/mock-data";
import type { ChatMessage } from "@/lib/api/types";

const currentUser = mockUsers[0];

const suggestedQuestions = [
  "Explain React hooks in simple terms",
  "Generate a quiz on JavaScript async/await",
  "Create revision notes for Data Structures",
  "What are practical uses of machine learning?",
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm Lumina, your AI learning coach. I can help you understand concepts, generate quizzes, create revision notes, and provide personalized learning guidance. What would you like to learn about today?",
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
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses: Record<string, string> = {
        "react hooks":
          "**React Hooks Explained Simply**\n\nHooks are special functions that let you \"hook into\" React features from function components.\n\n**useState** - Adds state to your component:\n```jsx\nconst [count, setCount] = useState(0);\n```\n\n**useEffect** - Runs side effects (API calls, subscriptions):\n```jsx\nuseEffect(() => {\n  // runs on mount\n}, []);\n```\n\n**Key Points:**\n- Only call hooks at the top level\n- Only call hooks from React functions\n- Hooks let you reuse stateful logic without changing your component hierarchy",
        quiz:
          "**Quiz: JavaScript Async/Await**\n\n**Q1:** What does `async` do to a function?\nA) Makes it run faster\nB) Returns a Promise\nC) Blocks execution\nD) Nothing\n\n**Answer:** B) Returns a Promise\n\n**Q2:** How do you handle errors with async/await?\nA) `error()` block\nB) `catch()` block\nC) `try/catch` block\nD) `handle()` block\n\n**Answer:** C) `try/catch` block\n\n**Q3:** What happens if you `await` a non-Promise value?\nA) Error\nB) Returns undefined\nC) Wraps it in a resolved Promise\nD) Throws exception\n\n**Answer:** C) Wraps it in a resolved Promise",
        revision:
          "**Revision Notes: Data Structures**\n\n### Arrays\n- **Time Complexity:** Access O(1), Insert/Delete O(n)\n- Contiguous memory allocation\n- Fixed or dynamic size\n\n### Linked Lists\n- **Time Complexity:** Access O(n), Insert/Delete O(1) at known position\n- Non-contiguous memory\n- Each node has data + pointer\n\n### Stacks (LIFO)\n- Operations: push, pop, peek\n- Applications: undo operations, expression evaluation\n\n### Queues (FIFO)\n- Operations: enqueue, dequeue\n- Applications: task scheduling, BFS\n\n### Hash Tables\n- **Average Time:** O(1) for all operations\n- Collision handling: chaining, open addressing\n\n### Trees\n- Binary Search Tree: left < root < right\n- Balanced trees (AVL, Red-Black): O(log n) operations",
        practical:
          "**Practical Applications of Machine Learning**\n\n**1. Mini-Project: Spam Email Classifier**\n- Build a text classifier using Naive Bayes\n- Skills: NLP preprocessing, feature extraction\n- Time: 4-6 hours\n\n**2. Image Classification App**\n- Train a CNN on a custom dataset\n- Skills: deep learning, transfer learning\n- Time: 8-12 hours\n\n**3. Recommendation System**\n- Build a collaborative filtering model\n- Skills: matrix factorization, evaluation metrics\n- Time: 6-8 hours\n\n**4. Sentiment Analysis Tool**\n- Analyze Twitter/X sentiment in real-time\n- Skills: API integration, NLP pipelines\n- Time: 5-7 hours",
      };

      let responseText =
        "I'd be happy to help you with that! Could you provide more details about what you're working on? For example:\n\n- What course or topic are you studying?\n- Are you looking for an explanation, quiz, or practice problems?\n- What's your current level of understanding?";

      for (const [key, value] of Object.entries(aiResponses)) {
        if (inputValue.toLowerCase().includes(key)) {
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
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Bot className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Lumina AI Coach</h1>
            <p className="text-sm text-muted-foreground">
              Your personalized learning assistant
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <Card
                className={`max-w-[80%] px-4 py-3 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
              </Card>
              {message.role === "user" && (
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={currentUser.avatar_url} />
                  <AvatarFallback>
                    {currentUser.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <Card className="px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested questions */}
      {messages.length === 1 && (
        <div className="border-t bg-card px-6 py-4">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              Suggested questions
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputValue(question);
                    handleSend();
                  }}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t bg-card px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              placeholder="Ask anything about your courses..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1"
              disabled={isTyping}
            />
            <Button type="submit" disabled={isTyping || !inputValue.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
