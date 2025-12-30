'use client'

import Link from 'next/link'
import { Priority } from '@prisma/client'
import type { TopicWithRelations } from '@/lib/types/database'
import Timestamp from '@/components/ui/Timestamp'
import { getDaysSince } from '@/lib/utils/date/formatDate'

interface TopicCardProps {
  topic: TopicWithRelations
  onDelete?: (id: string) => void
}

export default function TopicCard({ topic, onDelete }: TopicCardProps) {
  const priorityColors = {
    [Priority.low]: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    [Priority.medium]: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    [Priority.high]: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
  }
  
  const progressPercentage = (topic.currentProficiency / topic.targetProficiency) * 100
  const resourcesCount = topic.resources.length
  const completedResources = topic.resources.filter(r => r.status === 'completed').length
  const learningDays = topic.startedLearningAt 
    ? getDaysSince(topic.startedLearningAt)
    : null
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link href={`/topics/${topic.id}`}>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
              {topic.title}
            </h3>
          </Link>
          {topic.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
              {topic.description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {topic.priority && (
            <span className={`px-2 py-1 text-xs font-medium rounded ${priorityColors[topic.priority]}`}>
              {topic.priority}
            </span>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(topic.id)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              aria-label="Delete topic"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Proficiency</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {topic.currentProficiency} / {topic.targetProficiency}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
          {topic.category && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
              {topic.category}
            </span>
          )}
          <span>{resourcesCount} resources</span>
          {completedResources > 0 && (
            <span>{completedResources} completed</span>
          )}
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
          <div>
            Created: <Timestamp date={topic.createdAt} format="relative" />
          </div>
          <div>
            Updated: <Timestamp date={topic.updatedAt} format="relative" />
          </div>
          {learningDays !== null && (
            <div>
              Learning for: {learningDays} days
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


