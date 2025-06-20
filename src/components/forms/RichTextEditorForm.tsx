'use client'

import React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import RichTextEditor from '@/components/RichTextEditor'
import { Button } from '@/components/ui/button'

// Define the form schema with Zod
const formSchema = z.object({
  content: z.string().min(1, 'Content is required'),
})

// Infer TypeScript type from the schema
type FormValues = z.infer<typeof formSchema>

interface RichTextEditorFormProps {
  initialValue?: string
  onSubmit: (data: FormValues) => void
}

const RichTextEditorForm: React.FC<RichTextEditorFormProps> = ({
  initialValue = '',
  onSubmit,
}) => {
  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: initialValue,
    },
  })

  // Handle form submission
  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">
          Content
        </label>
        
        <RichTextEditor
          value={form.watch('content')}
          onChange={(value) => form.setValue('content', value, { 
            shouldValidate: true,
            shouldDirty: true,
          })}
          height="300px"
        />
        
        {form.formState.errors.content && (
          <p className="text-sm text-red-500">
            {form.formState.errors.content.message}
          </p>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit">
          Save Content
        </Button>
      </div>
    </form>
  )
}

export default RichTextEditorForm 