import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { ResourceType, ResourceStatus } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const resource = await prisma.resource.findUnique({
      where: { id },
      include: {
        topic: true
      }
    })
    
    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(resource)
  } catch (error) {
    console.error('Error fetching resource:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      title,
      url,
      type,
      status,
      notes,
      order
    } = body
    
    const existingResource = await prisma.resource.findUnique({
      where: { id }
    })
    
    if (!existingResource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }
    
    // Handle status changes and timestamps
    let startedAt = existingResource.startedAt
    let completedAt = existingResource.completedAt
    
    if (status !== existingResource.status) {
      if (status === ResourceStatus.in_progress && !startedAt) {
        startedAt = new Date()
      }
      if (status === ResourceStatus.completed && !completedAt) {
        completedAt = new Date()
      }
      if (status !== ResourceStatus.completed) {
        completedAt = null
      }
    }
    
    const resource = await prisma.resource.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        url: url !== undefined ? url : undefined,
        type: type !== undefined ? type : undefined,
        status: status !== undefined ? status : undefined,
        notes: notes !== undefined ? notes : undefined,
        order: order !== undefined ? order : undefined,
        startedAt: startedAt !== undefined ? startedAt : undefined,
        completedAt: completedAt !== undefined ? completedAt : undefined
      }
    })
    
    // Create activity log for status changes
    if (status !== existingResource.status) {
      await prisma.activityLog.create({
        data: {
          entityType: 'resource',
          entityId: resource.id,
          action: 'status_changed',
          topicId: resource.topicId,
          resourceId: resource.id,
          details: {
            oldStatus: existingResource.status,
            newStatus: resource.status,
            title: resource.title
          }
        }
      })
    } else {
      await prisma.activityLog.create({
        data: {
          entityType: 'resource',
          entityId: resource.id,
          action: 'updated',
          topicId: resource.topicId,
          resourceId: resource.id,
          details: { title: resource.title }
        }
      })
    }
    
    return NextResponse.json(resource)
  } catch (error) {
    console.error('Error updating resource:', error)
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const resource = await prisma.resource.findUnique({
      where: { id }
    })
    
    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }
    
    await prisma.resource.delete({
      where: { id }
    })
    
    // Create activity log
    await prisma.activityLog.create({
      data: {
        entityType: 'resource',
        entityId: id,
        action: 'deleted',
        topicId: resource.topicId,
        details: { title: resource.title }
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    )
  }
}


