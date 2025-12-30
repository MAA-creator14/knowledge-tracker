'use client'

import { ResourceStatus, ResourceType } from '@prisma/client'
import type { Resource } from '@/lib/types/database'
import Timestamp from '@/components/ui/Timestamp'
import { getDaysSince, getDuration } from '@/lib/utils/date/formatDate'

interface ResourceCardProps {
  resource: Resource
  onEdit?: (resource: Resource) => void
  onDelete?: (id: string) => void
  onStatusChange?: (id: string, status: ResourceStatus) => void
}

export default function ResourceCard({ 
  resource, 
  onEdit, 
  onDelete,
  onStatusChange 
}: ResourceCardProps) {
  const statusColors = {
    [ResourceStatus.not_started]: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    [ResourceStatus.in_progress]: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    [ResourceStatus.completed]: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
  }
  
  const typeLabels = {
    [ResourceType.book]: '📚 Book',
    [ResourceType.course]: '🎓 Course',
    [ResourceType.article]: '📄 Article',
    [ResourceType.video]: '🎥 Video',
    [ResourceType.other]: '📌 Other'
  }
  
  const duration = resource.startedAt && resource.completedAt
    ? getDuration(resource.startedAt, resource.completedAt)
    : resource.startedAt
    ? getDuration(resource.startedAt)
    : null
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {typeLabels[resource.type]}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded ${statusColors[resource.status]}`}>
              {resource.status.replace('_', ' ')}
            </span>
          </div>
          
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
            {resource.url ? (
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                {resource.title}
              </a>
            ) : (
              resource.title
            )}
          </h4>
          
          {resource.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {resource.notes}
            </p>
          )}
          
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-500 space-y-1">
            <div>
              Created: <Timestamp date={resource.createdAt} format="relative" />
            </div>
            {resource.startedAt && (
              <div>
                Started: <Timestamp date={resource.startedAt} format="relative" />
                {resource.status === ResourceStatus.in_progress && (
                  <span className="ml-2">({getDaysSince(resource.startedAt)} days ago)</span>
                )}
              </div>
            )}
            {resource.completedAt && (
              <div>
                Completed: <Timestamp date={resource.completedAt} format="relative" />
                {duration && <span className="ml-2">({duration})</span>}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {onStatusChange && (
            <select
              value={resource.status}
              onChange={(e) => onStatusChange(resource.id, e.target.value as ResourceStatus)}
              className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 dark:text-white"
            >
              <option value={ResourceStatus.not_started}>Not Started</option>
              <option value={ResourceStatus.in_progress}>In Progress</option>
              <option value={ResourceStatus.completed}>Completed</option>
            </select>
          )}
          
          {onEdit && (
            <button
              onClick={() => onEdit(resource)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              aria-label="Edit resource"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          
          {onDelete && (
            <button
              onClick={() => onDelete(resource.id)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              aria-label="Delete resource"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


