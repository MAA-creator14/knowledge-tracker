import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { Priority } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'updatedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    const where = category ? { category } : {}
    const orderBy = {
      [sortBy]: sortOrder as 'asc' | 'desc'
    }
    
    const topics = await prisma.topic.findMany({
      where,
      orderBy,
      include: {
        resources: true,
        progressUpdates: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })
    
    return NextResponse.json(topics)
  } catch (error) {
    console.error('Error fetching topics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      currentProficiency,
      targetProficiency,
      category,
      priority,
      startedLearningAt
    } = body
    
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }
    
    const topic = await prisma.topic.create({
      data: {
        title,
        description: description || null,
        currentProficiency: currentProficiency || 1,
        targetProficiency: targetProficiency || 10,
        category: category || null,
        priority: priority || Priority.medium,
        startedLearningAt: startedLearningAt ? new Date(startedLearningAt) : null
      }
    })
    
    // Create activity log
    await prisma.activityLog.create({
      data: {
        entityType: 'topic',
        entityId: topic.id,
        action: 'created',
        topicId: topic.id,
        details: { title: topic.title }
      }
    })
    
    return NextResponse.json(topic, { status: 201 })
  } catch (error) {
    console.error('Error creating topic:', error)
    return NextResponse.json(
      { error: 'Failed to create topic' },
      { status: 500 }
    )
  }
}


