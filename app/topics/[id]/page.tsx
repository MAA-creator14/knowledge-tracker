import { notFound } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { prisma } from '@/lib/db/client'
import TopicDetail from '@/components/topics/TopicDetail'

export default async function TopicDetailPage({
  params
}: {
  params: { id: string }
}) {
  const topic = await prisma.topic.findUnique({
    where: { id: params.id },
    include: {
      resources: {
        orderBy: { order: 'asc' }
      },
      progressUpdates: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })
  
  if (!topic) {
    notFound()
  }
  
  return (
    <MainLayout>
      <TopicDetail topic={topic} />
    </MainLayout>
  )
}


