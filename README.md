# Knowledge Tracker

A web application to track learning topics, self-assess proficiency levels, manage learning resources, and monitor progress over time with comprehensive timestamp tracking.

## Features

- **Topic Management**: Create, update, and delete learning topics with proficiency tracking
- **Resource Management**: Add multiple resources per topic (books, courses, articles, videos)
- **Progress Tracking**: Record proficiency updates with notes and timeline visualization
- **Timestamp Features**: Relative and absolute timestamp display throughout the app
- **Filtering & Sorting**: Filter by category, sort by date, proficiency, etc.

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Database**: Supabase (PostgreSQL) with Prisma ORM
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **Charts**: Recharts (for future visualizations)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier available)

### Setup

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > Database
   - Copy the connection string (format: `postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres`)

4. **Configure environment variables**:
   - Copy `.env.example` to `.env.local`
   - Add your Supabase connection string:
     ```
     DATABASE_URL="postgresql://postgres:password@your-project.supabase.co:5432/postgres"
     ```

5. **Set up the database**:
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

7. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)

### Project Structure

```
/app
  /api          # API routes
  /topics       # Topic pages
  /dashboard   # Dashboard page
  /timeline     # Timeline view
  /calendar     # Calendar view
/components
  /topics       # Topic components
  /resources    # Resource components
  /progress     # Progress components
  /layout       # Layout components
  /ui           # Reusable UI components
/lib
  /db           # Database client
  /types        # TypeScript types
  /utils        # Utility functions
/prisma
  schema.prisma # Database schema
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` - Your Supabase connection string
4. Deploy!

The app will automatically deploy on every push to the main branch.

## Database Schema

The application uses the following main tables:

- **topics**: Learning topics with proficiency levels
- **resources**: Learning resources (books, courses, etc.)
- **progress_updates**: Proficiency level updates over time
- **activity_logs**: Activity tracking for all changes

All tables include comprehensive timestamp tracking (created_at, updated_at, etc.).

## License

MIT


