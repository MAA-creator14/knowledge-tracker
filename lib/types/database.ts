import { Topic, Resource, ProgressUpdate, ActivityLog, Priority, ResourceType, ResourceStatus } from '@prisma/client'

export type { Topic, Resource, ProgressUpdate, ActivityLog, Priority, ResourceType, ResourceStatus }

export type TopicWithRelations = Topic & {
  resources: Resource[]
  progressUpdates: ProgressUpdate[]
}

export type ResourceWithTopic = Resource & {
  topic: Topic
}

export type ProgressUpdateWithTopic = ProgressUpdate & {
  topic: Topic
}


