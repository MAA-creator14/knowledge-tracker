'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ResourceType, ResourceStatus } from '@prisma/client'
import type { Resource } from '@/lib/types/database'

const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url().optional().or(z.literal('')),
  type: z.nativeEnum(ResourceType).default(ResourceType.other),
  status: z.nativeEnum(ResourceStatus).default(ResourceStatus.not_started),
  notes: z.string().optional(),
  order: z.number().default(0)
})

type ResourceFormData = z.infer<typeof resourceSchema>

interface ResourceFormProps {
  topicId: string
  resource?: Resource
  onSuccess?: () => void
  onCancel?: () => void
}

export default function ResourceForm({ topicId, resource, onSuccess, onCancel }: ResourceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: resource ? {
      title: resource.title,
      url: resource.url || '',
      type: resource.type,
      status: resource.status,
      notes: resource.notes || '',
      order: resource.order
    } : {
      type: ResourceType.other,
      status: ResourceStatus.not_started,
      order: 0
    }
  })
  
  const onSubmit = async (data: ResourceFormData) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const url = resource 
        ? `/api/resources/${resource.id}`
        : '/api/resources'
      
      const method = resource ? 'PUT' : 'POST'
      
      const payload = {
        ...data,
        topicId: resource ? undefined : topicId,
        url: data.url || null
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save resource')
      }
      
      reset()
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
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          URL
        </label>
        <input
          id="url"
          type="url"
          {...register('url')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
        />
        {errors.url && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.url.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <select
            id="type"
            {...register('type')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value={ResourceType.book}>Book</option>
            <option value={ResourceType.course}>Course</option>
            <option value={ResourceType.article}>Article</option>
            <option value={ResourceType.video}>Video</option>
            <option value={ResourceType.other}>Other</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            id="status"
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value={ResourceStatus.not_started}>Not Started</option>
            <option value={ResourceStatus.in_progress}>In Progress</option>
            <option value={ResourceStatus.completed}>Completed</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          {...register('notes')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      
      <div>
        <label htmlFor="order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Order (for sorting)
        </label>
        <input
          id="order"
          type="number"
          {...register('order', { valueAsNumber: true })}
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
          {isSubmitting ? 'Saving...' : resource ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}


