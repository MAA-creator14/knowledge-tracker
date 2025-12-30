'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Priority } from '@prisma/client'
import type { Topic } from '@/lib/types/database'

const topicSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  currentProficiency: z.number().min(1).max(10).default(1),
  targetProficiency: z.number().min(1).max(10).default(10),
  category: z.string().optional(),
  priority: z.nativeEnum(Priority).default(Priority.medium),
  startedLearningAt: z.string().optional()
})

type TopicFormData = z.infer<typeof topicSchema>

interface TopicFormProps {
  topic?: Topic
  onSuccess?: () => void
  onCancel?: () => void
}

export default function TopicForm({ topic, onSuccess, onCancel }: TopicFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TopicFormData>({
    resolver: zodResolver(topicSchema),
    defaultValues: topic ? {
      title: topic.title,
      description: topic.description || '',
      currentProficiency: topic.currentProficiency,
      targetProficiency: topic.targetProficiency,
      category: topic.category || '',
      priority: topic.priority || Priority.medium,
      startedLearningAt: topic.startedLearningAt 
        ? new Date(topic.startedLearningAt).toISOString().split('T')[0]
        : ''
    } : {
      currentProficiency: 1,
      targetProficiency: 10,
      priority: Priority.medium
    }
  })
  
  useEffect(() => {
    if (topic) {
      reset({
        title: topic.title,
        description: topic.description || '',
        currentProficiency: topic.currentProficiency,
        targetProficiency: topic.targetProficiency,
        category: topic.category || '',
        priority: topic.priority || Priority.medium,
        startedLearningAt: topic.startedLearningAt 
          ? new Date(topic.startedLearningAt).toISOString().split('T')[0]
          : ''
      })
    }
  }, [topic, reset])
  
  const onSubmit = async (data: TopicFormData) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const url = topic 
        ? `/api/topics/${topic.id}`
        : '/api/topics'
      
      const method = topic ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save topic')
      }
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/topics')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title *
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          {...register('description')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="currentProficiency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Current Proficiency (1-10)
          </label>
          <input
            id="currentProficiency"
            type="number"
            min="1"
            max="10"
            {...register('currentProficiency', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        
        <div>
          <label htmlFor="targetProficiency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Target Proficiency (1-10)
          </label>
          <input
            id="targetProficiency"
            type="number"
            min="1"
            max="10"
            {...register('targetProficiency', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <input
            id="category"
            type="text"
            {...register('category')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <select
            id="priority"
            {...register('priority')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value={Priority.low}>Low</option>
            <option value={Priority.medium}>Medium</option>
            <option value={Priority.high}>High</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="startedLearningAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Started Learning At (optional)
        </label>
        <input
          id="startedLearningAt"
          type="date"
          {...register('startedLearningAt')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
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
          {isSubmitting ? 'Saving...' : topic ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}


