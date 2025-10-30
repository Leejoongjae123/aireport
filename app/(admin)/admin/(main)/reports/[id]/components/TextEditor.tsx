"use client";

import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import ResizableImageExtension from "tiptap-extension-resize-image";

interface TextEditorProps {
  content?: string;
  onUpdate?: (content: string) => void;
  readOnly?: boolean;
}

export const defaultContent = "";

export function TextEditor({ content, onUpdate, readOnly = false }: TextEditorProps) {
  const [, setEditorState] = useState(0);


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
    editable: !readOnly,
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

  useEffect(() => {
    if (!editor) return;

    if (content !== undefined && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [editor, content]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [editor, readOnly]);

  if (!editor) {
    return null;
  }


  return (
    <div className="flex flex-col h-full relative">

      {/* Document Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
