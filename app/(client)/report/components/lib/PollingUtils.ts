// 작업 상태 타입 정의
export type JobStatus = "PENDING" | "STARTED" | "PROGRESS" | "SUCCESS" | "FAILURE" | "RETRY";

export interface JobStatusResponse {
  task_id: string;
  status: JobStatus;
  result: {
    result?: "success" | "error";
    contents?: string;
    elapsed_seconds?: number;
    success?: boolean;
    message?: string;
    [key: string]: unknown;
  } | null;
  error: string | null;
  meta: {
    status?: string;
    current?: number;
    total?: number;
    success?: boolean;
    [key: string]: unknown;
  };
}

export interface PollingOptions {
  taskId: string;
  interval?: number; // 폴링 간격 (ms)
  maxAttempts?: number; // 최대 시도 횟수
  onProgress?: (response: JobStatusResponse) => void;
  onSuccess?: (response: JobStatusResponse) => void;
  onError?: (error: string) => void;
}

/**
 * 작업 상태를 폴링하여 완료될 때까지 대기하는 함수
 * @param options 폴링 옵션
 * @returns 최종 작업 상태 응답
 */
export async function pollJobStatus(
  options: PollingOptions
): Promise<JobStatusResponse> {
  const {
    taskId,
    interval = 5000, // 기본 5초
    maxAttempts = 60, // 기본 60회 (총 5분)
    onProgress,
    onSuccess,
    onError,
  } = options;

  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;

    try {
      console.log(`[Polling] 작업 상태 조회 시도 ${attempts}/${maxAttempts}: ${taskId}`);

      const response = await fetch(`/api/jobs/status/${taskId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      const data: JobStatusResponse = await response.json();

      console.log(`[Polling] 작업 상태:`, {
        task_id: data.task_id,
        status: data.status,
        attempts,
      });

      // 진행 중 상태
      if (["PENDING", "STARTED", "PROGRESS", "RETRY"].includes(data.status)) {
        if (onProgress) {
          onProgress(data);
        }

        // 다음 폴링까지 대기
        await new Promise((resolve) => setTimeout(resolve, interval));
        continue;
      }

      // 성공 상태
      if (data.status === "SUCCESS") {
        console.log(`[Polling] 작업 완료:`, data.result);
        if (onSuccess) {
          onSuccess(data);
        }
        return data;
      }

      // 실패 상태
      if (data.status === "FAILURE") {
        const errorMessage = data.error || "작업이 실패했습니다.";
        console.error(`[Polling] 작업 실패:`, errorMessage);
        if (onError) {
          onError(errorMessage);
        }
        throw new Error(errorMessage);
      }

      // 알 수 없는 상태
      console.warn(`[Polling] 알 수 없는 상태: ${data.status}`);
      await new Promise((resolve) => setTimeout(resolve, interval));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "작업 상태 조회 실패";
      console.error(`[Polling] 에러:`, errorMessage);

      // 마지막 시도가 아니면 재시도
      if (attempts < maxAttempts) {
        console.log(`[Polling] ${interval / 1000}초 후 재시도...`);
        await new Promise((resolve) => setTimeout(resolve, interval));
        continue;
      }

      // 최대 시도 횟수 초과
      if (onError) {
        onError(errorMessage);
      }
      throw error;
    }
  }

  // 최대 시도 횟수 초과
  const timeoutMessage = `작업 타임아웃 (최대 ${maxAttempts}회 시도)`;
  console.error(`[Polling] ${timeoutMessage}`);
  if (onError) {
    onError(timeoutMessage);
  }
  throw new Error(timeoutMessage);
}

/**
 * 작업 진행률을 계산하는 헬퍼 함수
 * @param response 작업 상태 응답
 * @returns 진행률 (0-100)
 */
export function calculateProgress(response: JobStatusResponse): number {
  if (response.meta?.current && response.meta?.total) {
    return Math.round((response.meta.current / response.meta.total) * 100);
  }
  return 0;
}

/**
 * 작업 상태를 한글로 변환하는 헬퍼 함수
 * @param status 작업 상태
 * @returns 한글 상태 메시지
 */
export function getStatusMessage(status: JobStatus): string {
  const statusMessages: Record<JobStatus, string> = {
    PENDING: "작업 대기 중...",
    STARTED: "작업 시작됨...",
    PROGRESS: "작업 진행 중...",
    SUCCESS: "작업 완료",
    FAILURE: "작업 실패",
    RETRY: "작업 재시도 중...",
  };

  return statusMessages[status] || "알 수 없는 상태";
}
