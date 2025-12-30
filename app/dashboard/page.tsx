import MainLayout from '@/components/layout/MainLayout'
import { prisma } from '@/lib/db/client'
import { ResourceStatus } from '@prisma/client'
import Link from 'next/link'

export default async function DashboardPage() {
  const [
    totalTopics,
    totalResources,
    completedResources,
    inProgressResources,
    recentTopics,
    recentProgress
  ] = await Promise.all([
    prisma.topic.count(),
    prisma.resource.count(),
    prisma.resource.count({ where: { status: ResourceStatus.completed } }),
    prisma.resource.count({ where: { status: ResourceStatus.in_progress } }),
    prisma.topic.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: {
        resources: true,
        progressUpdates: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    }),
    prisma.progressUpdate.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        topic: true
      }
    })
  ])
  
  const activeResources = inProgressResources
  const totalProgressUpdates = await prisma.progressUpdate.count()
  
  // Calculate learning streak (simplified - days with any activity)
  const activities = await prisma.activityLog.findMany({
    select: { createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 100
  })
  
  let streak = 0
  if (activities.length > 0) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let currentDate = new Date(today)
    for (const activity of activities) {
      const activityDate = new Date(activity.createdAt)
      activityDate.setHours(0, 0, 0, 0)
      
      if (activityDate.getTime() === currentDate.getTime()) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else if (activityDate.getTime() < currentDate.getTime()) {
        break
      }
    }
  }
  
  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Total Topics
            </h2>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalTopics}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Total Resources
            </h2>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalResources}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              {completedResources} completed, {activeResources} in progress
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Progress Updates
            </h2>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalProgressUpdates}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Learning Streak
            </h2>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{streak}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">days</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Topics
              </h2>
              <Link 
                href="/topics"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
              >
                View All →
              </Link>
            </div>
            {recentTopics.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No topics yet. <Link href="/topics/new" className="text-blue-600 hover:underline">Create your first topic</Link>!</p>
            ) : (
              <div className="space-y-3">
                {recentTopics.map(topic => (
                  <Link
                    key={topic.id}
                    href={`/topics/${topic.id}`}
                    className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{topic.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                          {topic.resources.length} resources • Proficiency: {topic.currentProficiency}/{topic.targetProficiency}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Progress
              </h2>
              <Link 
                href="/timeline"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
              >
                View Timeline →
              </Link>
            </div>
            {recentProgress.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No progress updates yet.</p>
            ) : (
              <div className="space-y-3">
                {recentProgress.map(update => (
                  <div
                    key={update.id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {update.topic.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Proficiency: {update.proficiencyLevel}
                          {update.notes && ` • ${update.notes.substring(0, 50)}${update.notes.length > 50 ? '...' : ''}`}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(update.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
