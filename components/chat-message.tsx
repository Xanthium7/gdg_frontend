"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  message: {
    role: "user" | "assistant";
    content: string;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Detect if the message contains Malayalam characters
  const containsMalayalam = (text: string) => {
    // Malayalam Unicode range: 0D00-0D7F
    const malayalamRegex = /[\u0D00-\u0D7F]/;
    return malayalamRegex.test(text);
  };

  const isMalayalam = containsMalayalam(message.content);

  // Extract document requirements from Malayalam text if present
  const getDocumentRequirements = (text: string) => {
    if (!text.includes("രേഖകൾ") && !text.includes("ഡോക്യുമെന്റ്")) return null;

    // This is a simplified extraction - in a real app, you might want to
    // use more sophisticated parsing based on your AI's response format
    const lines = text.split("\n");
    const docLines = lines.filter(
      (line) =>
        line.includes("•") ||
        line.includes("-") ||
        line.includes("രേഖ") ||
        line.includes("സർട്ടിഫിക്കറ്റ്")
    );

    return docLines.length > 0 ? docLines : null;
  };

  const documentRequirements = !isUser
    ? getDocumentRequirements(message.content)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`flex gap-3 max-w-[85%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className={`
          flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center
          ${
            isUser
              ? "bg-teal-dark"
              : "bg-teal-lightest border-2 border-teal-light"
          }
        `}
        >
          {isUser ? (
            <User size={24} className="text-white" />
          ) : (
            <Bot size={24} className="text-teal-dark" />
          )}
        </div>

        <div
          className={`
          py-4 px-6 rounded-3xl bubble-shadow
          ${
            isUser
              ? "bg-teal-dark text-white rounded-tr-none"
              : "bg-teal-lightest text-teal-darkest rounded-tl-none"
          }
          ${isMalayalam ? "font-ml-ttrevathi" : ""}
        `}
        >
          {/* Removed dir attribute and text-right class */}
          <p className="text-lg whitespace-pre-wrap">{message.content}</p>

          {/* Copy button for assistant messages */}
          {!isUser && (
            <div className="flex justify-end mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-teal-light/20"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check size={16} className="text-teal-medium" />
                ) : (
                  <Copy size={16} className="text-teal-medium" />
                )}
                <span className="sr-only">
                  {copied ? "Copied" : "Copy to clipboard"}
                </span>
              </Button>
            </div>
          )}

          {/* Highlighted section for document requirements */}
          {documentRequirements && (
            <div className="mt-4 bg-white rounded-2xl p-4 border border-teal-light">
              <h4 className="font-medium text-teal-dark mb-2 font-ml-ttrevathi">
                ആവശ്യമായ രേഖകൾ:
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-teal-darkest font-ml-ttrevathi">
                {documentRequirements.map((doc, index) => (
                  <li key={index}>{doc.replace(/^[•\-]+/, "").trim()}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
