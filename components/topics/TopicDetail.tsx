'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { TopicWithRelations } from '@/lib/types/database'
import TopicForm from './TopicForm'
import ResourceList from '@/components/resources/ResourceList'
import ProgressSection from '@/components/progress/ProgressSection'
import Timestamp from '@/components/ui/Timestamp'
import { getDaysSince } from '@/lib/utils/date/formatDate'
import { Priority } from '@prisma/client'

interface TopicDetailProps {
  topic: TopicWithRelations
}

export default function TopicDetail({ topic }: TopicDetailProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const priorityColors = {
    [Priority.low]: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    [Priority.medium]: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    [Priority.high]: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
  }
  
  const progressPercentage = (topic.currentProficiency / topic.targetProficiency) * 100
  const learningDays = topic.startedLearningAt 
    ? getDaysSince(topic.startedLearningAt)
    : null
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this topic? This will also delete all associated resources and progress updates.')) {
      return
    }
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/topics/${topic.id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete topic')
      
      router.push('/topics')
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete topic')
      setIsDeleting(false)
    }
  }
  
  const handleSuccess = () => {
    setIsEditing(false)
    router.refresh()
  }
  
  if (isEditing) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Topic
          </h1>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Cancel
          </button>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <TopicForm topic={topic} onSuccess={handleSuccess} />
        </div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/topics" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-2 inline-block">
            ← Back to Topics
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {topic.title}
          </h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Details
            </h2>
            {topic.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {topic.description}
              </p>
            )}
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Proficiency</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {topic.currentProficiency} / {topic.targetProficiency}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                {topic.category && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Category:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{topic.category}</span>
                  </div>
                )}
                {topic.priority && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${priorityColors[topic.priority]}`}>
                      {topic.priority}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-500 space-y-1 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  Created: <Timestamp date={topic.createdAt} format="both" />
                </div>
                <div>
                  Updated: <Timestamp date={topic.updatedAt} format="both" />
                </div>
                {learningDays !== null && (
                  <div>
                    Learning for: {learningDays} days
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <ResourceList topicId={topic.id} initialResources={topic.resources} />
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <ProgressSection topicId={topic.id} currentProficiency={topic.currentProficiency} initialUpdates={topic.progressUpdates} />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Stats
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Resources</span>
                <span className="font-medium text-gray-900 dark:text-white">{topic.resources.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Completed</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {topic.resources.filter(r => r.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Progress Updates</span>
                <span className="font-medium text-gray-900 dark:text-white">{topic.progressUpdates.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

