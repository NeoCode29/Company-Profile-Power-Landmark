'use client'

import React, { useState } from 'react'
import RichTextEditor from '@/components/RichTextEditor'
import RichTextEditorForm from '@/components/forms/RichTextEditorForm'

export default function RichTextEditorDemo() {
  const [content, setContent] = useState('<p>Edit this text with the rich text editor...</p>')
  const [formSubmittedContent, setFormSubmittedContent] = useState('')
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Rich Text Editor Component</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Basic Usage</h2>
            <p className="text-gray-600">
              A simple rich text editor with basic formatting options.
            </p>
            
            <div className="p-4 border rounded-lg bg-slate-50">
              <RichTextEditor 
                value={content}
                onChange={setContent}
                height="200px"
              />
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Current Value (HTML):</h3>
              <pre className="p-4 bg-gray-100 rounded-lg text-sm overflow-auto max-h-40">
                {content}
              </pre>
            </div>
          </section>
        </div>
        
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">With React Hook Form and Zod</h2>
            <p className="text-gray-600">
              The rich text editor can be easily integrated with React Hook Form and Zod for validation.
            </p>
            
            <div className="p-4 border rounded-lg bg-slate-50">
              <RichTextEditorForm
                initialValue="<p>This is a form with validation using React Hook Form and Zod.</p>"
                onSubmit={(data) => {
                  setFormSubmittedContent(data.content)
                  alert('Form submitted successfully!')
                }}
              />
            </div>
            
            {formSubmittedContent && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Submitted Content:</h3>
                <div 
                  className="p-4 bg-white border rounded-lg prose prose-sm"
                  dangerouslySetInnerHTML={{ __html: formSubmittedContent }}
                />
              </div>
            )}
          </section>
        </div>
      </div>
      
      <section className="mt-12 p-6 border rounded-lg bg-white">
        <h2 className="text-2xl font-bold mb-4">Component Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">Prop</th>
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-left">Default</th>
                <th className="py-2 px-4 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4 font-mono">value</td>
                <td className="py-2 px-4">string</td>
                <td className="py-2 px-4">''</td>
                <td className="py-2 px-4">The HTML content to edit</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 font-mono">onChange</td>
                <td className="py-2 px-4">(value: string) {'->'} void</td>
                <td className="py-2 px-4">-</td>
                <td className="py-2 px-4">Callback when content changes</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 font-mono">height</td>
                <td className="py-2 px-4">string</td>
                <td className="py-2 px-4">'300px'</td>
                <td className="py-2 px-4">Height of the editor</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 font-mono">width</td>
                <td className="py-2 px-4">string</td>
                <td className="py-2 px-4">'100%'</td>
                <td className="py-2 px-4">Width of the editor</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-mono">placeholder</td>
                <td className="py-2 px-4">string</td>
                <td className="py-2 px-4">'Start typing...'</td>
                <td className="py-2 px-4">Placeholder text</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
} 