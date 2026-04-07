'use client';

import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import CodeBlock from '@tiptap/extension-code-block';
import { Button } from '@/components/ui/button';
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code2,
  Redo2,
  Undo2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Write your description here...',
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Bold,
      Italic,
      Underline,
      Strike,
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc list-inside',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal list-inside',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-muted p-2 rounded font-mono text-sm',
        },
      }),
    ],
    content: isMounted ? content : '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-60 rounded-2xl border border-border/60 bg-white/50 p-4 leading-relaxed',
      },
    },
  }, [isMounted]);

  if (!isMounted || !editor) {
    return (
      <div className="min-h-60 rounded-2xl border border-border/60 bg-white/50 p-4 text-muted-foreground animate-pulse">
        Loading editor...
      </div>
    );
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();
  const toggleHeading1 = () => editor.chain().focus().toggleHeading({ level: 1 }).run();
  const toggleHeading2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run();
  const toggleHeading3 = () => editor.chain().focus().toggleHeading({ level: 3 }).run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();
  const undo = () => editor.chain().focus().undo().run();
  const redo = () => editor.chain().focus().redo().run();

  const buttonClass = 'h-8 w-8 p-0';

  return (
    <div className="space-y-2">
      <div className="rounded-lg border border-border/40 bg-muted/50 p-2 flex flex-wrap gap-1">
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleBold}
            className={cn(buttonClass, editor.isActive('bold') && 'bg-primary/20 text-primary')}
            title="Bold (Ctrl+B)"
          >
            <BoldIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleItalic}
            className={cn(buttonClass, editor.isActive('italic') && 'bg-primary/20 text-primary')}
            title="Italic (Ctrl+I)"
          >
            <ItalicIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleUnderline}
            className={cn(buttonClass, editor.isActive('underline') && 'bg-primary/20 text-primary')}
            title="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleStrike}
            className={cn(buttonClass, editor.isActive('strike') && 'bg-primary/20 text-primary')}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-6 border-l border-border/60" />

        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleHeading1}
            className={cn(buttonClass, editor.isActive('heading', { level: 1 }) && 'bg-primary/20 text-primary')}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleHeading2}
            className={cn(buttonClass, editor.isActive('heading', { level: 2 }) && 'bg-primary/20 text-primary')}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleHeading3}
            className={cn(buttonClass, editor.isActive('heading', { level: 3 }) && 'bg-primary/20 text-primary')}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-6 border-l border-border/60" />

        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleBulletList}
            className={cn(buttonClass, editor.isActive('bulletList') && 'bg-primary/20 text-primary')}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleOrderedList}
            className={cn(buttonClass, editor.isActive('orderedList') && 'bg-primary/20 text-primary')}
            title="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleCodeBlock}
            className={cn(buttonClass, editor.isActive('codeBlock') && 'bg-primary/20 text-primary')}
            title="Code Block"
          >
            <Code2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-6 border-l border-border/60" />

        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={undo}
            className={buttonClass}
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={redo}
            className={buttonClass}
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <EditorContent editor={editor} suppressHydrationWarning />
    </div>
  );
}
