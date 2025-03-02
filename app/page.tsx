"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Send, HelpCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import ChatMessage from "@/components/ui/chat-message";
import WelcomeHeader from "@/components/ui/welcome-header";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createChatSession, sendChatMessage, getChatHistory } from "./actions";

export default function Home() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Initialize chat session when component mounts
  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      setSessionError(null);
      const session = await createChatSession();
      setSessionId(session.session_id);
      console.log("Chat session initialized with ID:", session.session_id);
    } catch (error) {
      console.error("Failed to initialize chat session:", error);
      setSessionError(
        "സെഷൻ ആരംഭിക്കാൻ കഴിഞ്ഞില്ല. ദയവായി പേജ് റീലോഡ് ചെയ്യുക."
      ); // "Failed to initialize session. Please reload the page."
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !sessionId || isLoading) return;

    // Add user message to chat
    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");
    setShowSuggestions(false);

    try {
      // Send message to FastAPI endpoint using session ID
      const data = await sendChatMessage(sessionId, userMessage.content);

      // Add AI response to chat (will be in Malayalam as per your backend)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.response || "മറുപടി ലഭിക്കാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കുക.", // Fallback: "Couldn't get a response. Please try again."
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "സാങ്കേതിക പിശക് ഉണ്ടായി. ദയവായി വീണ്ടും ശ്രമിക്കുക.", // "A technical error occurred. Please try again."
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  // Malayalam example questions relevant to Kerala government services
  const malayalamExamples = [
    "ബാങ്ക് അക്കൗണ്ട് തുടങ്ങാൻ എന്തെല്ലാം രേഖകൾ വേണം?",
    "സീനിയർ സിറ്റിസൺ കാർഡിന് എങ്ങനെ അപേക്ഷിക്കാം?",
    "വയോജന പെൻഷനു വേണ്ട രേഖകൾ എന്തൊക്കെയാണ്?",
    "ആധാർ കാർഡ് അപ്ഡേറ്റ് ചെയ്യേണ്ടത് എങ്ങനെ?",
    "വിധവാ പെൻഷൻ അപേക്ഷിക്കുന്നതിനുള്ള നടപടിക്രമം എന്താണ്?",
    "റേഷൻ കാർഡ് പുതുക്കുന്നത് എങ്ങനെ?",
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-2 sm:p-4 md:p-8 bg-gradient-to-b from-teal-lightest to-white">
      <div className="w-full max-w-5xl mx-auto flex flex-col h-screen">
        <WelcomeHeader />

        {sessionError ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">സിസ്റ്റം പിശക്</h3>
              <p className="mb-4 font-ml-ttrevathi">{sessionError}</p>
            </div>
            <Button onClick={initializeSession} className="gap-2">
              <RefreshCw size={16} />
              <span>വീണ്ടും ശ്രമിക്കുക</span> {/* Try Again */}
            </Button>
          </div>
        ) : (
          <Card className="flex-1 overflow-hidden mb-4 shadow-xl border-teal-light bg-white rounded-3xl bubble-shadow">
            <div className="h-full flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-6">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="rounded-full bg-teal-light/20 p-8 mb-6 animate-float">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-teal-dark"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-teal-dark mb-3 font-ml-ttrevathi">
                      കേരള ഗവൺമെന്റ് സഹായി
                    </h2>
                    <p className="text-xl text-teal-medium max-w-md mb-8 font-ml-ttrevathi">
                      സർക്കാർ സേവനങ്ങൾ, രേഖകൾ, നടപടിക്രമങ്ങൾ
                      എന്നിവയെക്കുറിച്ചുള്ള നിങ്ങളുടെ ചോദ്യങ്ങൾക്ക് സഹായിക്കാൻ
                      എനിക്ക് കഴിയും.
                    </p>

                    {showSuggestions && (
                      <div className="grid gap-3 mt-4 w-full max-w-md">
                        <h3 className="text-lg font-medium text-teal-dark font-ml-ttrevathi">
                          ഇതുപോലെ ചോദിക്കാം:
                        </h3>
                        {malayalamExamples.slice(0, 3).map((example, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="p-5 h-auto text-lg rounded-2xl border-teal-light hover:bg-teal-light/10 hover:border-teal-medium transition-all duration-300 font-ml-ttrevathi"
                            onClick={() => handleSuggestionClick(example)}
                          >
                            {example}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <ChatMessage key={index} message={message} />
                    ))}
                    {isLoading && (
                      <div className="flex items-center space-x-3 text-teal-medium p-4 rounded-2xl bg-teal-lightest max-w-[80%]">
                        <div className="w-3 h-3 rounded-full bg-teal-light animate-bounce"></div>
                        <div
                          className="w-3 h-3 rounded-full bg-teal-medium animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-3 h-3 rounded-full bg-teal-dark animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                        <span className="text-lg font-medium font-ml-ttrevathi">
                          ഉത്തരം തയ്യാറാക്കുന്നു...
                        </span>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Fixed height footer container */}
              <div className="border-t border-teal-lightest flex-shrink-0">
                <form onSubmit={handleSubmit} className="p-2 sm:p-4">
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="നിങ്ങളുടെ ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക..."
                        className="flex-1 resize-none text-base sm:text-lg p-3 pr-10 sm:p-4 sm:pr-12 rounded-2xl min-h-[60px] max-h-[120px] sm:min-h-[80px] border-teal-light focus-visible:ring-teal-medium font-ml-ttrevathi"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                          }
                        }}
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-2 sm:right-3 sm:top-3 text-teal-medium hover:text-teal-dark hover:bg-transparent"
                              onClick={() =>
                                setShowSuggestions(!showSuggestions)
                              }
                            >
                              <HelpCircle size={20} />
                              <span className="sr-only">ഉദാഹരണ കാണിക്കുക</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-ml-ttrevathi">
                              ഉദാഹരണ ചോദ്യങ്ങൾ
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Button
                      type="submit"
                      size="icon"
                      className="h-10 w-10 sm:h-12 sm:w-12 aspect-square rounded-full bg-teal-dark hover:bg-teal-darkest self-end p-2 sm:p-3 shadow-md transition-all duration-300 hover:shadow-lg"
                      disabled={isLoading || !input.trim() || !sessionId}
                    >
                      <Send size={20} />
                      <span className="sr-only">അയയ്ക്കുക</span>
                    </Button>
                  </div>

                  {/* Add fixed height container with overflow for suggestions */}
                  {showSuggestions && messages.length > 0 && (
                    <div className="mt-4 suggestion-container">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {malayalamExamples.map((example, index) => (
                          <Button
                            key={index}
                            type="button"
                            variant="outline"
                            className="text-sm p-2 h-auto rounded-xl border-teal-light hover:bg-teal-light/10 font-ml-ttrevathi"
                            onClick={() => handleSuggestionClick(example)}
                          >
                            {example}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
