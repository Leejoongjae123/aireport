/**
 * HTML 콘텐츠에서 base64 이미지를 찾아 Supabase Storage에 업로드하고 URL로 교체
 */
export async function uploadBase64ImagesInHtml(
  htmlContent: string,
  reportId: string
): Promise<string> {
  // base64 이미지 패턴 찾기
  const imgRegex = /<img[^>]+src="(data:image\/[^;]+;base64,[^"]+)"[^>]*>/g;
  const matches = Array.from(htmlContent.matchAll(imgRegex));

  if (matches.length === 0) {
    return htmlContent;
  }

  let updatedHtml = htmlContent;

  // 각 base64 이미지를 순차적으로 업로드
  for (const match of matches) {
    const base64Src = match[1];

    try {
      // 이미지 업로드 API 호출
      const response = await fetch("/api/reports/upload-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId,
          imageData: base64Src,
          fileName: `image_${Date.now()}`,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // base64 URL을 실제 URL로 교체
        updatedHtml = updatedHtml.replace(base64Src, result.url);
      }
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      // 업로드 실패 시 해당 이미지는 그대로 유지
    }
  }

  return updatedHtml;
}

/**
 * HTML에 base64 이미지가 포함되어 있는지 확인
 */
export function hasBase64Images(htmlContent: string): boolean {
  const imgRegex = /<img[^>]+src="data:image\/[^;]+;base64,[^"]+"/;
  return imgRegex.test(htmlContent);
}
