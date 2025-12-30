'use client'

import { useState } from 'react'
import type { ProgressUpdate } from '@/lib/types/database'
import ProgressForm from './ProgressForm'
import ProgressTimeline from './ProgressTimeline'

interface ProgressSectionProps {
  topicId: string
  currentProficiency: number
  initialUpdates?: ProgressUpdate[]
}

export default function ProgressSection({ 
  topicId, 
  currentProficiency,
  initialUpdates = [] 
}: ProgressSectionProps) {
  const [showForm, setShowForm] = useState(false)
  
  const handleSuccess = () => {
    setShowForm(false)
    // ProgressTimeline will refetch on its own
    window.location.reload() // Simple refresh for now
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Progress Updates ({initialUpdates.length})
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Add Update
          </button>
        )}
      </div>
      
      {showForm && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <ProgressForm
            topicId={topicId}
            currentProficiency={currentProficiency}
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
      
      <ProgressTimeline topicId={topicId} initialUpdates={initialUpdates} />
    </div>
  )
}


