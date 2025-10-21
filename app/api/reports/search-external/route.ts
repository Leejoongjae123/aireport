import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { action, query } = await req.json();

    // TODO: 실제 외부 API 호출 로직 구현
    console.log(`Searching for ${action} with query: ${query}`);

    // 임시 응답
    const searchResults = [
      {
        title: `${action} 검색 결과 1: ${query}`,
        link: '#',
        snippet: '이것은 검색 결과의 스니펫입니다. 자세한 내용을 보려면 링크를 클릭하세요.',
      },
      {
        title: `${action} 검색 결과 2: ${query}`,
        link: '#',
        snippet: '두 번째 검색 결과입니다. 흥미로운 내용을 담고 있습니다.',
      },
    ];

    return NextResponse.json({ results: searchResults });
  } catch (error) {
    console.error('Error during external search:', error);
    return NextResponse.json(
      { error: '외부 검색 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
