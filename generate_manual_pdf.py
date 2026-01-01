"""
관리자 매뉴얼을 이미지가 포함된 PDF로 변환하는 스크립트
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pathlib import Path
import re

def convert_markdown_to_pdf():
    # 파일 경로 설정
    base_dir = Path(__file__).parent
    md_file = base_dir / "admin_user_manual.md"
    output_pdf = base_dir / "admin_user_manual.pdf"
    assets_dir = base_dir / "admin_manual_assets"
    
    # 한글 폰트 등록 (맑은 고딕)
    try:
        font_path = "C:/Windows/Fonts/malgun.ttf"
        pdfmetrics.registerFont(TTFont('MalgunGothic', font_path))
        font_name = 'MalgunGothic'
    except:
        print("맑은 고딕 폰트를 찾을 수 없습니다. 기본 폰트를 사용합니다.")
        font_name = 'Helvetica'
    
    # PDF 문서 생성
    doc = SimpleDocTemplate(str(output_pdf), pagesize=A4,
                           rightMargin=72, leftMargin=72,
                           topMargin=72, bottomMargin=18)
    
    # 스타일 설정
    styles = getSampleStyleSheet()
    
    # 커스텀 스타일 생성
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontName=font_name,
        fontSize=24,
        textColor='#2c3e50',
        spaceAfter=30,
        alignment=TA_LEFT
    )
    
    heading2_style = ParagraphStyle(
        'CustomHeading2',
        parent=styles['Heading2'],
        fontName=font_name,
        fontSize=18,
        textColor='#34495e',
        spaceAfter=12,
        spaceBefore=20
    )
    
    heading3_style = ParagraphStyle(
        'CustomHeading3',
        parent=styles['Heading3'],
        fontName=font_name,
        fontSize=14,
        textColor='#7f8c8d',
        spaceAfter=10,
        spaceBefore=15
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontName=font_name,
        fontSize=11,
        leading=16,
        spaceAfter=12
    )
    
    bullet_style = ParagraphStyle(
        'CustomBullet',
        parent=styles['BodyText'],
        fontName=font_name,
        fontSize=11,
        leading=16,
        leftIndent=20,
        spaceAfter=6
    )
    
    # Markdown 파일 읽기
    with open(md_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # PDF 요소 리스트
    story = []
    
    # 줄별로 처리
    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        
        # 제목 처리
        if line.startswith('# '):
            text = line[2:].strip()
            story.append(Paragraph(text, title_style))
            story.append(Spacer(1, 12))
        
        # 부제목 처리
        elif line.startswith('## '):
            text = line[3:].strip()
            story.append(Paragraph(text, heading2_style))
            story.append(Spacer(1, 6))
        
        # 소제목 처리
        elif line.startswith('### '):
            text = line[4:].strip()
            story.append(Paragraph(text, heading3_style))
            story.append(Spacer(1, 6))
        
        # 이미지 처리
        elif line.startswith('!['):
            match = re.search(r'!\[.*?\]\((.*?)\)', line)
            if match:
                image_path = match.group(1)
                print(f"이미지 발견: {image_path}")
                
                # 경로 처리
                if image_path.startswith('./'):
                    image_path = image_path[2:]
                
                # admin_manual_assets가 이미 경로에 포함되어 있으면 base_dir 사용
                if image_path.startswith('admin_manual_assets'):
                    full_path = base_dir / image_path
                else:
                    full_path = assets_dir / image_path
                
                print(f"전체 경로: {full_path}")
                print(f"파일 존재 여부: {full_path.exists()}")
                
                if full_path.exists():
                    try:
                        img = Image(str(full_path))
                        # 이미지 크기 조정 (페이지 너비에 맞춤)
                        img_width = 6.5 * inch
                        aspect = img.imageHeight / img.imageWidth
                        img.drawHeight = img_width * aspect
                        img.drawWidth = img_width
                        
                        story.append(Spacer(1, 12))
                        story.append(img)
                        story.append(Spacer(1, 12))
                        print(f"✓ 이미지 추가 완료: {full_path.name}")
                    except Exception as e:
                        print(f"✗ 이미지 로드 실패: {full_path} - {e}")
                else:
                    print(f"✗ 파일을 찾을 수 없음: {full_path}")
        
        # 불릿 포인트 처리
        elif line.startswith('- '):
            text = line[2:].strip()
            # 코드 블록 처리
            text = re.sub(r'`([^`]+)`', r'<font name="Courier"><b>\1</b></font>', text)
            # 볼드 처리
            text = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', text)
            story.append(Paragraph(f"• {text}", bullet_style))
        
        # 일반 텍스트 처리
        elif line.strip() and not line.startswith('---'):
            text = line.strip()
            # 코드 블록 처리
            text = re.sub(r'`([^`]+)`', r'<font name="Courier"><b>\1</b></font>', text)
            # 볼드 처리
            text = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', text)
            story.append(Paragraph(text, body_style))
        
        # 빈 줄
        elif not line.strip():
            story.append(Spacer(1, 6))
        
        i += 1
    
    # PDF 생성
    doc.build(story)
    print(f"PDF 생성 완료: {output_pdf}")

if __name__ == "__main__":
    convert_markdown_to_pdf()
