'use client'

import { useState, useEffect } from 'react'
import type { ProgressUpdate } from '@/lib/types/database'
import Timestamp from '@/components/ui/Timestamp'

interface ProgressTimelineProps {
  topicId: string
  initialUpdates?: ProgressUpdate[]
}

export default function ProgressTimeline({ topicId, initialUpdates = [] }: ProgressTimelineProps) {
  const [updates, setUpdates] = useState<ProgressUpdate[]>(initialUpdates)
  const [isLoading, setIsLoading] = useState(!initialUpdates.length)
  
  useEffect(() => {
    if (!initialUpdates.length) {
      fetchUpdates()
    }
  }, [topicId])
  
  const fetchUpdates = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/progress?topicId=${topicId}`)
      if (!response.ok) throw new Error('Failed to fetch progress updates')
      const data = await response.json()
      setUpdates(data)
    } catch (err) {
      console.error('Error fetching progress updates:', err)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this progress update?')) return
    
    try {
      const response = await fetch(`/api/progress/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete progress update')
      
      setUpdates(updates.filter(u => u.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete progress update')
    }
  }
  
  if (isLoading) {
    return <div className="text-center py-4 text-gray-500 dark:text-gray-400">Loading progress...</div>
  }
  
  if (updates.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
        No progress updates yet. Add your first update!
      </p>
    )
  }
  
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
      <div className="space-y-6">
        {updates.map((update, index) => {
          const previousLevel = index < updates.length - 1 
            ? updates[index + 1].proficiencyLevel 
            : null
          
          return (
            <div key={update.id} className="relative pl-12">
              <div className="absolute left-2 top-2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white dark:border-gray-900" />
              
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        Proficiency: {update.proficiencyLevel}
                      </span>
                      {previousLevel !== null && previousLevel !== update.proficiencyLevel && (
                        <span className="text-sm text-gray-500 dark:text-gray-500">
                          ({previousLevel} → {update.proficiencyLevel})
                        </span>
                      )}
                    </div>
                    {update.notes && (
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {update.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(update.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 ml-2"
                    aria-label="Delete progress update"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  <Timestamp date={update.createdAt} format="both" />
                  {update.learningDate && (
                    <span className="ml-2">
                      (Learning date: {new Date(update.learningDate).toLocaleDateString()})
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


