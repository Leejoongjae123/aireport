"use client";

import React, { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import ResizableImageExtension from "tiptap-extension-resize-image";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Edit,
  ListIcon,
} from "lucide-react";
import { LinkInsertModal } from "./link-insert-modal";
import { ImageInsertModal } from "./image-insert-modal";

interface TextEditorProps {
  content?: string;
  onUpdate?: (content: string) => void;
}

export function TextEditor({ content, onUpdate }: TextEditorProps) {
  const [isHeadingMenuOpen, setIsHeadingMenuOpen] = useState(false);
  const [isBulletMenuOpen, setIsBulletMenuOpen] = useState(false);
  const [isAlignMenuOpen, setIsAlignMenuOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [, setEditorState] = useState(0);
  const headingMenuRef = useRef<HTMLDivElement>(null);
  const bulletMenuRef = useRef<HTMLDivElement>(null);
  const alignMenuRef = useRef<HTMLDivElement>(null);

  // 드롭다운 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headingMenuRef.current &&
        !headingMenuRef.current.contains(event.target as Node)
      ) {
        setIsHeadingMenuOpen(false);
      }
      if (
        bulletMenuRef.current &&
        !bulletMenuRef.current.contains(event.target as Node)
      ) {
        setIsBulletMenuOpen(false);
      }
      if (
        alignMenuRef.current &&
        !alignMenuRef.current.contains(event.target as Node)
      ) {
        setIsAlignMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer",
        },
      }),
      ResizableImageExtension.configure({
        inline: false,
        HTMLAttributes: {
          class: "rounded",
        },
      }),
    ],
    content:
      content ||
      `
      <div style="text-align: center;">
        <h1 style="font-weight: 700; font-size: 32px; line-height: 44px; letter-spacing: -0.64px; color: #303030;">AI 기반 리테일 수요예측 솔루션 사업계획서</h1>
      </div>
      <div style="text-align: right; font-weight: 600; font-size: 16px; color: black;">2025년 9월 9일</div>
      
      <h2 style="font-weight: 600; font-size: 20px; color: black;">1. 사업 개요</h2>
      <h3 style="font-weight: 600; font-size: 16px; color: black;">1.1 추진 배경 및 필요성</h3>
      
      <p style="font-size: 16px; line-height: 24px; color: #343330;">리테일 산업은 디지털 전환과 함께 데이터 기반 경영이 필수 요소로 자리잡고 있습니다. 온라인·오프라인 채널의 융합, 소비자 구매 패턴의 다변화, 경기 변동성 확대 등으로 인해 재고 관리, 공급망 최적화, 판촉 전략 수립의 복잡성이 과거보다 크게 증가하였습니다.</p>
      
      <p style="font-size: 16px; line-height: 24px; color: #343330;">특히,</p>
      <ul>
        <li>수요 예측의 불확실성으로 인한 과잉 재고 및 품절 리스크 발생</li>
        <li>단기 프로모션 및 마케팅 효과 측정의 어려움</li>
        <li>소비자 데이터 활용의 한계로 맞춤형 전략 수립이 미흡</li>
      </ul>
      <p style="font-size: 16px; line-height: 24px; color: #343330;">이라는 문제점들이 리테일 기업의 수익성 및 경쟁력 약화로 이어지고 있습니다.</p>
      
      <p style="font-size: 16px; line-height: 24px; color: #343330;">이러한 환경 속에서, AI 기반 수요예측 솔루션은 대규모 거래 데이터와 외부 요인(계절성, 지역별 트렌드, 거시경제 지표 등)을 결합하여 정교한 수요 예측 모델을 제공함으로써, 리테일 기업이 직면한 문제를 근본적으로 해결할 수 있습니다.</p>
      
      <p style="font-size: 16px; line-height: 24px; color: #343330;">이를 통해 기업은:</p>
      <ul>
        <li>재고 관리 최적화 – 과잉재고 및 품절을 최소화하여 비용 절감 및 매출 기회 극대화</li>
        <li>공급망 효율화 – 유통 단계별 수요 변동을 사전에 예측하여 운영 효율성 제고</li>
        <li>맞춤형 마케팅 강화 – 고객 세그먼트별 구매 패턴 분석을 기반으로 한 타겟 마케팅 전략 수립</li>
        <li>경쟁력 확보 – 급변하는 리테일 시장에서 차별화된 데이터 기반 의사결정 역량 확보</li>
      </ul>
      
      <p style="font-size: 16px; line-height: 24px; color: #343330;">따라서, 본 사업은 리테일 산업의 디지털 경쟁력 강화와 지속 가능한 성장 기반 마련을 위해 추진이 필요하며, 향후 관련 산업 전반에 걸쳐 확장성과 파급 효과가 기대됩니다.</p>
    `,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[500px]",
      },
    },
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getHTML());
      }
    },
    onSelectionUpdate: () => {
      setEditorState((prev) => prev + 1);
    },
  });

  if (!editor) {
    return null;
  }

  const handleLinkInsert = (url: string, text?: string) => {
    if (text) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${url}">${text}</a>`)
        .run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleImageInsert = (src: string, alt?: string) => {
    editor
      .chain()
      .focus()
      .setImage({ src, alt: alt || "" })
      .run();
  };

  const openLinkModal = () => {
    setIsLinkModalOpen(true);
  };

  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  const setHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    editor.chain().focus().toggleHeading({ level }).run();
    setIsHeadingMenuOpen(false);
  };

  const setParagraph = () => {
    editor.chain().focus().setParagraph().run();
    setIsHeadingMenuOpen(false);
  };

  const getCurrentHeadingLevel = (): string => {
    if (editor.isActive("heading", { level: 1 })) {
      return "Heading 1";
    }
    if (editor.isActive("heading", { level: 2 })) {
      return "Heading 2";
    }
    if (editor.isActive("heading", { level: 3 })) {
      return "Heading 3";
    }
    if (editor.isActive("heading", { level: 4 })) {
      return "Heading 4";
    }
    if (editor.isActive("heading", { level: 5 })) {
      return "Heading 5";
    }
    if (editor.isActive("heading", { level: 6 })) {
      return "Heading 6";
    }
    return "Paragraph";
  };

  const getCurrentBulletType = (): { label: string; icon: React.ReactNode } => {
    if (editor.isActive("bulletList")) {
      return { label: "글머리 기호", icon: <List className="w-4 h-4" /> };
    }
    if (editor.isActive("orderedList")) {
      return {
        label: "번호 매기기",
        icon: <ListOrdered className="w-4 h-4" />,
      };
    }
    return { label: "목록", icon: <ListIcon className="w-4 h-4" /> };
  };

  const getCurrentAlignType = (): { label: string; icon: React.ReactNode } => {
    if (editor.isActive({ textAlign: "left" })) {
      return { label: "왼쪽 정렬", icon: <AlignLeft className="w-4 h-4" /> };
    }
    if (editor.isActive({ textAlign: "center" })) {
      return {
        label: "가운데 정렬",
        icon: <AlignCenter className="w-4 h-4" />,
      };
    }
    if (editor.isActive({ textAlign: "right" })) {
      return { label: "오른쪽 정렬", icon: <AlignRight className="w-4 h-4" /> };
    }
    if (editor.isActive({ textAlign: "justify" })) {
      return { label: "양쪽 정렬", icon: <AlignJustify className="w-4 h-4" /> };
    }
    return { label: "정렬", icon: <AlignLeft className="w-4 h-4" /> };
  };

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Rich Text Editor Toolbar */}
        <div className="px-8 pt-5 flex-shrink-0">
          <div className="flex flex-col gap-2.5 border-b border-[#D9D9D9] pb-2">
            <div className="flex justify-start items-center gap-2">
              {/* Text Style */}
              <div
                className="flex items-center gap-4 relative"
                ref={headingMenuRef}
              >
                <button
                  onClick={() => setIsHeadingMenuOpen(!isHeadingMenuOpen)}
                  className="text-[#232325] text-base flex items-center gap-2"
                >
                  {getCurrentHeadingLevel()}
                  <ChevronDown className="w-4 h-4 text-[#232325]" />
                </button>

                {/* Heading Dropdown Menu */}
                {isHeadingMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-[#D9D9D9] rounded shadow-lg z-50 min-w-[150px]">
                    <button
                      onClick={setParagraph}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-base"
                    >
                      Paragraph
                    </button>
                    <button
                      onClick={() => setHeading(1)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-2xl font-bold"
                    >
                      Heading 1
                    </button>
                    <button
                      onClick={() => setHeading(2)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-xl font-bold"
                    >
                      Heading 2
                    </button>
                    <button
                      onClick={() => setHeading(3)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-lg font-bold"
                    >
                      Heading 3
                    </button>
                    <button
                      onClick={() => setHeading(4)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-base font-bold"
                    >
                      Heading 4
                    </button>
                    <button
                      onClick={() => setHeading(5)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-bold"
                    >
                      Heading 5
                    </button>
                    <button
                      onClick={() => setHeading(6)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-xs font-bold"
                    >
                      Heading 6
                    </button>
                  </div>
                )}
              </div>

              <div className="w-px h-8 bg-[#E0E2E7]" />

              {/* Format Options */}
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`text-[#232325] font-bold ${
                    editor.isActive("bold") ? "bg-gray-200" : ""
                  }`}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                >
                  B
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`text-[#232325] italic ${
                    editor.isActive("italic") ? "bg-gray-200" : ""
                  }`}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                  I
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`text-[#232325] underline ${
                    editor.isActive("underline") ? "bg-gray-200" : ""
                  }`}
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                  U
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`text-[#232325] line-through ${
                    editor.isActive("strike") ? "bg-gray-200" : ""
                  }`}
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                  S
                </Button>

                {/* Bullet List Dropdown */}
                <div className="relative" ref={bulletMenuRef}>
                  <button
                    onClick={() => setIsBulletMenuOpen(!isBulletMenuOpen)}
                    className="flex items-center gap-1 p-1 hover:bg-gray-100 rounded"
                  >
                    {getCurrentBulletType().icon}
                    <ChevronDown className="w-3 h-3 text-[#232325]" />
                  </button>

                  {isBulletMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-[#D9D9D9] rounded shadow-lg z-50 min-w-[150px]">
                      <button
                        onClick={() => {
                          editor.chain().focus().toggleBulletList().run();
                          setIsBulletMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <List className="w-4 h-4" />
                        <span>글머리 기호</span>
                      </button>
                      <button
                        onClick={() => {
                          editor.chain().focus().toggleOrderedList().run();
                          setIsBulletMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <ListOrdered className="w-4 h-4" />
                        <span>번호 매기기</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Text Align Dropdown */}
                <div className="relative" ref={alignMenuRef}>
                  <button
                    onClick={() => setIsAlignMenuOpen(!isAlignMenuOpen)}
                    className="flex items-center gap-1 p-1 hover:bg-gray-100 rounded"
                  >
                    {getCurrentAlignType().icon}
                    <ChevronDown className="w-3 h-3 text-[#232325]" />
                  </button>

                  {isAlignMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-[#D9D9D9] rounded shadow-lg z-50 min-w-[150px]">
                      <button
                        onClick={() => {
                          editor.chain().focus().setTextAlign("left").run();
                          setIsAlignMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <AlignLeft className="w-4 h-4" />
                        <span>왼쪽 정렬</span>
                      </button>
                      <button
                        onClick={() => {
                          editor.chain().focus().setTextAlign("center").run();
                          setIsAlignMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <AlignCenter className="w-4 h-4" />
                        <span>가운데 정렬</span>
                      </button>
                      <button
                        onClick={() => {
                          editor.chain().focus().setTextAlign("right").run();
                          setIsAlignMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <AlignRight className="w-4 h-4" />
                        <span>오른쪽 정렬</span>
                      </button>
                      <button
                        onClick={() => {
                          editor.chain().focus().setTextAlign("justify").run();
                          setIsAlignMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <AlignJustify className="w-4 h-4" />
                        <span>양쪽 정렬</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-px h-8 bg-[#E0E2E7]" />

              {/* Attachments */}
              <div className="flex justify-center items-center gap-2">
                <button onClick={openLinkModal} className="p-1">
                  <LinkIcon className="w-5 h-5 text-[#232325]" />
                </button>
                <button onClick={openImageModal} className="p-1">
                  <ImageIcon className="w-5 h-5 text-[#232325]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-y-auto px-11 py-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
          <EditorContent editor={editor} />

          <Button
            variant="outline"
            className="w-fit ml-auto mt-9 gap-1 h-9 px-3.5 border-[#D9D9D9] flex"
          >
            <Edit className="w-6 h-6 text-[#5A5A5A]" />
            <span className="text-[#5A5A5A] font-semibold text-sm">
              수정 요청하기
            </span>
          </Button>
        </div>
      </div>

      {/* Modals */}
      <LinkInsertModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onInsert={handleLinkInsert}
        defaultText={
          editor.state.selection.empty
            ? ""
            : editor.state.doc.textBetween(
                editor.state.selection.from,
                editor.state.selection.to
              )
        }
      />
      <ImageInsertModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onInsert={handleImageInsert}
      />
    </>
  );
}
