1. api 요청할떄 별도로 api 라우트를 만들어야 함
2. api 라우트에서 supabase client를 사용할때는 await createClient()를 사용해야 함
3. supabase를 쓸때는 가급적 mcp로 테이블 확인 필요


# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered business report generation service built with Next.js 15, React 19, and Supabase. Users can generate professional business reports in 5 minutes through AI assistance, receive automated diagnosis, and request expert feedback.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Production server
npm start

# Linting
npm run lint
```

## Architecture & Key Patterns

### Route Groups & Application Structure

The application uses Next.js App Router with distinct route groups:

- **`app/(client)/`** - Customer-facing pages (report creation, review, mypage)
- **`app/(admin)/`** - Admin dashboard and management
- **`app/api/`** - API Route Handlers for all backend operations

Each route group has its own layout and authentication flow. Route groups don't affect the URL structure but organize the codebase logically.

### Supabase Client Usage Pattern

**Critical**: Always use the correct Supabase client for the context:

```typescript
// Server Components & Server Actions
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();

// Client Components
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

// API Route Handlers
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();
```

The server client is async and must be awaited. Never put server clients in global variables - always create new instances within functions.

### Authentication Flow

Authentication uses Supabase Auth with session management handled by middleware:

1. Middleware (`middleware.ts`) calls `updateSession()` on every request
2. Server components check auth via `supabase.auth.getUser()`
3. Client components use `supabase.auth.onAuthStateChange()` for reactive updates
4. Admin routes require specific role checks

**Admin Login**: Uses custom `/api/admin/login` endpoint, redirects to `/admin/dashboard` on success.

**Client Auth**: Uses Supabase OAuth callback at `/api/auth/callback`.

### API Route Handler Patterns

All API routes follow this structure:

```typescript
export async function GET/POST/PUT/DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params is async
) {
  const supabase = await createClient();
  const { id } = await params; // Always await params

  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Database operations
  const { data, error } = await supabase.from("table_name")...

  // Return JSON response
  return NextResponse.json({ success: true, data });
}
```

**Never use Server Actions** - all backend logic goes through Route Handlers.

### Database Schema (Key Tables)

- **`report_create`** - Main reports table
  - `uuid` (primary key, auto-generated)
  - `user_id` - Foreign key to auth.users
  - `title`, `business_field`
  - `step` - Current workflow step (inputs, procedure, editor, review)
  - `is_complete` - Boolean for completion status
  - `created_at` - Timestamp for filtering

- **`profiles`** - Extended user information
- **`expert_requests`** - Expert evaluation requests

### State Management with Zustand

Global state uses Zustand stores located in `components/store/` or page-specific `components/store/`:

```typescript
import { create } from 'zustand';

interface StoreState {
  value: string;
  setValue: (value: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  value: '',
  setValue: (value) => set({ value }),
}));
```

Use Zustand for:
- Report workflow state
- Multi-step form data
- Cross-component shared state

Use React state for:
- Component-local UI state
- Form inputs (prefer react-hook-form)

### Form Validation Pattern

Forms use react-hook-form + zod:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  field: z.string().min(1, "Required"),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
  mode: "onChange", // Real-time validation
});
```

### Component Architecture

**Server Components (default)**: Use for pages and layouts. Fetch data directly with async/await.

**Client Components**: Only when needed for:
- User interactions (onClick, onChange)
- Hooks (useState, useEffect, useRouter)
- Browser APIs
- Third-party libraries requiring browser context

Mark with `"use client"` at the top of the file.

**Component Organization**:
```
page/
├── page.tsx          # Server Component (page entry)
├── layout.tsx        # Layout wrapper
└── components/       # Page-specific components
    ├── ClientComponent.tsx  # "use client"
    └── store/        # Page-specific Zustand stores
```

Shared components go in `components/ui/` (shadcn/ui) or `components/` (custom shared).

### UI Component Guidelines

**shadcn/ui components** are in `components/ui/`:
- Button, Input, Dialog, Card, Checkbox, Select, etc.
- **Do not modify** these directly
- Create wrapper components or use composition

**Custom reusable components**:
- `FilterDropdown.tsx` - Dropdown filter
- `SearchInputWithFilter.tsx` - Combined search + filter
- `Pagination.tsx` - Page navigation
- `DateEdit.tsx` - Date input (uses useRef pattern)
- `CustomModal.tsx` - Modal wrapper with custom styling

### Critical Rules & Constraints

1. **Never use `throw` statements** - Handle errors with conditional returns
2. **Never use `console.error`** - Use `console.log` or remove
3. **Never use `@supabase/auth-helpers-nextjs`** - Use `@supabase/ssr` instead
4. **Wrap Suspense** around components using `useSearchParams()` or `usePathname()`
5. **Always await params** in route handlers: `const { id } = await params`
6. **PascalCase for file names** - All component files use PascalCase (e.g., `AdminHeader.tsx`)

### Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_anon_key
```

Note: The env var name differs from typical Supabase setup - uses `PUBLISHABLE_OR_ANON_KEY` instead of `ANON_KEY`.

### Report Generation Workflow

Multi-step process tracked via `step` field in `report_create`:

1. **start** - Initial setup (title, business field)
2. **inputs** - Detailed business information input
3. **procedure** - Report generation in progress
4. **editor** - User editing generated content
5. **review** - Final review and export

Each step has dedicated page under `app/(client)/report/[step]/`.

### TipTap Editor Integration

Rich text editor for report content:

```typescript
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const editor = useEditor({
  extensions: [
    StarterKit,
    Image,
    Link,
    Underline,
    // Custom extensions
  ],
  content: initialContent,
});
```

Located in `app/(client)/report/editor/`.

### Word Document Export

Uses `docx` library (`app/api/download-word/`):
- Converts HTML/JSON to .docx format
- Preserves formatting, images, tables
- Handles Korean fonts properly

## Common Patterns

### Date Filtering (Today's Records)

```typescript
const today = new Date();
today.setHours(0, 0, 0, 0);
const todayStart = today.toISOString();

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const todayEnd = tomorrow.toISOString();

const { data } = await supabase
  .from("report_create")
  .select("*")
  .gte("created_at", todayStart)
  .lt("created_at", todayEnd);
```

### Real-time Updates

```typescript
useEffect(() => {
  const supabase = createClient();

  const channel = supabase
    .channel('table-changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'report_create' },
      (payload) => {
        // Handle changes
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

### Password Change with Supabase

```typescript
const { error } = await supabase.auth.updateUser({
  password: newPassword,
});
```

## Testing & Debugging

- No formal test suite currently
- Use browser DevTools and Network tab
- Check Supabase logs for database errors
- Enable verbose logging in development

## Key Dependencies

- **Next.js 15** - App Router, Server Components
- **React 19** - Latest React features
- **Supabase** - Auth + Database (@supabase/ssr)
- **TipTap** - Rich text editor
- **Zustand** - State management
- **react-hook-form + zod** - Form validation
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **docx** - Word document generation
- **OpenAI SDK** - AI report generation

## File Naming Conventions

- Components: PascalCase (`AdminHeader.tsx`, `ReportCard.tsx`)
- Pages: lowercase (`page.tsx`, `layout.tsx`)
- Utils/Libs: camelCase (`utils.ts`, `supabase/client.ts`)
- Types: PascalCase or match component name

## Additional Notes

- Turbopack is enabled by default in dev mode
- Image optimization uses `next/image` with configured domains
- Responsive design targets desktop-first, mobile adaptive
- Korean language support throughout UI
