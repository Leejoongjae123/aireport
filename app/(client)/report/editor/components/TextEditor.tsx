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
  ListIcon,
} from "lucide-react";
import { LinkInsertModal } from "./link-insert-modal";
import { ImageInsertModal } from "./image-insert-modal";
import { useEditorStore } from "../store/editor-store";
import { useLoadingOverlay } from "@/components/hooks/use-loading-overlay";

interface TextEditorProps {
  content?: string;
  onUpdate?: (content: string) => void;
}

export const defaultContent = "";

export function TextEditor({ content, onUpdate }: TextEditorProps) {
  const { editorContent, isLoading, currentSection, selectedSubsectionId, forceUpdate } = useEditorStore();
  const [isHeadingMenuOpen, setIsHeadingMenuOpen] = useState(false);
  const [isBulletMenuOpen, setIsBulletMenuOpen] = useState(false);
  const [isAlignMenuOpen, setIsAlignMenuOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [, setEditorState] = useState(0);
  const headingMenuRef = useRef<HTMLDivElement>(null);
  const bulletMenuRef = useRef<HTMLDivElement>(null);
  const alignMenuRef = useRef<HTMLDivElement>(null);
  const [userModified, setUserModified] = useState(false); // 사용자가 수정했는지 추적
  const previousSubsectionIdRef = useRef<string | null>(null); // 이전 subsection ID 추적

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
    content: content || defaultContent,
    editable: !isLoading,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[500px]",
      },
    },
    onUpdate: ({ editor }) => {
      // 사용자가 수정했음을 표시
      setUserModified(true);
      if (onUpdate) {
        onUpdate(editor.getHTML());
      }
    },
    onSelectionUpdate: () => {
      setEditorState((prev) => prev + 1);
    },
  });

  const loadingOverlay = useLoadingOverlay({
    isLoading: isLoading || !editor || editor.isEmpty,
    currentSection,
  });

  // subsection 변경 감지 및 userModified 플래그 리셋
  useEffect(() => {
    if (selectedSubsectionId !== previousSubsectionIdRef.current) {
      // subsection이 변경되면 userModified 플래그 리셋
      setUserModified(false);
      previousSubsectionIdRef.current = selectedSubsectionId;
    }
  }, [selectedSubsectionId]);

  // forceUpdate가 변경되면 userModified 플래그 리셋
  useEffect(() => {
    if (forceUpdate > 0) {
      setUserModified(false);
    }
  }, [forceUpdate]);

  // content prop 또는 zustand editorContent가 변경될 때 에디터 내용 업데이트
  useEffect(() => {
    if (!editor) return;

    // zustand의 editorContent가 우선순위
    const newContent = editorContent || content;

    // 사용자가 수정한 경우, 같은 subsection이면 업데이트하지 않음
    if (userModified && selectedSubsectionId === previousSubsectionIdRef.current) {
      return;
    }

    if (newContent !== undefined && newContent !== editor.getHTML()) {
      editor.commands.setContent(newContent || "");
    }
  }, [editor, content, editorContent, userModified, selectedSubsectionId]);

  // isLoading 상태에 따라 에디터 편집 가능 여부 업데이트
  useEffect(() => {
    if (editor) {
      editor.setEditable(!isLoading);
    }
  }, [editor, isLoading]);

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
      <div className="flex flex-col h-full relative">
        {loadingOverlay}
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
        <div className="flex-1 overflow-y-auto px-8 py-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
          <EditorContent editor={editor} />
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
