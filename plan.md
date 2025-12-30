# Knowledge Tracker - Project Plan

## Project Overview

A web application that helps users track learning topics, self-assess proficiency levels, manage learning resources, and monitor progress over time with comprehensive timestamp tracking.

## Functional Requirements

### 1. Topic Management
- **CRUD Operations**: Create, read, update, and delete learning topics
- **Proficiency Tracking**: Self-rated proficiency levels (1-10 scale or Beginner/Intermediate/Advanced)
- **Organization**: Category/tags system for organizing topics
- **Priority System**: Optional priority levels (low, medium, high)
- **Goal Setting**: Target proficiency level for each topic
- **Timestamp Tracking**: 
  - Automatic timestamp capture for topic creation
  - Automatic timestamp updates on modifications
  - Optional "started learning" date selector
  - Display relative and absolute timestamps

### 2. Learning Resources Management
- **Resource Association**: Add multiple resources per topic (books, courses, articles, videos, etc.)
- **Resource Fields**:
  - Title (required)
  - URL (optional)
  - Type (enum: book, course, article, video, other)
  - Status (enum: not_started, in_progress, completed)
  - Notes (text field)
  - Order/priority for sorting
- **Status Management**: Update resource status with automatic timestamp capture
- **Timestamp Tracking**:
  - Creation timestamp
  - Update timestamp on edits
  - Started timestamp (when marked as "in progress")
  - Completed timestamp (when marked as "completed")
  - Display time elapsed for in-progress resources
  - Display completion date for completed resources

### 3. Progress Tracking
- **Progress Updates**: Record proficiency level changes with notes/reflections
- **Timeline Visualization**: Chronological display of all progress entries
- **Visual Indicators**: Charts/graphs showing proficiency over time
- **Activity Log**: Learning history with timestamps
- **Date Flexibility**: Support for backdating progress entries
- **Filtering**: Date range filtering for progress entries
- **Sorting**: Timestamp-based sorting capabilities

### 4. Timestamp Features
- **Display Formats**:
  - Relative timestamps (e.g., "2 days ago", "Last week")
  - Absolute timestamps (e.g., "January 15, 2024, 3:45 PM")
  - Toggle between relative and absolute formats
- **Timeline View**: Chronological learning journey visualization
- **Date Filtering**: Filter topics, resources, and progress by date ranges
- **Milestone Tracking**: Anniversary/milestone notifications (e.g., "Learning JavaScript for 6 months")
- **Activity Heatmap**: Visual representation of learning activity over time
- **Calendar View**: Calendar-based view of learning activities
- **Activity Feed**: Chronological feed with timestamps across all activities

### 5. User Interface Requirements
- **Dashboard**: Overview showing all topics at a glance with statistics
- **Topic Detail View**: Comprehensive view with resources and progress history
- **Filtering & Sorting**: 
  - Filter by category, priority, proficiency level
  - Sort by date (created, updated, last activity)
  - Date range filtering
- **Responsive Design**: Mobile and desktop compatibility
- **Visual Components**:
  - Progress charts with date-based x-axis
  - Activity heatmap
  - Calendar view
  - Timeline visualization
  - Activity feed

### 6. Statistics & Insights
- **Time-Based Statistics**:
  - Topics created this week/month/year
  - Total learning days (days with any activity)
  - Longest learning streak
  - Most active learning day/week
  - Average time to complete resources
  - Time spent on each topic (estimated from activity)
  - Progress velocity (proficiency gains over time)
- **Insights**:
  - Learning duration per topic
  - Productivity patterns
  - Streak tracking
  - Monthly/weekly activity summaries

### 7. Data Management
- **Export/Import**: Data export/backup with timestamp preservation
- **Search**: Search functionality across topics and resources with date filtering
- **Timezone Handling**: Store in UTC, display in user's local timezone

## Technical Requirements

### Tech Stack

#### Frontend
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API or Zustand
- **Charts**: Recharts or Chart.js
- **Form Handling**: React Hook Form
- **Date Handling**: date-fns or Day.js (for formatting and relative time)
- **Calendar Component**: react-calendar or @fullcalendar (for calendar view)
- **Timestamp Display**: react-timeago (for relative timestamps)

#### Backend
- **Selected**: Next.js with API routes (App Router)
- **Rationale**: 
  - Full-stack framework ideal for serverless deployment
  - Fastest setup with built-in API routes
  - Perfect for Vercel deployment (free tier available)
  - Single codebase for solo developer
- **API Style**: RESTful API

#### Database
- **Selected**: Supabase (PostgreSQL)
- **Rationale**:
  - Managed PostgreSQL with free tier
  - Serverless-friendly, works seamlessly with Next.js
  - Built-in timestamp support with timezone awareness
  - No database server management required
  - Can be self-hosted later if needed (Supabase is open-source)
- **ORM**: Prisma (recommended) or Supabase client library
- **Alternative**: Neon PostgreSQL (if Supabase doesn't fit)

#### Authentication
- **Selected**: None required (single-user application)
- **Note**: Database schema simplified to remove user_id foreign keys

### Database Schema

#### Topics Table
```sql
- id (UUID, primary key)
- title (string, required)
- description (text)
- current_proficiency (integer, 1-10)
- target_proficiency (integer, 1-10)
- category (string)
- priority (enum: low, medium, high)
- created_at (timestamp with timezone, required)
- updated_at (timestamp with timezone, required)
- started_learning_at (timestamp with timezone, nullable)
```

#### Resources Table
```sql
- id (UUID, primary key)
- topic_id (UUID, foreign key)
- title (string, required)
- url (string)
- type (enum: book, course, article, video, other)
- status (enum: not_started, in_progress, completed)
- notes (text)
- order (integer)
- created_at (timestamp with timezone, required)
- updated_at (timestamp with timezone, required)
- started_at (timestamp with timezone, nullable)
- completed_at (timestamp with timezone, nullable)
```

#### Progress Updates Table
```sql
- id (UUID, primary key)
- topic_id (UUID, foreign key)
- proficiency_level (integer, 1-10)
- notes (text)
- created_at (timestamp with timezone, required)
- learning_date (date, nullable)
```

#### Activity Log Table (Optional)
```sql
- id (UUID, primary key)
- entity_type (enum: topic, resource, progress)
- entity_id (UUID)
- action (enum: created, updated, deleted, completed, status_changed)
- details (jsonb)
- created_at (timestamp with timezone, required)
```

### Technical Considerations

#### Timestamp Handling
- **Storage**: All timestamps stored in UTC
- **Display**: Convert to user's local timezone for display
- **Immutability**: `created_at` should never change; `updated_at` changes automatically
- **Backdating**: Support for adding progress entries for past dates
- **Indexing**: Index timestamp fields for efficient date-range queries

#### Performance Requirements
- Fast load times (<2 seconds)
- Efficient date-range queries
- Optimized timestamp calculations
- Responsive UI interactions

#### Data Persistence Strategy
- **Selected**: Database-first (Supabase PostgreSQL)
- **Offline Support**: Optional enhancement (Phase 6+)
  - Use browser IndexedDB for offline caching
  - Sync timestamps when back online
  - Implement service worker for offline functionality

#### Authentication Requirements
- **Selected**: Single-user application (no authentication needed)
- **Future Consideration**: If multi-user support is needed later, can add Supabase Auth

#### Deployment
- **Selected**: Vercel (serverless platform)
- **Rationale**: 
  - Free tier available
  - Zero-config Next.js deployment
  - Automatic HTTPS and CDN
  - Serverless functions for API routes

## File Structure (Next.js App Router)

```
/app
  /api
    /topics
      route.ts              # GET, POST /api/topics
      /[id]
        route.ts            # GET, PUT, DELETE /api/topics/[id]
    /resources
      route.ts              # GET, POST /api/resources
      /[id]
        route.ts            # GET, PUT, DELETE /api/resources/[id]
    /progress
      route.ts              # GET, POST /api/progress
      /[id]
        route.ts            # DELETE /api/progress/[id]
    /activity
      route.ts              # GET /api/activity
  /topics
    page.tsx                # Topics list page
    /[id]
      page.tsx              # Topic detail page
  /dashboard
    page.tsx                # Dashboard with statistics
  /timeline
    page.tsx                # Timeline view
  /calendar
    page.tsx                # Calendar view
  layout.tsx                # Root layout
  page.tsx                  # Home page (redirects to dashboard)
/components
  /topics
    TopicCard.tsx
    TopicForm.tsx
    TopicList.tsx
  /resources
    ResourceList.tsx
    ResourceForm.tsx
    ResourceCard.tsx
  /progress
    ProgressChart.tsx
    ProgressTimeline.tsx
    ProgressForm.tsx
  /activity
    ActivityFeed.tsx
    ActivityHeatmap.tsx
  /ui
    Timestamp.tsx
    DateRangePicker.tsx
    RelativeTime.tsx
  /calendar
    CalendarView.tsx
/lib
  /db
    client.ts               # Prisma or Supabase client
    schema.prisma           # Prisma schema (if using Prisma)
  /utils
    /date
      formatDate.ts
      relativeTime.ts
      timezone.ts
  /types
    index.ts
    timestamps.ts
    database.ts
/prisma
  schema.prisma             # Prisma schema definition
  migrations/               # Database migrations
/public
  # Static assets
/styles
  globals.css               # Global styles with Tailwind
```

## Key Utility Functions

### Date Formatting Functions
- `formatAbsoluteDate(date: Date): string` - Format as absolute date
- `formatRelativeTime(date: Date): string` - Format as relative time
- `formatDateRange(start: Date, end: Date): string` - Format date range
- `getDaysSince(date: Date): number` - Calculate days since date
- `getWeeksSince(date: Date): number` - Calculate weeks since date
- `getMonthsSince(date: Date): number` - Calculate months since date

### Timestamp Display Component
```typescript
interface TimestampProps {
  date: Date | string;
  format?: 'relative' | 'absolute' | 'both';
  showTime?: boolean;
  className?: string;
}
```

### Date Range Picker Component
```typescript
interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (range: { start: Date; end: Date }) => void;
  presets?: Array<'today' | 'week' | 'month' | 'year'>;
}
```

## Development Phases

### Phase 1: Project Setup & Foundation
- Initialize project with chosen tech stack
- Set up database and schema with timestamp fields
- Configure timezone handling (store in UTC, display in user's timezone)
- Configure development environment
- Set up basic routing structure
- Implement basic UI layout (header, navigation, main content area)
- Set up date-fns or Day.js utility functions

### Phase 2: Topic Management
- Create topic form (add/edit) with automatic timestamp capture
- Topic list view with sorting and filtering (including by date)
- Display created/updated timestamps on topic cards
- Topic detail view showing full timestamp history
- Delete topic functionality
- Category/tag system
- "Started learning" date selector (optional manual override)

### Phase 3: Resource Management
- Add resource form within topic detail view with timestamp capture
- Display resources list per topic with timestamps
- Edit/delete resources (update timestamp on edit)
- Update resource status with automatic status change timestamps
- Resource notes functionality
- Display time elapsed for "in progress" resources
- Display completion date for completed resources

### Phase 4: Progress Tracking
- Progress update form with current timestamp or manual date selection
- Progress history timeline with clear timestamps
- Visual charts for proficiency over time (x-axis: dates)
- Activity log/feed with relative timestamps ("2 hours ago")
- Progress statistics on dashboard
- Filter progress by date range

### Phase 5: Timestamp Features & Visualizations
- Implement relative timestamp display (e.g., "3 days ago")
- Add toggle between relative and absolute timestamps
- Create chronological activity feed across all topics
- Build calendar heatmap showing learning activity
- Add date range picker for filtering
- Display learning streaks and milestones
- "On this day" feature showing past activities
- Timeline view of learning journey

### Phase 6: Polish & Enhancement
- Dashboard with overview statistics (including time-based stats)
- Responsive design refinements
- Loading states and error handling
- Data validation
- Performance optimization
- Export/import data with timestamp preservation
- Timezone settings for users

## UI Component Examples

### Activity Feed Item
```
[Icon] Added resource "JavaScript: The Good Parts"
       to topic "JavaScript Fundamentals"
       2 hours ago • Jan 15, 2024, 3:45 PM
```

### Topic Card Timestamps
```
JavaScript Fundamentals
━━━━━━━━━━━━━━━━━━━━
Created: 3 months ago
Last updated: 2 days ago
Learning for: 89 days
```

### Progress Timeline Entry
```
●────────────────────
│ Proficiency: 6 → 7
│ "Completed advanced course"
│ Jan 15, 2024, 3:45 PM
│ (2 days ago)
```

### Resource Completion Badge
```
✓ Completed
  Started: Dec 1, 2023
  Finished: Jan 15, 2024
  Duration: 45 days
```

## Success Metrics

- Ability to track at least 10+ topics simultaneously
- Easy addition of resources with minimal friction
- Clear visualization of progress over time
- Fast load times (<2 seconds)
- Mobile-friendly interface
- Accurate timestamp display in all scenarios
- Intuitive date filtering and sorting
- Visual timeline that tells the learning story

## Selected Tech Stack Summary

### Backend & Database
- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Database**: Supabase (PostgreSQL)
- **ORM/Client**: Prisma ORM (recommended) or Supabase JavaScript client
- **Deployment**: Vercel (serverless)
- **Authentication**: None (single-user application)

### Key Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@prisma/client": "^5.0.0",
    "prisma": "^5.0.0",
    "@supabase/supabase-js": "^2.0.0",
    "date-fns": "^2.30.0",
    "react-timeago": "^7.0.0",
    "recharts": "^2.8.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "tailwindcss": "^3.3.0"
  }
}
```

### Environment Variables
```
# Supabase (if using Supabase client)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# OR Prisma (if using Prisma ORM)
DATABASE_URL=postgresql://... (Supabase connection string)
```

### Deployment Setup
1. **Supabase Setup**:
   - Create free account at supabase.com
   - Create new project
   - Get connection string and API keys
   - Run database migrations (Prisma or SQL)

2. **Vercel Setup**:
   - Connect GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push to main branch

3. **Local Development**:
   - `npm install` to install dependencies
   - Copy `.env.example` to `.env.local` and add credentials
   - `npx prisma migrate dev` (if using Prisma)
   - `npm run dev` to start development server

### Notes
- Database schema simplified for single-user (no user_id fields)
- Offline support can be added as optional enhancement in later phases
- Real-time features can be added using Supabase Realtime if needed in future

