/**
 * Enhanced CodeBlock Component
 * Features syntax highlighting, line numbers, copy button, and language badge
 */

import React, { useState, useEffect } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  vscDarkPlus,
  tomorrow
} from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { motion, AnimatePresence } from 'framer-motion'

export interface CodeBlockProps {
  language?: string
  value: string
  theme?: 'light' | 'dark'
  showLineNumbers?: boolean
  showCopyButton?: boolean
  showHeader?: boolean
  className?: string
  wrapLines?: boolean
  wrapLongLines?: boolean
  customStyle?: React.CSSProperties
  onCopy?: (copied: boolean) => void
}

/**
 * EnhancedCodeBlock - Feature-rich code block component
 *
 * @example
 * <EnhancedCodeBlock
 *   language="typescript"
 *   value="console.log('Hello World')"
 *   showLineNumbers
 *   showCopyButton
 * />
 *
 * <EnhancedCodeBlock
 *   language="javascript"
 *   value={codeString}
 *   theme="dark"
 * />
 */
export function EnhancedCodeBlock({
  language = 'text',
  value,
  theme = 'dark',
  showLineNumbers = true,
  showCopyButton = true,
  showHeader = true,
  className = '',
  wrapLines = false,
  wrapLongLines = true,
  customStyle,
  onCopy
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    if (onCopy) {
      onCopy(true)
    }
    setTimeout(() => {
      setCopied(false)
      if (onCopy) {
        onCopy(false)
      }
    }, 2000)
  }

  const syntaxTheme = theme === 'dark' ? vscDarkPlus : tomorrow

  // Convert language name for SyntaxHighlighter compatibility
  const normalizedLanguage = normalizeLanguage(language)

  // Calculate line numbers
  const lines = value.split('\n')
  const lineCount = lines.length

  // Detect language from content if not provided
  const detectedLanguage = language || detectLanguage(value)

  return (
    <div className={cn('code-block-container my-6', className)}>
      {/* Header */}
      {showHeader && (
        <div className="code-block-header flex items-center justify-between px-4 py-2 bg-gray-900 dark:bg-gray-800 border-b border-gray-700 rounded-t-lg">
          {/* Language badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
              {detectedLanguage}
            </span>

            {/* File icon */}
            <div className="w-4 h-4 text-gray-500">
              <FileCodeIcon />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Line numbers toggle (optional) */}
            {showLineNumbers !== undefined && (
              <label className="flex items-center gap-1.5 text-xs text-gray-400">
                <input
                  type="checkbox"
                  checked={showLineNumbers}
                  readOnly
                  className="rounded"
                />
                #
              </label>
            )}

            {/* Copy button */}
            {showCopyButton && (
              <CopyToClipboard text={value} onCopy={handleCopy}>
                <motion.button
                  className="relative inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-accent"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Copy code to clipboard"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="copied"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-1.5"
                      >
                        <CheckIcon size={14} />
                        <span>Copied!</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-1.5"
                      >
                        <CopyIcon size={14} />
                        <span>Copy</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </CopyToClipboard>
            )}
          </div>
        </div>
      )}

      {/* Code wrapper */}
      <div className="code-block-body relative">
        {/* Line numbers (optional and only if showLineNumbers is true) */}
        {showLineNumbers && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-950 dark:bg-gray-900 select-none pointer-events-none rounded-bl-lg">
            <div className="py-4">
              {lines.map((_, index) => (
                <div
                  key={index}
                  className="h-6 flex items-center justify-center text-xs text-gray-500 font-mono"
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Syntax highlighter */}
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={normalizedLanguage}
            style={syntaxTheme}
            customStyle={{
              margin: 0,
              borderRadius: showHeader ? '0 0 0.5rem 0.5rem' : '0.5rem',
              background: 'transparent',
              padding: showLineNumbers ? '1rem 1rem 1rem 3rem' : '1rem',
              fontSize: '14px',
              lineHeight: '1.5',
              ...(customStyle || {})
            }}
            className={cn(
              'code-block-syntax',
              wrapLongLines && 'whitespace-pre-wrap break-all'
            )}
            wrapLines={wrapLines}
            showLineNumbers={false} // We handle line numbers manually
          >
            {value}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  )
}

/**
 * InlineCode - Simple inline code component
 */
export interface InlineCodeProps {
  children: React.ReactNode
  className?: string
}

export function InlineCode({ children, className = '' }: InlineCodeProps) {
  return (
    <code
      className={cn(
        'inline-code px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800',
        'text-sm font-mono text-gray-800 dark:text-gray-200',
        'border border-gray-200 dark:border-gray-700',
        className
      )}
    >
      {children}
    </code>
  )
}

/**
 * CodeGroup - Group multiple code examples with tabs
 */
export interface CodeGroupProps {
  children: React.ReactElement<CodeBlockProps>[]
  defaultLanguage?: string
}

export function CodeGroup({ children, defaultLanguage }: CodeGroupProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Find initial active tab
  useEffect(() => {
    if (defaultLanguage) {
      const index = React.Children.toArray(children).findIndex(
        (child) => {
          if (React.isValidElement(child)) {
            const props = child.props as { language?: string }
            return props.language === defaultLanguage
          }
          return false
        }
      )
      if (index !== -1) {
        setActiveIndex(index)
      }
    }
  }, [children, defaultLanguage])

  return (
    <div className="code-group my-6">
      {/* Tabs */}
      <div className="code-group-tabs flex border-b border-gray-700 bg-gray-900 dark:bg-gray-800">
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null
          const props = child.props as { language?: string }
          const language = props.language
          const isActive = index === activeIndex

          return (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'code-tab px-4 py-2 text-sm font-medium transition-colors',
                'text-gray-400 hover:text-gray-200',
                isActive
                  ? 'text-accent border-b-2 border-accent bg-accent/10'
                  : 'border-b-2 border-transparent'
              )}
            >
              {language || 'Code'}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {React.Children.toArray(children)[activeIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Utilities

/**
 * Normalize language name for SyntaxHighlighter
 */
function normalizeLanguage(language: string): string {
  const languageMap: Record<string, string> = {
    'c#': 'csharp',
    'c++': 'cpp',
    'objective-c': 'objectivec',
    'shell': 'bash',
    'sh': 'bash',
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'rb': 'ruby',
    'yml': 'yaml',
    'md': 'markdown',
    'json': 'json'
  }

  const lowerLang = language.toLowerCase()
  return languageMap[lowerLang] || lowerLang
}

function detectLanguage(code: string): string | null {
  // Simple heuristic - can be expanded
  if (code.includes('const ') || code.includes('let ') || code.includes('function ')) {
    return 'javascript'
  }
  if (code.includes('interface ') || code.includes('type ')) {
    return 'typescript'
  }
  if (code.includes('class ') || code.includes('def ')) {
    return 'python'
  }
  return 'text'
}

/*
 * Icons
 */
function CopyIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth="2" />
    </svg>
  )
}

function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FileCodeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeWidth="2" />
      <polyline points="14 2 14 8 20 8" strokeWidth="2" />
      <path d="M9 16l-3-3 3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 16l3-3-3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Utility function for class names
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default EnhancedCodeBlock
