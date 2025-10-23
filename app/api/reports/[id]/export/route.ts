import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell } from "docx";

interface ReportSection {
  query: string;
  content: string;
  section_id: string;
  section_name: string;
  subsection_id: string;
  subsection_name: string;
  is_completed?: boolean;
  character_count?: number;
}

function parseHtmlToDocxElements(html: string): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  // table 태그 분리
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  const parts = html.split(tableRegex);

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      // 일반 텍스트 부분
      const textPart = parts[i];
      if (textPart.trim()) {
        const lines = textPart.split(/<\/?p>|<\/?div>|<br\s*\/?>/gi);
        lines.forEach((line) => {
          const cleanedLine = line
            .replace(/<[^>]*>/g, "")
            .replace(/&nbsp;/g, " ")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&")
            .trim();

          if (cleanedLine) {
            if (line.includes("<h1") || line.includes("<h2") || line.includes("<h3")) {
              const level = line.includes("<h1")
                ? HeadingLevel.HEADING_1
                : line.includes("<h2")
                  ? HeadingLevel.HEADING_2
                  : HeadingLevel.HEADING_3;
              elements.push(
                new Paragraph({
                  text: cleanedLine,
                  heading: level,
                })
              );
            } else {
              elements.push(
                new Paragraph({
                  text: cleanedLine,
                })
              );
            }
          }
        });
      }
    } else {
      // table 부분
      const tableHtml = parts[i];
      const table = parseHtmlTableToDocxTable(tableHtml);
      if (table) {
        elements.push(table);
      }
    }
  }

  return elements;
}

function parseHtmlTableToDocxTable(tableHtml: string): Table | null {
  // tr 태그 추출
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const rows: string[] = [];
  let match;

  while ((match = rowRegex.exec(tableHtml)) !== null) {
    rows.push(match[1]);
  }

  if (rows.length === 0) return null;

  // 각 행의 셀 추출
  const tableRows = rows.map((rowHtml) => {
    const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
    const cells: string[] = [];
    let cellMatch;

    while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
      cells.push(cellMatch[1]);
    }

    return new TableRow({
      children: cells.map(
        (cellContent) =>
          new TableCell({
            children: [
              new Paragraph({
                text: cellContent
                  .replace(/<[^>]*>/g, "")
                  .replace(/&nbsp;/g, " ")
                  .replace(/&lt;/g, "<")
                  .replace(/&gt;/g, ">")
                  .replace(/&amp;/g, "&")
                  .trim(),
              }),
            ],
          })
      ),
    });
  });

  return new Table({
    rows: tableRows,
    width: {
      size: 100,
      type: "pct",
    },
  });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id } = params;

  try {
    const supabase = await createClient();

    // report_sections 테이블에서 해당 리포트의 모든 섹션 가져오기
    const { data: sections } = await supabase
      .from("report_sections")
      .select("*")
      .eq("report_uuid", id)
      .order("generation_order", { ascending: true });

    // report_create 테이블에서 리포트 제목 가져오기
    const { data: reportData } = await supabase
      .from("report_create")
      .select("title, created_at")
      .eq("uuid", id)
      .single();

    // Word 문서 생성
    const docElements: (Paragraph | Table)[] = [];

    // 제목 추가
    if (reportData?.title) {
      docElements.push(
        new Paragraph({
          text: reportData.title,
          heading: HeadingLevel.HEADING_1,
        })
      );
    }

    // 생성 날짜 추가
    if (reportData?.created_at) {
      const createdDate = new Date(reportData.created_at).toLocaleDateString(
        "ko-KR"
      );
      docElements.push(
        new Paragraph({
          text: `생성일: ${createdDate}`,
        })
      );
    }

    // 빈 줄 추가
    docElements.push(new Paragraph({ text: "" }));

    // 섹션별 내용 추가
    if (sections && sections.length > 0) {
      sections.forEach((section: ReportSection) => {
        // 섹션 제목 추가
        if (section.section_name) {
          docElements.push(
            new Paragraph({
              text: section.section_name,
              heading: HeadingLevel.HEADING_2,
            })
          );
        }

        // 서브섹션 제목 추가
        if (section.subsection_name) {
          docElements.push(
            new Paragraph({
              text: section.subsection_name,
              heading: HeadingLevel.HEADING_3,
            })
          );
        }

        // 콘텐츠 추가
        if (section.content) {
          const contentParagraphs = parseHtmlToDocxElements(section.content);
          docElements.push(...contentParagraphs);
        }

        // 섹션 간 빈 줄 추가
        docElements.push(new Paragraph({ text: "" }));
      });
    }

    // Word 문서 생성
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: docElements,
        },
      ],
    });

    // 문서를 Buffer로 변환
    const buffer = await Packer.toBuffer(doc);

    // 파일명 설정
    const fileName = `${reportData?.title || "report"}_${new Date().getTime()}.docx`;

    // 응답 반환
    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Word 파일 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
