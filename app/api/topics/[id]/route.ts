import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { Priority } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(topic)
  } catch (error) {
    console.error('Error fetching topic:', error)
    return NextResponse.json(
      { error: 'Failed to fetch topic' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const topic = await prisma.topic.update({
      where: { id: params.id },
      data: {
        title,
        description: description !== undefined ? description : undefined,
        currentProficiency: currentProficiency !== undefined ? currentProficiency : undefined,
        targetProficiency: targetProficiency !== undefined ? targetProficiency : undefined,
        category: category !== undefined ? category : undefined,
        priority: priority !== undefined ? priority : undefined,
        startedLearningAt: startedLearningAt !== undefined 
          ? (startedLearningAt ? new Date(startedLearningAt) : null)
          : undefined
      }
    })
    
    // Create activity log
    await prisma.activityLog.create({
      data: {
        entityType: 'topic',
        entityId: topic.id,
        action: 'updated',
        topicId: topic.id,
        details: { title: topic.title }
      }
    })
    
    return NextResponse.json(topic)
  } catch (error) {
    console.error('Error updating topic:', error)
    return NextResponse.json(
      { error: 'Failed to update topic' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const topic = await prisma.topic.findUnique({
      where: { id: params.id }
    })
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      )
    }
    
    await prisma.topic.delete({
      where: { id: params.id }
    })
    
    // Create activity log
    await prisma.activityLog.create({
      data: {
        entityType: 'topic',
        entityId: params.id,
        action: 'deleted',
        details: { title: topic.title }
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting topic:', error)
    return NextResponse.json(
      { error: 'Failed to delete topic' },
      { status: 500 }
    )
  }
}


