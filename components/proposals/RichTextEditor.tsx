"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Enter section content...",
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // Prevent SSR hydration mismatches
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none",
          "focus:outline-none min-h-[300px] p-4",
          "prose-headings:text-neutral-900 dark:prose-headings:text-neutral-100",
          "prose-p:text-neutral-700 dark:prose-p:text-neutral-300",
          "prose-strong:text-neutral-900 dark:prose-strong:text-neutral-100",
          "prose-ul:text-neutral-700 dark:prose-ul:text-neutral-300",
          "prose-ol:text-neutral-700 dark:prose-ol:text-neutral-300",
          "prose-blockquote:text-neutral-600 dark:prose-blockquote:text-neutral-400",
          "prose-blockquote:border-l-primary-500"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when prop changes (e.g., when switching sections)
  useEffect(() => {
    if (!editor) return;
    
    const currentContent = editor.getHTML();
    // Normalize both contents for comparison (handle empty content variations)
    const normalizedCurrent = currentContent.trim() || "<p></p>";
    const normalizedNew = content.trim() || "<p></p>";
    
    // Only update if content actually changed (avoid unnecessary updates)
    if (normalizedCurrent !== normalizedNew) {
      // Use a flag to prevent the onUpdate callback from firing during programmatic updates
      const isExternalUpdate = true;
      editor.commands.setContent(content || "", { 
        emitUpdate: false, // Don't trigger onUpdate to avoid loops
      });
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "border-2 border-neutral-300 dark:border-neutral-700 rounded-lg",
        "bg-white dark:bg-neutral-900",
        "focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent",
        "transition-all duration-200",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 rounded-t-lg">
        {/* Headings */}
        <div className="flex items-center gap-1 pr-2 border-r border-neutral-300 dark:border-neutral-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive("heading", { level: 1 }) &&
                "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
            )}
            aria-label="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive("heading", { level: 2 }) &&
                "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
            )}
            aria-label="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive("heading", { level: 3 }) &&
                "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
            )}
            aria-label="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Text Formatting */}
        <div className="flex items-center gap-1 pr-2 border-r border-neutral-300 dark:border-neutral-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive("bold") &&
                "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
            )}
            aria-label="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive("italic") &&
                "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
            )}
            aria-label="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 pr-2 border-r border-neutral-300 dark:border-neutral-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive("bulletList") &&
                "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
            )}
            aria-label="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive("orderedList") &&
                "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
            )}
            aria-label="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive("blockquote") &&
                "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
            )}
            aria-label="Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="h-8 w-8 p-0"
            aria-label="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="h-8 w-8 p-0"
            aria-label="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="overflow-y-auto max-h-[500px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

