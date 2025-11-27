# Haalarikone

**Haalarikone** is Finland's easiest overall database – a unique way to explore Finnish student culture through colors. Find out what color overall a student in a specific field wears!

## Overview

- **What it does:**  
  It helps you identify students' fields based on their signature overall colors.

- **Explore culture:**  
  Discover and learn about the colorful traditions of Finnish student life.

## Live Site

Check out the live project at: [haalarikone.fi](https://haalarikone.fi)

## Tech Stack

- **Framework:** Next.js 15 (App Router) with React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS with Radix UI components
- **Database:** Supabase (PostgreSQL)
- **Search:** Upstash Search
- **Rate Limiting:** Upstash Redis
- **Testing:** Playwright
- **Package Manager:** pnpm
- **Deployment:** Vercel (assumed)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (LTS version recommended)
- **pnpm** (package manager)
- **Git**

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/haalarikone.git
cd haalarikone
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Upstash Search
UPSTASH_SEARCH_REST_URL=your_upstash_search_url
UPSTASH_SEARCH_REST_TOKEN=your_upstash_search_token

# Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

**Note:** Set up your own Supabase and Upstash instances.

### 4. Run the Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### 5. Run Tests

```bash
pnpm test
```

To view the test report:

```bash
pnpm exec playwright show-report
```

## Project Structure

```
student-overall-app/
├── app/                    # Next.js App Router pages
│   ├── (auth-pages)/      # Authentication pages (sign-in, sign-up, etc.)
│   ├── api/               # API routes
│   ├── ala/               # Field pages
│   ├── alue/              # Area pages
│   ├── blog/              # Blog posts
│   ├── haalari/           # Overall detail pages
│   ├── oppilaitos/        # University pages
│   └── vari/              # Color pages
├── components/            # React components
│   ├── ui/                # Reusable UI components (Radix UI)
│   └── ...                # Feature components
├── content/               # Blog post content (JSON)
├── data/                  # Static data files
├── lib/                   # Utility functions and helpers
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
│   └── supabase/          # Supabase client utilities
└── tests/                 # Playwright tests
```

## Available Scripts

- `pnpm run dev` - Start development server with Turbopack
- `pnpm run build` - Build production bundle with Turbopack
- `pnpm run start` - Start production server
- `pnpm test` - Run Playwright tests

## Development Guidelines

### Code Style

- **TypeScript:** Strict mode enabled
- **Formatting:** Prettier (configured)
- **Linting:** TypeScript compiler checks
- **Comments:** Minimal comments (per project preferences)

### Component Structure

- Use functional components with TypeScript
- Prefer server components when possible (Next.js App Router)
- Client components should be marked with `"use client"` directive
- Use path aliases (`@/`) for imports

### Styling

- Use Tailwind CSS utility classes
- Custom components in `components/ui/` use Radix UI primitives
- Theme support via `next-themes`

## Testing

Tests are written using Playwright and located in the `tests/` directory. The test configuration runs tests against Chromium, Firefox, and WebKit.

To run tests in a specific browser:

```bash
pnpm exec playwright test --project=chromium
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute to this project.

## Contact

For any questions or feedback, feel free to reach out:

- **Email:** [savonen.emppu@gmail.com](mailto:savonen.emppu@gmail.com)
- **GitHub:** [@valtterisa](https://github.com/valtterisa)

## License

See [LICENSE](./LICENSE) file for details.

---

Made by [@valtterisa](https://github.com/valtterisa)
