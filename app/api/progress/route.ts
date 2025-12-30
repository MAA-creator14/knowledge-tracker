import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const topicId = searchParams.get('topicId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    const where: any = {}
    if (topicId) where.topicId = topicId
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }
    
    const progressUpdates = await prisma.progressUpdate.findMany({
      where,
      include: {
        topic: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(progressUpdates)
  } catch (error) {
    console.error('Error fetching progress updates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress updates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      topicId,
      proficiencyLevel,
      notes,
      learningDate
    } = body
    
    if (!topicId || proficiencyLevel === undefined) {
      return NextResponse.json(
        { error: 'Topic ID and proficiency level are required' },
        { status: 400 }
      )
    }
    
    if (proficiencyLevel < 1 || proficiencyLevel > 10) {
      return NextResponse.json(
        { error: 'Proficiency level must be between 1 and 10' },
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
    
    // Create progress update
    const progressUpdate = await prisma.progressUpdate.create({
      data: {
        topicId,
        proficiencyLevel,
        notes: notes || null,
        learningDate: learningDate ? new Date(learningDate) : null
      }
    })
    
    // Update topic's current proficiency
    await prisma.topic.update({
      where: { id: topicId },
      data: {
        currentProficiency: proficiencyLevel
      }
    })
    
    // Create activity log
    await prisma.activityLog.create({
      data: {
        entityType: 'progress',
        entityId: progressUpdate.id,
        action: 'created',
        topicId: topicId,
        progressUpdateId: progressUpdate.id,
        details: {
          proficiencyLevel: progressUpdate.proficiencyLevel,
          previousProficiency: topic.currentProficiency
        }
      }
    })
    
    return NextResponse.json(progressUpdate, { status: 201 })
  } catch (error) {
    console.error('Error creating progress update:', error)
    return NextResponse.json(
      { error: 'Failed to create progress update' },
      { status: 500 }
    )
  }
}


