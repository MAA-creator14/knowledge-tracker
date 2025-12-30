import MainLayout from '@/components/layout/MainLayout'
import ActivityFeed from '@/components/activity/ActivityFeed'
import { prisma } from '@/lib/db/client'

export default async function TimelinePage() {
  const activities = await prisma.activityLog.findMany({
    include: {
      topic: true,
      resource: true,
      progressUpdate: {
        include: {
          topic: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  })
  
  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Timeline
        </h1>
        <ActivityFeed initialActivities={activities} />
      </div>
    </MainLayout>
  )
}
