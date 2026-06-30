/**
 * Rules 数据源 — 后续可替换为 rules.json + fetch 加载
 *
 * 字段说明：
 *   id          唯一标识
 *   title       规则标题
 *   tool        适用编辑器：Cursor | Windsurf
 *   category    业务分类
 *   framework   技术栈 / 框架
 *   description 一句话简介
 *   tags        搜索标签
 *   content     规则正文（Markdown）
 */
window.RULES_DATA = [
  {
    id: 'nextjs-fullstack',
    title: 'Next.js Full-Stack Development Rules',
    tool: 'Cursor',
    category: 'Fullstack',
    framework: 'Next.js',
    frameworks: ['Next.js', 'React', 'TypeScript'],
    description: 'Best practices for App Router, Server Actions, and strict TypeScript.',
    tags: ['Next.js', 'React', 'TypeScript'],
    content: `# Next.js Full-Stack Development Rules

You are an expert Next.js 14+ developer using App Router.

## Architecture
- Use App Router with \`app/\` directory structure
- Prefer Server Components by default; add "use client" only when needed
- Use Server Actions for mutations instead of API routes when possible
- Colocate related files: \`page.tsx\`, \`loading.tsx\`, \`error.tsx\`, \`layout.tsx\`

## TypeScript
- Enable strict mode; never use \`any\`
- Define explicit types for props, API responses, and form data
- Use \`zod\` for runtime validation of external data

## Data Fetching
- Fetch in Server Components with native \`fetch\` and cache options
- Use \`revalidatePath\` / \`revalidateTag\` after mutations
- Avoid client-side fetching for initial page data

## Styling
- Use Tailwind CSS with consistent design tokens
- Implement responsive mobile-first layouts

## Performance
- Use \`next/image\` for all images with proper \`sizes\` attribute
- Lazy load heavy client components with \`dynamic()\`
- Minimize client bundle size`
  },
  {
    id: 'python-scraper',
    title: 'Python Web Scraping Rules',
    tool: 'Windsurf',
    category: 'Backend / API',
    framework: 'Python',
    description: 'Ethical, robust, and maintainable Python data collection and parsing.',
    tags: ['Python', 'Scrapy', 'BeautifulSoup'],
    content: `# Python Web Scraping Rules

You are an expert Python developer specializing in ethical web scraping.

## Ethics & Compliance
- Always check and respect \`robots.txt\`
- Add reasonable delays between requests (1-3 seconds minimum)
- Set a descriptive User-Agent with contact info
- Never scrape personal data without explicit permission

## Libraries
- Prefer \`httpx\` or \`requests\` with \`tenacity\` for retries
- Use \`BeautifulSoup4\` or \`lxml\` for HTML parsing
- Use \`Scrapy\` for large-scale crawling projects

## Code Quality
- Type hints on all functions (\`from __future__ import annotations\`)
- Separate fetch, parse, and store logic into modules
- Log errors with \`logging\` module, not print()
- Handle HTTP errors, timeouts, and rate limits gracefully

## Data Storage
- Save to structured formats: JSON, CSV, or SQLite
- Include timestamps and source URLs in every record
- Deduplicate by unique identifiers before persisting

## Testing
- Write unit tests for parsing logic with saved HTML fixtures
- Mock HTTP responses; never hit live sites in CI`
  },
  {
    id: 'supabase-db',
    title: 'Supabase Database Rules',
    tool: 'Cursor',
    category: 'Database / ORM',
    framework: 'Supabase',
    description: 'Row Level Security, Edge Functions, and Postgres best practices.',
    tags: ['Supabase', 'PostgreSQL', 'RLS'],
    content: `# Supabase Database Rules

You are an expert Supabase and PostgreSQL developer.

## Security
- ALWAYS enable Row Level Security (RLS) on every public table
- Write explicit RLS policies; never rely on service role in client code
- Use \`auth.uid()\` in policies for user-scoped data
- Store secrets in Supabase Vault or environment variables only

## Schema Design
- Use UUID primary keys with \`gen_random_uuid()\`
- Add \`created_at\` and \`updated_at\` timestamps to all tables
- Use foreign keys with \`ON DELETE CASCADE\` or \`SET NULL\` explicitly
- Create indexes for columns used in WHERE/JOIN clauses

## Client Usage
- Use \`@supabase/supabase-js\` v2 with typed Database interface
- Generate types with \`supabase gen types typescript\`
- Prefer \`.select()\` with explicit columns over \`select('*')\`

## Edge Functions
- Write Deno Edge Functions for server-side logic
- Validate JWT and user permissions inside functions
- Return structured JSON errors with appropriate HTTP status codes

## Migrations
- All schema changes via SQL migration files in \`supabase/migrations/\`
- Never modify production schema manually`
  },
  {
    id: 'tailwind-ui',
    title: 'Tailwind UI Design Rules',
    tool: 'Cursor',
    category: 'Frontend / UI',
    framework: 'Tailwind CSS',
    description: 'Modern UI design systems, motion, and accessibility guidelines.',
    tags: ['Tailwind CSS', 'UI/UX', 'A11y'],
    content: `# Tailwind CSS UI Design Rules

You are an expert frontend developer focused on beautiful, accessible UIs.

## Design System
- Define a consistent color palette using Tailwind config extend
- Use semantic spacing scale (4, 8, 12, 16, 24, 32, 48, 64)
- Limit to 2-3 font sizes per component hierarchy
- Prefer rounded-lg / rounded-xl for modern feel

## Layout
- Mobile-first: start with base styles, add sm/md/lg breakpoints
- Use CSS Grid for complex layouts, Flexbox for component internals
- Maintain consistent max-width containers (max-w-7xl mx-auto)

## Components
- Build reusable components with \`@apply\` sparingly; prefer utility classes
- Use \`group\` and \`peer\` for interactive hover/focus states
- Implement dark mode with \`dark:\` variant consistently

## Accessibility
- All interactive elements must be keyboard navigable
- Use semantic HTML: \`<button>\`, \`<nav>\`, \`<main>\`, \`<article>\`
- Include \`aria-label\` on icon-only buttons
- Maintain WCAG AA contrast ratios (4.5:1 for text)

## Animation
- Use \`transition-all duration-200\` for micro-interactions
- Prefer \`transform\` and \`opacity\` for GPU-accelerated animations
- Respect \`prefers-reduced-motion\` media query`
  },
  {
    id: 'react-native',
    title: 'React Native Mobile Development Rules',
    tool: 'Windsurf',
    category: 'Frontend / UI',
    framework: 'React Native',
    frameworks: ['React Native', 'Expo'],
    description: 'Expo workflows, cross-platform components, and native module integration.',
    tags: ['React Native', 'Expo', 'Mobile'],
    content: `# React Native Development Rules

You are an expert React Native developer using Expo.

## Project Structure
- Use Expo Router for file-based navigation
- Separate \`components/\`, \`hooks/\`, \`services/\`, \`stores/\`
- Keep platform-specific code in \`.ios.tsx\` / \`.android.tsx\` files

## Performance
- Use \`FlatList\` with \`keyExtractor\`, \`getItemLayout\` for long lists
- Memoize expensive components with \`React.memo\` and \`useCallback\`
- Avoid anonymous functions in render props
- Use \`react-native-reanimated\` for animations

## Styling
- Use StyleSheet.create() for static styles
- Support both light and dark themes via context
- Test on both iOS and Android simulators

## State Management
- Use Zustand or TanStack Query for server state
- Keep local UI state in components with useState
- Persist auth tokens with expo-secure-store

## Native Modules
- Prefer Expo SDK modules over bare native modules
- Document any config plugin requirements in README`
  },
  {
    id: 'go-api',
    title: 'Go Microservice API Rules',
    tool: 'Windsurf',
    category: 'Backend / API',
    framework: 'Go',
    description: 'RESTful design, error handling, and high-performance Go backend patterns.',
    tags: ['Go', 'REST API', 'Microservices'],
    content: `# Go Microservice API Rules

You are an expert Go backend developer.

## Project Layout
- Follow standard layout: \`cmd/\`, \`internal/\`, \`pkg/\`, \`api/\`
- Keep business logic in \`internal/\`; expose only public APIs in \`pkg/\`
- Use \`go mod\` with pinned dependency versions

## API Design
- RESTful endpoints with consistent naming (\`/api/v1/resources\`)
- Return JSON with consistent envelope: \`{"data": ..., "error": null}\`
- Use appropriate HTTP status codes (201 Created, 204 No Content, etc.)
- Version APIs in URL path

## Error Handling
- Wrap errors with context using \`fmt.Errorf("context: %w", err)\`
- Define custom error types for domain errors
- Log errors at the handler layer, not in repositories
- Never expose internal error details to clients

## Performance
- Use connection pooling for database (\`sql.DB\`)
- Context propagation with \`context.Context\` for all I/O
- Profile with \`pprof\` before optimizing

## Testing
- Table-driven tests for all business logic
- Use \`testify\` for assertions
- Integration tests with testcontainers for DB tests`
  },
  {
    id: 'rust-systems',
    title: 'Rust Systems Programming Rules',
    tool: 'Cursor',
    category: 'Backend / API',
    framework: 'Rust',
    description: 'Memory safety, concurrency, and Cargo ecosystem best practices.',
    tags: ['Rust', 'Systems', 'Performance'],
    content: `# Rust Systems Programming Rules

You are an expert Rust developer focused on safe, performant systems code.

## Ownership & Safety
- Prefer borrowing over cloning; use \`.clone()\` only when necessary
- Use \`Result<T, E>\` for recoverable errors; \`panic!\` only for bugs
- Leverage the type system: newtypes, enums over strings

## Concurrency
- Use \`tokio\` for async I/O; \`rayon\` for CPU-bound parallelism
- Prefer \`Arc<Mutex<T>>\` or channels over shared mutable state
- Document Send/Sync requirements for public types

## Code Style
- Follow Rust API Guidelines (rust-lang.github.io/api-guidelines)
- Use \`clippy\` and \`rustfmt\` on every commit
- Document public APIs with \`///\` doc comments and examples

## Dependencies
- Minimize dependencies; prefer std when sufficient
- Audit crates with \`cargo audit\`
- Pin versions in Cargo.lock for reproducible builds

## Testing
- Unit tests in same file with \`#[cfg(test)]\`
- Integration tests in \`tests/\` directory
- Use \`proptest\` for property-based testing of parsers`
  },
  {
    id: 'ai-ml-python',
    title: 'Python AI/ML Engineering Rules',
    tool: 'Windsurf',
    category: 'AI Agent / RAG',
    framework: 'OpenAI API',
    frameworks: ['OpenAI API', 'PyTorch'],
    description: 'PyTorch workflows, data pipelines, and model deployment patterns.',
    tags: ['Python', 'PyTorch', 'ML Ops'],
    content: `# Python AI/ML Engineering Rules

You are an expert ML engineer using Python and PyTorch.

## Code Organization
- Separate data loading, training, evaluation, and inference modules
- Use Hydra or YAML configs for hyperparameters
- Version datasets and models with DVC or MLflow

## Training
- Set random seeds for reproducibility (torch, numpy, random)
- Log metrics to TensorBoard or W&B every epoch
- Implement early stopping and checkpoint saving
- Use mixed precision (AMP) for GPU training

## Data Pipeline
- Use PyTorch DataLoader with num_workers > 0
- Apply transforms in dataset __getitem__, not in training loop
- Validate data shapes and dtypes at pipeline entry

## Model Deployment
- Export to ONNX or TorchScript for production
- Write inference API with FastAPI and Pydantic schemas
- Include input/output preprocessing in the served model

## Best Practices
- Never train on test set; use proper train/val/test splits
- Document model assumptions and limitations
- Write unit tests for preprocessing functions`
  },
  {
    id: 'fastapi-backend',
    title: 'FastAPI Backend Rules',
    tool: 'Windsurf',
    category: 'Backend / API',
    framework: 'FastAPI',
    frameworks: ['FastAPI', 'Python'],
    description: 'Async routes, Pydantic validation, and OpenAPI documentation for Python APIs.',
    tags: ['FastAPI', 'Python', 'Pydantic', 'Async'],
    content: `# FastAPI Backend Rules

You are an expert Python backend developer using FastAPI.

## Project Structure
- Organize as \`app/routers/\`, \`app/services/\`, \`app/models/\`, \`app/schemas/\`
- Keep route handlers thin; business logic lives in services
- Use dependency injection via \`Depends()\`

## API Design
- Define request/response schemas with Pydantic v2 models
- Use path operations with explicit \`response_model\` and status codes
- Version APIs under \`/api/v1/\`
- Auto-generate OpenAPI docs; keep summaries and descriptions accurate

## Async & Performance
- Use \`async def\` for I/O-bound handlers
- Pool database connections with SQLAlchemy async or asyncpg
- Avoid blocking calls inside async routes

## Security
- Validate all inputs with Pydantic; never trust client data
- Use OAuth2 / JWT via \`fastapi.security\`
- Never log secrets, tokens, or full request bodies

## Testing
- Use \`TestClient\` from \`httpx\` for integration tests
- Mock external services in unit tests
- Test error responses and validation failures explicitly`
  },
  {
    id: 'vue-nuxt-frontend',
    title: 'Vue / Nuxt Frontend Rules',
    tool: 'Cursor',
    category: 'Frontend / UI',
    framework: 'Vue',
    frameworks: ['Vue', 'Nuxt'],
    description: 'Composition API, Nuxt 3 SSR, and Pinia state management patterns.',
    tags: ['Vue', 'Nuxt', 'Pinia', 'TypeScript'],
    content: `# Vue / Nuxt Frontend Rules

You are an expert Vue 3 and Nuxt 3 developer.

## Vue 3
- Use Composition API with \`<script setup lang="ts">\`
- Prefer \`ref\` / \`computed\` / \`watch\` over Options API
- Define props with \`defineProps\` and emits with \`defineEmits\`
- Extract reusable logic into composables under \`composables/\`

## Nuxt 3
- Use file-based routing in \`pages/\` and layouts in \`layouts/\`
- Fetch data with \`useFetch\` / \`useAsyncData\` in setup
- Server-render by default; use \`.client.vue\` suffix only when needed
- Configure runtime config via \`nuxt.config.ts\` and \`.env\`

## State & Styling
- Use Pinia for global state; avoid prop drilling
- Style with scoped CSS or Tailwind; keep components small and focused

## Performance
- Lazy load routes and heavy components with \`defineAsyncComponent\`
- Optimize images with \`<NuxtImg>\`
- Avoid unnecessary reactivity on large static objects`
  },
  {
    id: 'docker-devops',
    title: 'Docker Containerization Rules',
    tool: 'Cursor',
    category: 'DevOps / Deployment',
    framework: 'Docker',
    description: 'Multi-stage builds, image optimization, and docker-compose local development.',
    tags: ['Docker', 'DevOps', 'CI/CD', 'Compose'],
    content: `# Docker & Container Rules

You are an expert DevOps engineer specializing in Docker workflows.

## Dockerfile
- Use multi-stage builds to minimize final image size
- Pin base image tags (avoid \`latest\`)
- Run containers as non-root user when possible
- Order layers: dependencies first, source code last (cache-friendly)
- Add \`.dockerignore\` to exclude node_modules, .git, secrets

## Images
- One process per container
- Use health checks with \`HEALTHCHECK\` or orchestrator probes
- Never bake secrets into images; inject via env or secrets manager

## docker-compose
- Define services, networks, and volumes explicitly
- Use \`.env\` for local overrides; document required variables
- Mount source for dev; copy source for prod builds

## CI/CD
- Build and scan images in CI (\`docker scout\` or Trivy)
- Tag images with git SHA, not only \`latest\`
- Push to registry only after tests pass`
  },
  {
    id: 'typescript-general',
    title: 'TypeScript General Development Rules',
    tool: 'Windsurf',
    category: 'Code Quality / Security',
    framework: 'TypeScript',
    frameworks: ['TypeScript', 'ESLint'],
    description: 'Strict typing, generic constraints, and maintainable TypeScript codebases.',
    tags: ['TypeScript', 'ESLint', 'Strict Mode'],
    content: `# TypeScript General Development Rules

You are an expert TypeScript developer.

## Compiler & Config
- Enable \`strict\`, \`noUncheckedIndexedAccess\`, \`exactOptionalPropertyTypes\`
- Use \`moduleResolution: "bundler"\` or \`"node16"\` consistently
- Prefer \`interface\` for object shapes; \`type\` for unions and utilities

## Types
- Never use \`any\`; use \`unknown\` and narrow with type guards
- Prefer \`const\` assertions and \`satisfies\` for inference
- Export public types from a dedicated \`types/\` module
- Use generics with constraints, not unconstrained \`<T>\`

## Code Style
- Use explicit return types on exported functions
- Avoid enum; prefer \`as const\` objects or union types
- Use optional chaining and nullish coalescing over nested checks

## Tooling
- Run ESLint + Prettier on save and in CI
- Use \`tsc --noEmit\` in CI before build
- Document non-obvious types with JSDoc on public APIs`
  }
];
