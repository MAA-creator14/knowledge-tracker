'use client'
console.log(TopicList)
import { useState, useEffect } from 'react'
import type { TopicWithRelations } from '@/lib/types/database'
import TopicCard from './TopicCard'

interface TopicListProps {
  initialTopics?: TopicWithRelations[]
}

export default function TopicList({ initialTopics = [] }: TopicListProps) {
  console.log('a')
  const [topics, setTopics] = useState<TopicWithRelations[]>(initialTopics)
  const [isLoading, setIsLoading] = useState(!initialTopics.length)
  const [error, setError] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  useEffect(() => {
    if (!initialTopics.length) {
      fetchTopics()
    }
  }, [categoryFilter, sortBy, sortOrder])
  
  const fetchTopics = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (categoryFilter) params.append('category', categoryFilter)
      params.append('sortBy', sortBy)
      params.append('sortOrder', sortOrder)
      
      const response = await fetch(`/api/topics?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch topics')
      
      const data = await response.json()
      setTopics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this topic?')) return
    
    try {
      const response = await fetch(`/api/topics/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete topic')
      
      setTopics(topics.filter(t => t.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete topic')
    }
  }
  
  const categories = Array.from(new Set(topics.map(t => t.category).filter(Boolean))) as string[]
  
  if (isLoading) {
    console.log('weareloading')
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Loading topics...</p>
      </div>
    )
  }
  
  if (error) {
    console.log('wehaveanerror')
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
        {error}
      </div>
    )
  }
  
  if (topics.length === 0) {
    console.log('b')
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No topics yet. Create your first topic to get started!</p>
      </div>
    )
  }
  console.log('executeall')
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Filter by Category
          </label>
          <select
            id="category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="min-w-[150px]">
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort By
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="updatedAt">Last Updated</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Title</option>
            <option value="currentProficiency">Proficiency</option>
          </select>
        </div>
        
        <div className="min-w-[120px]">
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Order
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map(topic => (
          <TopicCard key={topic.id} topic={topic} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  )
}


