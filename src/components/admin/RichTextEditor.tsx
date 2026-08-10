'use client'

import { useRef } from 'react'
import { Bold, Italic, Underline, List, ListOrdered, Link2 } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  minHeightRem?: number
}

const TOOLBAR = [
  { command: 'bold', label: 'Bold', icon: Bold },
  { command: 'italic', label: 'Italic', icon: Italic },
  { command: 'underline', label: 'Underline', icon: Underline },
  { command: 'insertUnorderedList', label: 'Bullet list', icon: List },
  { command: 'insertOrderedList', label: 'Numbered list', icon: ListOrdered },
] as const

export default function RichTextEditor({ value, onChange, minHeightRem = 6 }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null)

  const emitChange = () => onChange(ref.current?.innerHTML ?? '')

  const runCommand = (command: string) => {
    ref.current?.focus()
    document.execCommand(command, false)
    emitChange()
  }

  const insertLink = () => {
    const url = window.prompt('Link URL')
    if (!url) return
    ref.current?.focus()
    document.execCommand('createLink', false, url)
    emitChange()
  }

  return (
    <div className="rounded-lg border border-border">
      <div className="flex items-center gap-1 border-b border-border bg-cloud px-2 py-1.5">
        {TOOLBAR.map(({ command, label, icon: Icon }) => (
          <button
            key={command}
            type="button"
            aria-label={label}
            title={label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => runCommand(command)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate transition-colors duration-250 hover:bg-white hover:text-connect-blue"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </button>
        ))}
        <button
          type="button"
          aria-label="Insert link"
          title="Insert link"
          onMouseDown={(e) => e.preventDefault()}
          onClick={insertLink}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate transition-colors duration-250 hover:bg-white hover:text-connect-blue"
        >
          <Link2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        style={{ minHeight: `${minHeightRem}rem` }}
        className="px-3 py-2.5 text-small text-ink focus:outline-none [&_a]:text-connect-blue [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  )
}
