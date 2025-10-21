# Diagnosis API 사용 가이드

## 개요
- **설명**: `/diagnosis` 엔드포인트는 입력 텍스트를 OpenAI `gpt-5` 모델로 평가하여 항목별 점수를 산출합니다.
- **인증**: 샘플은 Bearer 토큰을 가정하며, 실제 운영 정책에 맞춰 헤더를 구성합니다.

## 엔드포인트
- **메서드**: `POST`
- **URL**: `/diagnosis`
- **Content-Type**: `application/json`

## 요청 구조
- **input** *(array, required)*: 최소 1개의 `RequestItem`이 포함되어야 합니다.
- **evaluation** *(array, optional)*: 사용자 정의 평가 기준. 미제공 시 서버 기본값(`DEFAULT_EVALUATION_CRITERIA`)을 사용합니다.

### RequestItem 구조
- **query** *(string, optional)*: `contents`가 없을 때 사용할 대체 질의 문장.
- **contents** *(string, optional)*: 평가 대상 원문 텍스트. `query` 또는 `contents` 중 하나 이상 필수.

```json
{
  "input": [
    {
      "contents": "평가 대상 텍스트를 입력합니다.",
      "query": null
    },
    {
      "query": "보충 설명 또는 질의",
      "contents": null
    }
  ],
  "evaluation": [
    {
      "id": 1,
      "카테고리": "기술성",
      "평가항목": [
        { "id": 1, "내용": "핵심 기술의 독창성 및 차별성" },
        { "id": 2, "내용": "기술 성숙도(TRL) 및 적용 가능성" }
      ]
    }
  ]
}
```

### 기본 평가 기준 사용 시 응답
`evaluation`을 생략하면 `diagnosis.py`의 `DEFAULT_EVALUATION_CRITERIA`가 적용되어 기술성, 사업성, 공공성·정책 부합성, 성과·기대효과, 추진체계 및 역량 5개 카테고리가 평가됩니다.

## 응답 구조
- **categories** *(array, required)*: 카테고리별 평가 결과.
- **categories[].id** *(integer)*: 카테고리 식별자.
- **categories[].name** *(string)*: 카테고리 이름.
- **categories[].items** *(array)*: 항목별 평가 결과 목록.
- **categories[].items[].id** *(integer)*: 항목 식별자.
- **categories[].items[].title** *(string)*: 항목 이름.
- **categories[].items[].score** *(integer, 1~100)*: 산출된 점수.

```json
{
  "categories": [
    {
      "id": 1,
      "name": "기술성",
      "items": [
        {
          "id": 1,
          "title": "핵심 기술의 독창성 및 차별성",
          "score": 82
        },
        {
          "id": 2,
          "title": "기술 성숙도(TRL) 및 적용 가능성",
          "score": 77
        }
      ]
    }
  ]
}
```

## 오류 응답
- **400**: 모든 `RequestItem`에서 `query`와 `contents`가 모두 비어 있는 경우.
- **500**: `OPENAI_API_KEY` 미설정 등 서버 환경 변수 문제.
- **502**: OpenAI 응답 파싱 실패 등 외부 모델 응답 이상.

## 호출 예시

### cURL
```bash
curl -X POST "https://<your-domain>/diagnosis" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "input": [
      { "contents": "...평가 대상 텍스트..." }
    ]
  }'
```

### JavaScript (fetch)
```ts
type DiagnosisRequest = {
  input: Array<{ contents?: string | null; query?: string | null }>;
  evaluation?: Array<unknown>;
};

export async function requestDiagnosis(body: DiagnosisRequest) {
  const response = await fetch("https://<your-domain>/diagnosis", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    return { ok: false, status: response.status, detail };
  }

  return { ok: true, data: await response.json() };
}
```
