"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, User } from "lucide-react";
import { Message } from "./types";
import { QuickActions } from "./quick-actions";
import { useEditorStore } from "../editor/store/editor-store";
import { useReportStore } from "./store/report-store";
import { defaultContent } from "../editor/components/text-editor";
import { CustomModal } from "@/components/ui/custom-modal";

export default function AgentChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content:
        "안녕하세요! 리포트 어시스턴트입니다. 보고서를 검토하고 개선 사항을 제안해드리겠습니다. 어떤 도움이 필요하신가요?",
    },
  ]);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [completionMessage, setCompletionMessage] = useState("");

  const { editorContent, setEditorContent, isLoading, setIsLoading, setCurrentSection, selectedSubsectionId, updateCachedSections, triggerForceUpdate } = useEditorStore();
  const { reportId } = useReportStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 editorContent가 비어있으면 기본값으로 설정
    if (!editorContent) {
      setEditorContent(defaultContent);
    }
  }, [editorContent, setEditorContent]);

  const handleQuickAction = async (options: { action: string; subject?: string }) => {
    const { action, subject } = options;
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: `[${action} 요청]`,
    };
    const aiGeneratingMessage: Message = {
      id: `ai-${Date.now()}`,
      type: "ai",
      content: "생성중입니다...",
      isGenerating: true,
    };

    setMessages((prev) => [...prev, userMessage, aiGeneratingMessage]);
    setIsLoading(true);
    setCurrentSection(action);

    try {
      const requestBody: { classification: string; subject?: string; contents?: string } = {
        classification: action,
      };

      const needsContent = ["자세히", "간결하게", "윤문"].includes(action);
      const needsSubject = ["특허", "논문", "뉴스"].includes(action);

      if (needsContent) {
        if (!editorContent || editorContent.trim() === "") {
          alert("에디터에 내용이 없습니다.");
          setMessages((prev) => prev.slice(0, -2)); // 사용자, AI 메시지 제거
          setIsLoading(false);
          return;
        }
        requestBody.contents = editorContent;
      }

      if (needsSubject) {
        if (subject) {
          requestBody.subject = subject;
        } else {
          // subject가 없는 경우에 대한 처리 (예: 경고 또는 기본값 사용)
          // subject가 없는 경우 editorContent의 첫 줄을 제목으로 사용
          const firstLine = editorContent?.split('\n')[0].trim() || "";
          const title = firstLine.replace(/#/g, '').trim();
          requestBody.subject = title || "인공지능 기반 사업 계획"; // 제목이 없으면 기본값 사용
        }
      }

      const response = await fetch("/api/report/regenerate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.contents || "API 요청 실패");
      }

      const data = await response.json();

      if (data.result === 'success') {
        // 특허, 논문, 뉴스의 경우 기존 내용 뒤에 추가, 나머지는 교체
        const shouldAppend = ["특허", "논문", "뉴스"].includes(action);
        const newContent = shouldAppend 
          ? editorContent + "\n\n" + data.contents 
          : data.contents;
        
        setEditorContent(newContent);
        triggerForceUpdate(); // 에디터 강제 업데이트 트리거
        
        // DB에 수정된 내용 저장 및 캐시 업데이트
        if (reportId && selectedSubsectionId) {
          try {
            const updateResponse = await fetch(`/api/reports/${reportId}/sections/${selectedSubsectionId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                content: newContent,
              }),
            });

            if (updateResponse.ok) {
              const updateResult = await updateResponse.json();
              if (updateResult.success && updateResult.data) {
                // 캐시 업데이트: DB에 저장된 최신 데이터로 캐시 갱신
                updateCachedSections([updateResult.data]);
                
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiGeneratingMessage.id
                      ? { ...msg, content: `[${action}] 요청이 완료되어 에디터 및 DB에 저장되었습니다.`, isGenerating: false }
                      : msg
                  )
                );
              } else {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiGeneratingMessage.id
                      ? { ...msg, content: `[${action}] 요청이 완료되어 에디터에 반영되었으나 DB 저장에 실패했습니다.`, isGenerating: false }
                      : msg
                  )
                );
              }
            } else {
              const errorData = await updateResponse.json().catch(() => ({}));
              const errorMsg = errorData.message || 'DB 저장 실패';
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiGeneratingMessage.id
                    ? { ...msg, content: `[${action}] 요청이 완료되어 에디터에 반영되었으나 DB 저장 중 오류가 발생했습니다: ${errorMsg}`, isGenerating: false }
                    : msg
                )
              );
            }
          } catch (error) {
            // DB 저장 실패해도 에디터에는 반영됨
            const errorMsg = error instanceof Error ? error.message : 'DB 저장 실패';
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiGeneratingMessage.id
                  ? { ...msg, content: `[${action}] 요청이 완료되어 에디터에 반영되었으나 DB 저장 중 오류가 발생했습니다: ${errorMsg}`, isGenerating: false }
                  : msg
              )
            );
          }
        } else {
          // reportId 또는 selectedSubsectionId가 없는 경우
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiGeneratingMessage.id
                ? { ...msg, content: `[${action}] 요청이 완료되어 에디터에 반영되었습니다. (리포트 정보가 없어 DB에 저장되지 않았습니다)`, isGenerating: false }
                : msg
            )
          );
        }
        
        // 완료 모달 표시
        setCompletionMessage(`[${action}] 작업이 완료되었습니다.`);
        setIsCompletionModalOpen(true);
      } else {
        throw new Error(data.contents || '작업 처리 중 오류가 발생했습니다.');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Quick Action Error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiGeneratingMessage.id
            ? { ...msg, content: `오류: ${errorMessage}`, isGenerating: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      setCurrentSection(null);
    }
  };

  const handleCloseCompletionModal = () => {
    setIsCompletionModalOpen(false);
    setCompletionMessage("");
  };

  return (
    <>
      <QuickActions handleQuickAction={handleQuickAction} isLoading={isLoading} />

      {/* Completion Modal */}
      <CustomModal
        isOpen={isCompletionModalOpen}
        
        onClose={handleCloseCompletionModal}
        width="400px"
        height="auto"
        padding="24px"
        headerClassName="justify-end"
        contentClassName="items-center justify-center"
        closeButtonClassName="absolute top-0 right-0"
      >
        <div className="flex flex-col items-center justify-center w-full gap-6 py-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              작업 완료
            </h3>
            <p className="text-gray-600">{completionMessage}</p>
          </div>
          <button
            onClick={handleCloseCompletionModal}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            확인
          </button>
        </div>
      </CustomModal>

      {/* Chat Messages Area */}
      <div
        className="flex h-[513px] flex-col gap-3 self-stretch overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
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
