'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const progressSchema = z.object({
  proficiencyLevel: z.number().min(1).max(10),
  notes: z.string().optional(),
  learningDate: z.string().optional()
})

type ProgressFormData = z.infer<typeof progressSchema>

interface ProgressFormProps {
  topicId: string
  currentProficiency: number
  onSuccess?: () => void
  onCancel?: () => void
}

export default function ProgressForm({ 
  topicId, 
  currentProficiency,
  onSuccess, 
  onCancel 
}: ProgressFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProgressFormData>({
    resolver: zodResolver(progressSchema),
    defaultValues: {
      proficiencyLevel: currentProficiency,
      learningDate: new Date().toISOString().split('T')[0]
    }
  })
  
  const onSubmit = async (data: ProgressFormData) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          topicId,
          learningDate: data.learningDate || undefined
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save progress update')
      }
      
      reset({
        proficiencyLevel: data.proficiencyLevel,
        learningDate: new Date().toISOString().split('T')[0]
      })
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="proficiencyLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Proficiency Level (1-10) *
        </label>
        <input
          id="proficiencyLevel"
          type="number"
          min="1"
          max="10"
          {...register('proficiencyLevel', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
        />
        {errors.proficiencyLevel && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.proficiencyLevel.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="learningDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Learning Date (optional - defaults to today)
        </label>
        <input
          id="learningDate"
          type="date"
          {...register('learningDate')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes / Reflection
        </label>
        <textarea
          id="notes"
          rows={3}
          {...register('notes')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder="What did you learn? What progress did you make?"
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Add Progress Update'}
        </button>
      </div>
    </form>
  )
}


