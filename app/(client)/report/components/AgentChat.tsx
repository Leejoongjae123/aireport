"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, User } from "lucide-react";
import { Message } from "./types";
import { QuickActions } from "./QuickActions";
import { useEditorStore } from "../editor/store/EditorStore";
import { useReportStore } from "./store/ReportStore";
import { defaultContent } from "../editor/components/TextEditor";
import { CustomModal } from "@/components/ui/CustomModal";
import { pollJobStatus, getStatusMessage } from "./lib/PollingUtils";
import { RegenerateConfirmModal } from "./RegenerateConfirmModal";

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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingContent, setPendingContent] = useState<string | null>(null);
  const [originalContentBeforeRegenerate, setOriginalContentBeforeRegenerate] =
    useState<string | null>(null);
  const [pendingActionLabel, setPendingActionLabel] = useState<string | null>(
    null
  );
  const [pendingMessageId, setPendingMessageId] = useState<string | null>(null);

  const {
    editorContent,
    setEditorContent,
    isLoading,
    setIsLoading,
    setCurrentSection,
    selectedSubsectionId,
    updateCachedSections,
    triggerForceUpdate,
  } = useEditorStore();
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

  const handleQuickAction = async (options: {
    action: string;
    subject?: string;
  }) => {
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
      const requestBody: {
        classification: string;
        subject?: string;
        contents?: string;
      } = {
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
          const firstLine = editorContent?.split("\n")[0].trim() || "";
          const title = firstLine.replace(/#/g, "").trim();
          requestBody.subject = title || "인공지능 기반 사업 계획"; // 제목이 없으면 기본값 사용
        }
      }

      // Step 1: 재생성 작업 시작
      let response: Response;
      try {
        response = await fetch("/api/report/regenerate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
      } catch (fetchError) {
        const errorMsg =
          fetchError instanceof Error ? fetchError.message : String(fetchError);
        console.error(`[${action}] 네트워크 에러:`, errorMsg);
        throw new Error(`네트워크 연결 실패: ${errorMsg}`);
      }

      console.log(`[${action}] API 응답 상태:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        let errorData;
        let errorMessage = "API 요청 실패";

        try {
          errorData = await response.json();
          errorMessage =
            errorData.message || errorData.contents || errorMessage;
        } catch {
          try {
            const errorText = await response.text();
            errorMessage =
              errorText || `HTTP ${response.status} ${response.statusText}`;
          } catch {
            errorMessage = `HTTP ${response.status} ${response.statusText}`;
          }
        }

        console.error(`[${action}] API 에러:`, {
          status: response.status,
          errorData,
          errorMessage,
        });

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`[${action}] 작업 시작 응답:`, {
        success: data.success,
        task_id: data.task_id,
        message: data.message,
      });

      if (!data.success || !data.task_id) {
        throw new Error(data.message || "작업 시작 실패");
      }

      // Step 2: 폴링으로 작업 완료 대기
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiGeneratingMessage.id
            ? {
                ...msg,
                content: "작업이 시작되었습니다. 완료될 때까지 기다려주세요...",
                isGenerating: true,
              }
            : msg
        )
      );

      const jobResult = await pollJobStatus({
        taskId: data.task_id,
        interval: 5000, // 5초마다 폴링
        maxAttempts: 60, // 최대 5분
        onProgress: (progressData) => {
          const statusMsg =
            progressData.meta?.status || getStatusMessage(progressData.status);
          console.log(`[${action}] 작업 진행 중:`, statusMsg);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiGeneratingMessage.id
                ? {
                    ...msg,
                    content: statusMsg,
                    isGenerating: true,
                  }
                : msg
            )
          );
        },
      });

      console.log(`[${action}] 작업 완료:`, {
        status: jobResult.status,
        hasResult: !!jobResult.result,
      });

      // Step 3: 결과 처리
      if (jobResult.status === "SUCCESS" && jobResult.result) {
        const resultContents = jobResult.result.contents;

        if (!resultContents) {
          throw new Error("작업은 완료되었으나 결과 내용이 없습니다.");
        }
        // 특허, 논문, 뉴스의 경우 기존 내용 뒤에 추가, 나머지는 교체
        const shouldAppend = ["특허", "논문", "뉴스"].includes(action);
        const newContent = shouldAppend
          ? editorContent + "\n\n" + resultContents
          : resultContents;
        // 확인 모달을 통해 사용자가 적용 여부를 선택하도록 처리
        setOriginalContentBeforeRegenerate(editorContent);
        setPendingContent(newContent);
        setPendingActionLabel(action);
        setPendingMessageId(aiGeneratingMessage.id);
        setIsConfirmModalOpen(true);

        // 챗 메시지 업데이트: 결과가 준비되었음을 안내
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiGeneratingMessage.id
              ? {
                  ...msg,
                  content: `[${action}] AI 제안이 준비되었습니다. 아래 모달에서 기존 내용과 비교한 뒤 적용 여부를 선택해주세요.`,
                  isGenerating: false,
                }
              : msg
          )
        );
      } else {
        throw new Error(jobResult.error || "작업 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`[${action}] Quick Action Error:`, {
        error,
        errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      });

      // 에러 메시지를 더 자세히 표시
      const detailedErrorMessage = `[${action}] 작업 실패\n\n오류 내용:\n${errorMessage}\n\n문제가 계속되면 브라우저 콘솔(F12)에서 상세 로그를 확인해주세요.`;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiGeneratingMessage.id
            ? {
                ...msg,
                content: detailedErrorMessage,
                isGenerating: false,
              }
            : msg
        )
      );

      // 사용자에게 alert로도 알림
      alert(`작업 실패: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setCurrentSection(null);
    }
  };

  const handleCloseCompletionModal = () => {
    setIsCompletionModalOpen(false);
    setCompletionMessage("");
  };

  const handleConfirmApply = async () => {
    if (!pendingContent) {
      setIsConfirmModalOpen(false);
      return;
    }

    const actionLabel = pendingActionLabel || "AI";
    const newContent = pendingContent;

    setEditorContent(newContent);
    triggerForceUpdate();

    if (reportId && selectedSubsectionId) {
      try {
        const updateResponse = await fetch(
          `/api/reports/${reportId}/sections/${selectedSubsectionId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: newContent,
            }),
          }
        );

        if (updateResponse.ok) {
          const updateResult = await updateResponse.json();
          if (updateResult.success && updateResult.data) {
            updateCachedSections([updateResult.data]);

            if (pendingMessageId) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === pendingMessageId
                    ? {
                        ...msg,
                        content: `[${actionLabel}] 요청이 완료되어 에디터 및 DB에 저장되었습니다.`,
                        isGenerating: false,
                      }
                    : msg
                )
              );
            }
          } else if (pendingMessageId) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === pendingMessageId
                  ? {
                      ...msg,
                      content: `[${actionLabel}] 요청이 완료되어 에디터에 반영되었으나 DB 저장에 실패했습니다.`,
                      isGenerating: false,
                    }
                  : msg
              )
            );
          }
        } else {
          const errorData = await updateResponse.json().catch(() => ({}));
          const errorMsg = errorData.message || "DB 저장 실패";

          if (pendingMessageId) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === pendingMessageId
                  ? {
                      ...msg,
                      content: `[${actionLabel}] 요청이 완료되어 에디터에 반영되었으나 DB 저장 중 오류가 발생했습니다: ${errorMsg}`,
                      isGenerating: false,
                    }
                  : msg
              )
            );
          }
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "DB 저장 실패";

        if (pendingMessageId) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === pendingMessageId
                ? {
                    ...msg,
                    content: `[${actionLabel}] 요청이 완료되어 에디터에 반영되었으나 DB 저장 중 오류가 발생했습니다: ${errorMsg}`,
                    isGenerating: false,
                  }
                : msg
            )
          );
        }
      }
    } else if (pendingMessageId) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === pendingMessageId
            ? {
                ...msg,
                content: `[${actionLabel}] 요청이 완료되어 에디터에 반영되었습니다. (리포트 정보가 없어 DB에 저장되지 않았습니다)`,
                isGenerating: false,
              }
            : msg
        )
      );
    }

    setCompletionMessage(`[${actionLabel}] 작업이 완료되었습니다.`);
    setIsCompletionModalOpen(true);

    setIsConfirmModalOpen(false);
    setPendingContent(null);
    setOriginalContentBeforeRegenerate(null);
    setPendingActionLabel(null);
    setPendingMessageId(null);
  };

  const handleCancelConfirm = () => {
    const actionLabel = pendingActionLabel || "AI";

    if (pendingMessageId) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === pendingMessageId
            ? {
                ...msg,
                content: `[${actionLabel}] 요청이 취소되었습니다. 기존 내용이 유지됩니다.`,
                isGenerating: false,
              }
            : msg
        )
      );
    }

    setIsConfirmModalOpen(false);
    setPendingContent(null);
    setOriginalContentBeforeRegenerate(null);
    setPendingActionLabel(null);
    setPendingMessageId(null);
  };

  return (
    <>
      <QuickActions
        handleQuickAction={handleQuickAction}
        isLoading={isLoading}
      />

      <RegenerateConfirmModal
        isOpen={isConfirmModalOpen}
        onCancel={handleCancelConfirm}
        onConfirm={handleConfirmApply}
        originalContent={originalContentBeforeRegenerate ?? editorContent}
        newContent={pendingContent ?? ""}
      />

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
