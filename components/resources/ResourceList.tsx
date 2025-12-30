'use client'

import { useState, useEffect } from 'react'
import type { Resource } from '@/lib/types/database'
import ResourceCard from './ResourceCard'
import ResourceForm from './ResourceForm'
import { ResourceStatus } from '@prisma/client'

interface ResourceListProps {
  topicId: string
  initialResources?: Resource[]
}

export default function ResourceList({ topicId, initialResources = [] }: ResourceListProps) {
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [isLoading, setIsLoading] = useState(!initialResources.length)
  const [showForm, setShowForm] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  
  useEffect(() => {
    if (!initialResources.length) {
      fetchResources()
    }
  }, [topicId])
  
  const fetchResources = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/resources?topicId=${topicId}`)
      if (!response.ok) throw new Error('Failed to fetch resources')
      const data = await response.json()
      setResources(data)
    } catch (err) {
      console.error('Error fetching resources:', err)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSuccess = () => {
    setShowForm(false)
    setEditingResource(null)
    fetchResources()
  }
  
  const handleEdit = (resource: Resource) => {
    setEditingResource(resource)
    setShowForm(true)
  }
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return
    
    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete resource')
      
      setResources(resources.filter(r => r.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete resource')
    }
  }
  
  const handleStatusChange = async (id: string, newStatus: ResourceStatus) => {
    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (!response.ok) throw new Error('Failed to update status')
      
      const updated = await response.json()
      setResources(resources.map(r => r.id === id ? updated : r))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status')
    }
  }
  
  if (isLoading) {
    return <div className="text-center py-4 text-gray-500 dark:text-gray-400">Loading resources...</div>
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Resources ({resources.length})
        </h3>
        {!showForm && (
          <button
            onClick={() => {
              setEditingResource(null)
              setShowForm(true)
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Add Resource
          </button>
        )}
      </div>
      
      {showForm && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <ResourceForm
            topicId={topicId}
            resource={editingResource || undefined}
            onSuccess={handleSuccess}
            onCancel={() => {
              setShowForm(false)
              setEditingResource(null)
            }}
          />
        </div>
      )}
      
      {resources.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          No resources yet. Add your first resource!
        </p>
      ) : (
        <div className="space-y-2">
          {resources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}


