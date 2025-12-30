'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import TopicForm from '@/components/topics/TopicForm'

export default function NewTopicPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSuccess = () => {
    router.push('/topics')
    router.refresh()
  }
  
  const handleCancel = () => {
    router.back()
  }
  
  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          New Topic
        </h1>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <TopicForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </div>
    </MainLayout>
  )
}


