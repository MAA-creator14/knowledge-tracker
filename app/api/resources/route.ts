import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { ResourceType, ResourceStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const topicId = searchParams.get('topicId')
    const status = searchParams.get('status')
    
    const where: any = {}
    if (topicId) where.topicId = topicId
    if (status) where.status = status as ResourceStatus
    
    const resources = await prisma.resource.findMany({
      where,
      include: {
        topic: true
      },
      orderBy: { order: 'asc' }
    })
    
    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      topicId,
      title,
      url,
      type,
      status,
      notes,
      order
    } = body
    
    if (!topicId || !title) {
      return NextResponse.json(
        { error: 'Topic ID and title are required' },
        { status: 400 }
      )
    }
    
    // Verify topic exists
    const topic = await prisma.topic.findUnique({
      where: { id: topicId }
    })
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      )
    }
    
    const resource = await prisma.resource.create({
      data: {
        topicId,
        title,
        url: url || null,
        type: type || ResourceType.other,
        status: status || ResourceStatus.not_started,
        notes: notes || null,
        order: order || 0,
        startedAt: status === ResourceStatus.in_progress ? new Date() : null
      }
    })
    
    // Create activity log
    await prisma.activityLog.create({
      data: {
        entityType: 'resource',
        entityId: resource.id,
        action: 'created',
        topicId: topicId,
        resourceId: resource.id,
        details: { title: resource.title, type: resource.type }
      }
    })
    
    return NextResponse.json(resource, { status: 201 })
  } catch (error) {
    console.error('Error creating resource:', error)
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    )
  }
}


