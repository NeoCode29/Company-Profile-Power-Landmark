'use client'

import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import Heading from '@tiptap/extension-heading'
import { Toggle } from '@/components/ui/toggle'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  Heading1,
  Heading2
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  height?: string
  width?: string
  placeholder?: string
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  height = '300px',
  width = '100%',
  placeholder = 'Start typing...'
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable the default bullet list and heading to use our custom ones
        bulletList: false,
        heading: false,
      }),
      Underline,
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc pl-6',
        },
      }),
      ListItem,
      Heading.configure({
        levels: [1, 2],
        HTMLAttributes: {
          class: 'font-bold',
        },
      }),
    ],
    content: value || '<p></p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none p-4',
        style: `height: ${height}; min-height: 150px;`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '<p></p>')
    }
  }, [editor, value])

  if (!editor) {
    return null
  }

  const toggleHeading = (level: 1 | 2) => {
    editor.chain().focus().toggleHeading({ level }).run()
  }

  return (
    <div 
      className="border rounded-md overflow-hidden" 
      style={{ width }}
    >
      <div className="flex flex-wrap gap-1 p-1 border-b bg-gray-50">
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive('underline')}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => {
            editor.chain().focus().toggleBulletList().run()
          }}
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 1 })}
          onPressedChange={() => toggleHeading(1)}
          aria-label="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 2 })}
          onPressedChange={() => toggleHeading(2)}
          aria-label="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
      </div>

      <div 
        style={{ height }}
        className="overflow-auto"
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default RichTextEditor 