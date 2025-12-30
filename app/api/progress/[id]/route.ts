import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const progressUpdate = await prisma.progressUpdate.findUnique({
      where: { id: params.id },
      include: { topic: true }
    })
    
    if (!progressUpdate) {
      return NextResponse.json(
        { error: 'Progress update not found' },
        { status: 404 }
      )
    }
    
    await prisma.progressUpdate.delete({
      where: { id: params.id }
    })
    
    // Create activity log
    await prisma.activityLog.create({
      data: {
        entityType: 'progress',
        entityId: params.id,
        action: 'deleted',
        topicId: progressUpdate.topicId,
        details: {
          proficiencyLevel: progressUpdate.proficiencyLevel
        }
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting progress update:', error)
    return NextResponse.json(
      { error: 'Failed to delete progress update' },
      { status: 500 }
    )
  }
}


