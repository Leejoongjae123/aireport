"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, User } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  isGenerating?: boolean;
}

export default function AgentChat() {
  const quickActions = [
    "자세히 쓰기",
    "간결하게 쓰기",
    "윤문하기",
    "논문검색",
    "뉴스검색",
    "특허검색",
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content:
        "안녕하세요! 리포트 어시스턴트입니다. 보고서를 검토하고 개선 사항을 제안해드리겠습니다. 어떤 도움이 필요하신가요?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickAction = (action: string) => {
    // 사용자 메시지 추가
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: `[${action} 요청]`,
    };

    setMessages((prev) => [...prev, userMessage]);

    // AI 생성중 메시지 추가
    const aiGeneratingMessage: Message = {
      id: `ai-${Date.now()}`,
      type: "ai",
      content: "생성중입니다...",
      isGenerating: true,
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, aiGeneratingMessage]);

      // 2초 후 실제 응답으로 교체
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiGeneratingMessage.id
              ? {
                  ...msg,
                  content: getAIResponse(action),
                  isGenerating: false,
                }
              : msg
          )
        );
      }, 2000);
    }, 300);
  };

  const getAIResponse = (action: string): string => {
    const responses: Record<string, string> = {
      "자세히 쓰기":
        "선택하신 내용을 더 자세하고 구체적으로 작성해드렸습니다. 추가 설명과 예시를 포함하여 내용을 보강했습니다.",
      "간결하게 쓰기":
        "선택하신 내용을 핵심만 남기고 간결하게 정리했습니다. 불필요한 표현을 제거하고 명확하게 작성했습니다.",
      윤문하기:
        "선택하신 내용의 문장을 다듬고 표현을 개선했습니다. 더 자연스럽고 전문적인 문체로 수정했습니다.",
      논문검색:
        "선택하신 키워드와 관련된 최신 논문을 검색중입니다. 관련성 높은 학술 자료를 찾아드리겠습니다.",
      뉴스검색:
        "최신 뉴스와 시장 동향을 검색중입니다. 관련 기사와 인사이트를 제공해드리겠습니다.",
      특허검색:
        "관련 특허 정보를 검색중입니다. 유사 기술과 특허 동향을 분석해드리겠습니다.",
    };

    return (
      responses[action] ||
      `[${action}] 요청을 처리중입니다. 잠시만 기다려주세요.`
    );
  };

  return (
    <>
      {/* Quick Action Buttons */}
      <div className="flex py-5 items-start content-start gap-2 self-stretch flex-wrap border-b border-[#D9D9D9] mb-3">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleQuickAction(action)}
            className="flex h-6 py-1 px-2 justify-center items-center gap-1 rounded border border-[#BAD1EC] bg-white hover:bg-blue-50 transition-colors"
          >
            <span className="text-[#5A5A5A] font-medium text-xs leading-4">
              {action}
            </span>
          </button>
        ))}
      </div>

      {/* Chat Messages Area */}
      <div className="flex h-[513px] flex-col gap-3 self-stretch overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col gap-3 flex-1 self-stretch px-1">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-center gap-2 ${
                message.type === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Profile Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === "ai" ? "bg-blue-100" : "bg-[#0077FF]"
                }`}
              >
                {message.type === "ai" ? (
                  <Bot className="w-5 h-5 text-blue-600" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`flex py-2.5 px-4 items-center gap-2.5 rounded-lg max-w-[80%] ${
                  message.type === "ai"
                    ? "bg-[#FAFAFA]"
                    : "bg-[#0077FF] shadow-sm"
                }`}
              >
                <div
                  className={`flex-1 font-medium text-sm leading-5 tracking-[-0.064px] ${
                    message.type === "ai" ? "text-[#5A5A5A]" : "text-white"
                  } ${message.isGenerating ? "animate-pulse" : ""}`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </>
  );
}
