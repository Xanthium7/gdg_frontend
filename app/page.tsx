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
  // Remove the messagesEndRef since we're not using auto-scroll anymore
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

  // Remove the scrollToBottom function and the useEffect that calls it

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
    <main className="flex flex-col items-center p-2 sm:p-4 md:p-8 bg-gradient-to-b from-teal-lightest to-white h-screen max-h-screen overflow-hidden">
      <div className="w-full max-w-5xl mx-auto flex flex-col h-full max-h-full overflow-hidden">
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
          <Card className="flex-1 overflow-hidden mb-0 shadow-xl border-teal-light bg-white rounded-3xl bubble-shadow transition-all duration-300 hover:shadow-2xl">
            <div className="h-full flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-7 bg-gradient-to-b from-white to-teal-lightest/20">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-8">
                    <div className="rounded-full bg-teal-light/20 p-8 mb-8  shadow-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="72"
                        height="72"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-teal-dark drop-shadow-md"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-teal-dark mb-4 font-ml-ttrevathi tracking-tight">
                      കേരള ഗവൺമെന്റ് സഹായി
                    </h2>
                    <p className="text-xl text-teal-medium max-w-lg mb-10 font-ml-ttrevathi leading-relaxed">
                      സർക്കാർ സേവനങ്ങൾ, രേഖകൾ, നടപടിക്രമങ്ങൾ
                      എന്നിവയെക്കുറിച്ചുള്ള നിങ്ങളുടെ ചോദ്യങ്ങൾക്ക് സഹായിക്കാൻ
                      എനിക്ക് കഴിയും.
                    </p>

                    {showSuggestions && (
                      <div className="grid gap-4 mt-6 w-full max-w-lg">
                        <h3 className="text-lg font-bold text-teal-dark font-ml-ttrevathi">
                          ഇതുപോലെ ചോദിക്കാം:
                        </h3>
                        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                          {malayalamExamples
                            .slice(0, 4)
                            .map((example, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                className="p-3 py-4 h-auto min-h-[80px] text-base md:text-lg rounded-2xl border-teal-light bg-white/80 hover:bg-teal-light/15 hover:border-teal-medium hover:scale-[1.02] hover:shadow-md transition-all duration-300 font-ml-ttrevathi text-center whitespace-normal break-words leading-relaxed flex items-center justify-center"
                                onClick={() => handleSuggestionClick(example)}
                              >
                                {example}
                              </Button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <ChatMessage key={index} message={message} />
                    ))}
                    {isLoading && (
                      <div className="flex items-center space-x-3 text-teal-medium p-5 rounded-2xl bg-teal-lightest max-w-[80%] shadow-sm">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 rounded-full bg-teal-light animate-pulse"></div>
                          <div
                            className="w-3 h-3 rounded-full bg-teal-medium animate-pulse"
                            style={{ animationDelay: "0.3s" }}
                          ></div>
                          <div
                            className="w-3 h-3 rounded-full bg-teal-dark animate-pulse"
                            style={{ animationDelay: "0.6s" }}
                          ></div>
                        </div>
                        <span className="text-lg font-medium font-ml-ttrevathi ml-2 animate-pulse">
                          ഉത്തരം തയ്യാറാക്കുന്നു...
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="border-t border-teal-lightest bg-white flex-shrink-0 shadow-inner">
                <form onSubmit={handleSubmit} className="p-3 sm:p-5">
                  <div className="flex space-x-3">
                    <div className="relative flex-1">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="നിങ്ങളുടെ ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക..."
                        className="flex-1 resize-none text-base sm:text-lg p-4 pr-12 rounded-2xl min-h-[60px] max-h-[120px] sm:min-h-[80px] border-teal-light focus-visible:ring-teal-medium shadow-sm focus:shadow-md transition-shadow duration-300 font-ml-ttrevathi"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                          }
                        }}
                      />
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-3 top-3 text-teal-medium hover:text-teal-dark hover:bg-teal-lightest rounded-full transition-all duration-200"
                              onClick={() =>
                                setShowSuggestions(!showSuggestions)
                              }
                            >
                              <HelpCircle size={22} />
                              <span className="sr-only">ഉദാഹരണ കാണിക്കുക</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-teal-dark text-white">
                            <p className="font-ml-ttrevathi px-1">
                              ഉദാഹരണ ചോദ്യങ്ങൾ
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Button
                      type="submit"
                      size="icon"
                      className="h-12 w-12 sm:h-14 sm:w-14 aspect-square rounded-full bg-teal-dark hover:bg-teal-darkest self-end p-2 sm:p-3 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
                      disabled={isLoading || !input.trim() || !sessionId}
                    >
                      <Send size={22} className="text-white" />
                      <span className="sr-only">അയയ്ക്കുക</span>
                    </Button>
                  </div>

                  {showSuggestions && messages.length > 0 && (
                    <div className="mt-4 max-h-[180px] overflow-y-auto suggestion-container bg-teal-lightest/30 p-3 rounded-xl border border-teal-light/30 animate-fadeIn">
                      <h4 className="text-sm font-medium text-teal-dark mb-2 font-ml-ttrevathi">
                        ചോദിക്കാവുന്ന മറ്റ് ചോദ്യങ്ങൾ:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {malayalamExamples.map((example, index) => (
                          <Button
                            key={index}
                            type="button"
                            variant="outline"
                            className="text-sm p-3 py-4 h-auto min-h-[70px] rounded-xl bg-white/60 border-teal-light/50 hover:bg-teal-light/20 hover:border-teal-medium font-ml-ttrevathi transition-all duration-200 whitespace-normal break-words leading-relaxed flex items-center justify-center"
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
