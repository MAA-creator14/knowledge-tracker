import MainLayout from '@/components/layout/MainLayout'
import TopicList from '@/components/topics/TopicList'
import Link from 'next/link'
import { prisma } from '@/lib/db/client'

export default async function TopicsPage() {
  const topics = await prisma.topic.findMany({
    include: {
      resources: true,
      progressUpdates: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: { updatedAt: 'desc' }
  })
  
  return (
    <MainLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Topics
          </h1>
          <Link
            href="/topics/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Add Topic
          </Link>
        </div>
        <TopicList initialTopics={topics} />
      </div>
    </MainLayout>
  )
}
