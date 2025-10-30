import { NextRequest, NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow } from 'docx';
import * as cheerio from 'cheerio';

export interface DownloadWordRequest {
  html: string;
  title: string;
}

export async function POST(request: NextRequest) {
  try {
    const { html, title }: DownloadWordRequest = await request.json();

    if (!html || !title) {
      return NextResponse.json({ error: 'HTML과 title이 필요합니다.' }, { status: 400 });
    }

    // HTML 파싱 - body 태그로 감싸기
    const fullHtml = `<html><body>${html}</body></html>`;
    const $ = cheerio.load(fullHtml);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const children: any[] = [];

    // HTML 요소들을 순회하며 docx 요소 생성
    $('body *').each((i, elem) => {
      const tagName = elem.tagName.toLowerCase();

      if (tagName === 'h1') {
        children.push(new Paragraph({
          children: [new TextRun({ text: $(elem).text(), bold: true, size: 32 })],
        }));
      } else if (tagName === 'h2') {
        children.push(new Paragraph({
          children: [new TextRun({ text: $(elem).text(), bold: true, size: 28 })],
        }));
      } else if (tagName === 'h3') {
        children.push(new Paragraph({
          children: [new TextRun({ text: $(elem).text(), bold: true, size: 24 })],
        }));
      } else if (tagName === 'p') {
        children.push(new Paragraph({
          children: [new TextRun($(elem).text())],
        }));
      } else if (tagName === 'table') {
        // 표 처리
        const rows: TableRow[] = [];
        $(elem).find('tr').each((rowIndex, rowElem) => {
          const cells: TableCell[] = [];
          $(rowElem).find('td, th').each((cellIndex, cellElem) => {
            cells.push(new TableCell({
              children: [new Paragraph($(cellElem).text())],
            }));
          });
          rows.push(new TableRow({ children: cells }));
        });
        if (rows.length > 0) {
          children.push(new Table({ rows }));
        }
      } else if (tagName === 'ul') {
        $(elem).find('li').each((liIndex, liElem) => {
          children.push(new Paragraph({
            children: [new TextRun(`• ${$(liElem).text()}`)],
          }));
        });
      } else if (tagName === 'ol') {
        $(elem).find('li').each((liIndex, liElem) => {
          children.push(new Paragraph({
            children: [new TextRun(`${liIndex + 1}. ${$(liElem).text()}`)],
          }));
        });
      } else {
        // 기타 요소는 텍스트로
        const text = $(elem).text().trim();
        if (text) {
          children.push(new Paragraph({
            children: [new TextRun(text)],
          }));
        }
      }
    });

    // 문서 생성
    const doc = new Document({
      sections: [{
        properties: {},
        children,
      }],
    });

    // 버퍼 생성
    const buffer = await Packer.toBuffer(doc);

    // filename 안전하게 인코딩
    const safeFilename = encodeURIComponent(title).replace(/['()]/g, escape).replace(/\*/g, '%2A') + '.docx';

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename*=UTF-8''${safeFilename}`,
      },
    });
  } catch (error) {
    console.log('Word 생성 오류:', error);
    return NextResponse.json({ error: 'Word 파일 생성에 실패했습니다.' }, { status: 500 });
  }
}
