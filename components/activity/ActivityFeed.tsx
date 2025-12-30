'use client'

import { useState, useEffect } from 'react'
import type { ActivityLog } from '@prisma/client'
import Timestamp from '@/components/ui/Timestamp'
import Link from 'next/link'

interface ActivityLogWithRelations extends ActivityLog {
  topic?: { id: string; title: string } | null
  resource?: { id: string; title: string } | null
  progressUpdate?: { id: string; proficiencyLevel: number; topic?: { id: string; title: string } | null } | null
}

interface ActivityFeedProps {
  initialActivities?: ActivityLogWithRelations[]
}

export default function ActivityFeed({ initialActivities = [] }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityLogWithRelations[]>(initialActivities)
  const [isLoading, setIsLoading] = useState(!initialActivities.length)
  
  useEffect(() => {
    if (!initialActivities.length) {
      fetchActivities()
    }
  }, [])
  
  const fetchActivities = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/activity?limit=50')
      if (!response.ok) throw new Error('Failed to fetch activities')
      const data = await response.json()
      setActivities(data)
    } catch (err) {
      console.error('Error fetching activities:', err)
    } finally {
      setIsLoading(false)
    }
  }
  
  const getActivityDescription = (activity: ActivityLogWithRelations): string => {
    const action = activity.action.replace('_', ' ')
    
    switch (activity.entityType) {
      case 'topic':
        return `${action} topic "${activity.topic?.title || 'Unknown'}"`
      case 'resource':
        return `${action} resource "${activity.resource?.title || 'Unknown'}"${activity.topic ? ` in "${activity.topic.title}"` : ''}`
      case 'progress':
        const level = activity.progressUpdate?.proficiencyLevel
        const topicTitle = activity.progressUpdate?.topic?.title || activity.topic?.title || 'Unknown'
        return `${action} progress update (Proficiency: ${level}) for "${topicTitle}"`
      default:
        return `${action} ${activity.entityType}`
    }
  }
  
  const getActivityLink = (activity: ActivityLogWithRelations): string | null => {
    switch (activity.entityType) {
      case 'topic':
        return activity.topic ? `/topics/${activity.topic.id}` : null
      case 'resource':
        return activity.topic ? `/topics/${activity.topic.id}` : null
      case 'progress':
        const topicId = activity.progressUpdate?.topic?.id || activity.topic?.id
        return topicId ? `/topics/${topicId}` : null
      default:
        return null
    }
  }
  
  const getActivityIcon = (activity: ActivityLogWithRelations): string => {
    switch (activity.action) {
      case 'created':
        return '➕'
      case 'updated':
        return '✏️'
      case 'deleted':
        return '🗑️'
      case 'completed':
        return '✅'
      case 'status_changed':
        return '🔄'
      default:
        return '📝'
    }
  }
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Loading activity...</p>
      </div>
    )
  }
  
  if (activities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No activity yet. Start learning to see your timeline!</p>
      </div>
    )
  }
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <div className="space-y-4">
        {activities.map(activity => {
          const link = getActivityLink(activity)
          const description = getActivityDescription(activity)
          const icon = getActivityIcon(activity)
          
          const content = (
            <div className="flex items-start gap-4 p-4 border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <span className="text-2xl">{icon}</span>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white">
                  {description}
                </p>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                  <Timestamp date={activity.createdAt} format="both" />
                </div>
              </div>
            </div>
          )
          
          return link ? (
            <Link key={activity.id} href={link}>
              {content}
            </Link>
          ) : (
            <div key={activity.id}>
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}


