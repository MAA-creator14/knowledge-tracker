import { notFound } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { prisma } from '@/lib/db/client'
import TopicDetail from '@/components/topics/TopicDetail'

export default async function TopicDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const topic = await prisma.topic.findUnique({
    where: { id },
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


