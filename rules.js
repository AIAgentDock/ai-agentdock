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
 *   source      来源 { label, url? } — e.g. { label: 'GitHub', url: 'https://...' }
 *   license     许可证名称 — e.g. 'MIT'
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
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
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
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
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
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
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
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
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
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
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
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
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
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
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
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
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
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
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
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
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
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
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
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
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
  },
  {
    id: 'mcp-server',
    title: 'MCP Server Development Rules',
    tool: 'Cursor',
    category: 'AI Agent / RAG',
    framework: 'MCP',
    frameworks: ['MCP', 'TypeScript', 'Node.js'],
    description: 'Build Model Context Protocol servers with typed tools, resources, and secure transport.',
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
    tags: ['MCP', 'Cursor', 'Agent', 'TypeScript'],
    content: `# MCP Server Development Rules

You are an expert MCP (Model Context Protocol) server developer.

## Architecture
- One MCP server per domain (database, git, APIs) — keep tools focused
- Expose tools with clear names, JSON Schema inputs, and human-readable descriptions
- Use stdio transport for local dev; SSE or streamable HTTP for remote
- Validate all tool inputs before side effects

## TypeScript / Node.js
- Use \`@modelcontextprotocol/sdk\` with strict TypeScript
- Define Zod or JSON Schema for every tool parameter
- Return structured content blocks (text, image, resource) consistently
- Log errors to stderr; never crash the server on bad client input

## Security
- Never expose secrets in tool responses or resource URIs
- Scope file-system tools to allowed directories
- Authenticate remote transports; rate-limit tool calls
- Document required env vars in README

## Testing
- Unit test tool handlers with mocked context
- Integration test with MCP inspector or test client
- Document each tool with example invocations`
  },
  {
    id: 'cursor-agent-skills',
    title: 'Cursor Agent & Skills Rules',
    tool: 'Cursor',
    category: 'Documentation / Productivity',
    framework: 'General',
    frameworks: ['Cursor', 'Agent', 'Skills'],
    description: 'Guide Cursor Agent behavior, Skills usage, and safe autonomous coding workflows.',
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
    tags: ['Cursor', 'Agent', 'Skills', 'MCP'],
    content: `# Cursor Agent & Skills Rules

You are an expert Cursor user configuring Agent mode and Skills.

## Agent Behavior
- Read relevant files before editing; prefer minimal, focused diffs
- Run tests or linters after substantive changes when available
- Ask before destructive operations (deletes, force push, schema drops)
- Summarize what changed and why at the end of each task

## Skills
- Use Skills for repeatable workflows (deploy, review, migrate)
- Keep Skill instructions concise and step-oriented
- Reference project conventions from rules, not duplicated prose
- Prefer existing project scripts over inventing new tooling

## Rules Integration
- Place project rules in \`.cursor/rules/\` as \`.mdc\` or markdown
- Scope rules with globs when they apply to subfolders only
- Trim rule length to fit context — link to docs for details

## Safety
- Never commit secrets, API keys, or .env contents
- Do not disable security checks without explicit user approval
- Verify file paths exist before writing`
  },
  {
    id: 'langchain-rag',
    title: 'LangChain RAG Application Rules',
    tool: 'Windsurf',
    category: 'AI Agent / RAG',
    framework: 'LangChain',
    frameworks: ['LangChain', 'RAG', 'OpenAI API', 'Python'],
    description: 'Retrieval-augmented generation pipelines, chunking, embeddings, and evaluation.',
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
    tags: ['LangChain', 'RAG', 'Vector Database', 'Python'],
    content: `# LangChain RAG Application Rules

You are an expert building RAG apps with LangChain and Python.

## Pipeline Design
- Separate ingestion, indexing, retrieval, and generation stages
- Chunk documents with overlap (10–20%); preserve metadata (source, page)
- Choose embedding model consistent between index and query time
- Store metadata filters for tenant or document-type scoping

## Retrieval
- Start with top-k=5–10; tune with MMR or rerankers if needed
- Log retrieval scores and source IDs for debugging
- Fail gracefully when no relevant chunks exceed threshold
- Cite sources in generated answers when possible

## Generation
- Use system prompts that forbid hallucinating beyond context
- Pass only retrieved chunks + user query to the LLM
- Stream responses for UX; handle token limits with map-reduce if needed

## Evaluation
- Maintain a golden Q&A set for regression testing
- Track faithfulness, relevance, and latency metrics
- Version indexes and embedding models in config`
  },
  {
    id: 'vercel-ai-sdk',
    title: 'Vercel AI SDK Rules',
    tool: 'Cursor',
    category: 'AI Agent / RAG',
    framework: 'Vercel AI SDK',
    frameworks: ['Vercel AI SDK', 'Next.js', 'React', 'TypeScript'],
    description: 'Streaming chat UIs, tool calling, and server-side AI routes with Vercel AI SDK.',
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
    tags: ['Vercel AI SDK', 'Next.js', 'Streaming', 'Tools'],
    content: `# Vercel AI SDK Rules

You are an expert using the Vercel AI SDK in Next.js apps.

## Server Routes
- Call \`streamText\` / \`generateText\` in Route Handlers or Server Actions
- Keep API keys in server env only — never expose to client
- Define tools with Zod schemas; validate tool args server-side
- Set reasonable \`maxSteps\` for agent loops

## Client UI
- Use \`useChat\` / \`useCompletion\` with proper error and loading states
- Render streaming tokens incrementally; support abort via AbortSignal
- Persist thread IDs server-side for multi-turn conversations

## Models
- Pin model IDs in config; document fallback behavior
- Handle rate limits and provider errors with user-friendly messages
- Log token usage in development for cost awareness

## Security
- Authenticate chat endpoints; rate-limit per user
- Sanitize user input before sending to models
- Do not stream internal errors or stack traces to clients`
  },
  {
    id: 'playwright-e2e',
    title: 'Playwright E2E Testing Rules',
    tool: 'Cursor',
    category: 'Testing / QA',
    framework: 'Playwright',
    frameworks: ['Playwright', 'TypeScript', 'Testing Library'],
    description: 'Reliable end-to-end tests with Playwright — selectors, fixtures, and CI patterns.',
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
    tags: ['Playwright', 'E2E', 'Testing', 'CI/CD'],
    content: `# Playwright E2E Testing Rules

You are an expert Playwright test engineer.

## Test Design
- Prefer role and text locators over CSS/XPath (\`getByRole\`, \`getByLabel\`)
- One logical assertion focus per test; use test.describe for grouping
- Avoid hard-coded waits — use auto-waiting and \`expect\` polling
- Seed test data via API or fixtures, not manual UI setup when possible

## Structure
- Use Page Object Model for shared flows (login, checkout)
- Store auth state in \`storageState\` for logged-in suites
- Keep tests independent; reset state in beforeEach when needed

## CI
- Run headless in CI with retries on flaky network only
- Capture trace, screenshot, and video on first failure
- Shard tests across workers for speed
- Block merge on critical @smoke suite

## Stability
- Mock external third-party services in E2E when feasible
- Use \`test.fixme\` with linked issue for known flakes
- Never disable tests without ticket and owner`
  },
  {
    id: 'vitest-unit',
    title: 'Vitest Unit Testing Rules',
    tool: 'Windsurf',
    category: 'Testing / QA',
    framework: 'Vitest',
    frameworks: ['Vitest', 'TypeScript', 'Testing Library'],
    description: 'Fast unit and component tests with Vitest, mocks, and coverage targets.',
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
    tags: ['Vitest', 'Unit Tests', 'TypeScript', 'React'],
    content: `# Vitest Unit Testing Rules

You are an expert writing tests with Vitest.

## Conventions
- Colocate tests as \`*.test.ts\` or \`__tests__/\` next to source
- Use \`describe\` / \`it\` with clear behavior-driven names
- Prefer \`vi.mock\` for modules; \`vi.spyOn\` for partial mocks
- Reset mocks in \`afterEach\` to prevent leakage

## React Components
- Use Testing Library — query by role/label, not implementation details
- Test user-visible behavior, not internal state
- Wrap with providers (router, query client) in test utils

## Coverage
- Target meaningful coverage on business logic (>80% on utils/services)
- Do not chase 100% on trivial getters or generated code
- Run \`vitest run --coverage\` in CI

## Performance
- Use \`test.concurrent\` only for isolated pure functions
- Avoid real network; mock fetch and DB layers
- Keep unit tests under 100ms each where possible`
  },
  {
    id: 'react-frontend',
    title: 'React Frontend Development Rules',
    tool: 'Cursor',
    category: 'Frontend / UI',
    framework: 'React',
    frameworks: ['React', 'TypeScript', 'Tailwind CSS'],
    description: 'Modern React patterns — hooks, composition, performance, and accessible components.',
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
    tags: ['React', 'Hooks', 'TypeScript', 'Frontend'],
    content: `# React Frontend Development Rules

You are an expert React 18+ developer.

## Components
- Functional components only; custom hooks for reusable logic
- Keep components small; single responsibility
- Colocate styles and tests with components
- Use TypeScript for all props and event handlers

## State
- Local UI state: \`useState\`; derived state: \`useMemo\`
- Server/async state: TanStack Query or similar
- Avoid prop drilling — context or composition for shared state
- Do not mirror props into state unnecessarily

## Performance
- Memoize expensive lists with \`React.memo\` and stable callbacks
- Virtualize long lists; lazy-load routes and heavy modals
- Profile before optimizing — avoid premature useMemo everywhere

## Accessibility
- Semantic HTML; keyboard support for custom widgets
- \`aria-*\` only when native semantics insufficient
- Focus management for modals and route changes`
  },
  {
    id: 'prisma-orm',
    title: 'Prisma ORM Rules',
    tool: 'Cursor',
    category: 'Database / ORM',
    framework: 'Prisma',
    frameworks: ['Prisma', 'PostgreSQL', 'TypeScript'],
    description: 'Schema design, migrations, typed queries, and Prisma Client best practices.',
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
    tags: ['Prisma', 'PostgreSQL', 'ORM', 'TypeScript'],
    content: `# Prisma ORM Rules

You are an expert Prisma and PostgreSQL developer.

## Schema
- Use meaningful model and field names; \`@@map\` for legacy table names
- Add \`@id\`, \`@default(cuid())\` or uuid, \`createdAt\`, \`updatedAt\`
- Define relations explicitly with \`onDelete\` behavior
- Index foreign keys and frequently filtered columns

## Migrations
- All changes via \`prisma migrate dev\`; commit migration SQL
- Never edit applied migrations in production
- Use \`prisma db seed\` for dev/test seed data

## Queries
- Use \`select\` / \`include\` intentionally — avoid over-fetching
- Transactions (\`$transaction\`) for multi-step writes
- Use Prisma Client extensions for cross-cutting concerns
- Handle \`PrismaClientKnownRequestError\` (P2002 unique, etc.)

## Performance
- Connection pooling in serverless (PgBouncer or Prisma Accelerate)
- Pagination with cursor-based \`take\` / \`skip\` or \`cursor\`
- Raw queries only when ORM cannot express efficiently`
  },
  {
    id: 'nodejs-express',
    title: 'Node.js Express API Rules',
    tool: 'Windsurf',
    category: 'Backend / API',
    framework: 'Express',
    frameworks: ['Node.js', 'Express', 'TypeScript'],
    description: 'REST APIs with Express — middleware, validation, error handling, and structure.',
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
    tags: ['Node.js', 'Express', 'REST API', 'TypeScript'],
    content: `# Node.js Express API Rules

You are an expert Node.js backend developer using Express.

## Structure
- Separate \`routes/\`, \`controllers/\`, \`services/\`, \`middleware/\`
- Thin route handlers — delegate logic to services
- Central error middleware; async errors via wrapper or Express 5

## Validation & Security
- Validate body/query/params with Zod or Joi before handlers
- Use helmet, cors with explicit origins, rate limiting
- Never log passwords or tokens; hash with bcrypt/argon2

## API Design
- RESTful resources; consistent JSON error shape \`{ error, code }\`
- HTTP status codes match semantics (400 validation, 404 not found)
- Version APIs under \`/api/v1\`

## Operations
- Health check endpoint \`/health\`
- Graceful shutdown on SIGTERM
- Structured logging (pino/winston) with request IDs`
  },
  {
    id: 'django-web',
    title: 'Django Web Application Rules',
    tool: 'Windsurf',
    category: 'Backend / API',
    framework: 'Django',
    frameworks: ['Django', 'Python', 'PostgreSQL'],
    description: 'Django 5 patterns — models, views, DRF APIs, and secure deployment.',
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
    tags: ['Django', 'Python', 'DRF', 'PostgreSQL'],
    content: `# Django Web Application Rules

You are an expert Django developer.

## Project Layout
- Split apps by domain (\`users\`, \`billing\`, \`core\`)
- Settings split: \`base.py\`, \`dev.py\`, \`prod.py\`
- Use custom User model from project start if needed

## Models & ORM
- Fat models, thin views — business logic in model methods or services
- \`select_related\` / \`prefetch_related\` to avoid N+1
- Database constraints in migrations, not only Python validation

## APIs (DRF)
- Serializers validate input; permissions on every viewset
- Pagination and filtering on list endpoints
- Use ViewSets + routers for CRUD; API versioning in URL

## Security
- \`DEBUG=False\` in production; strong \`SECRET_KEY\` from env
- CSRF on forms; JWT or session auth for APIs as appropriate
- Store media on S3-compatible storage, not local disk in prod`
  },
  {
    id: 'github-actions-ci',
    title: 'GitHub Actions CI/CD Rules',
    tool: 'Cursor',
    category: 'DevOps / Deployment',
    framework: 'GitHub Actions',
    frameworks: ['GitHub Actions', 'Docker', 'CI/CD'],
    description: 'Reusable workflows, caching, matrix builds, and secure CI pipelines.',
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
    tags: ['GitHub Actions', 'CI/CD', 'Docker', 'DevOps'],
    content: `# GitHub Actions CI/CD Rules

You are an expert GitHub Actions pipeline engineer.

## Workflow Design
- Trigger on \`pull_request\` and \`push\` to main only when needed
- Use concurrency groups to cancel stale runs on same branch
- Pin action versions to full SHAs or semver tags
- Split lint, test, and deploy into separate jobs

## Performance
- Cache dependencies (npm, pip, cargo) with lockfile keys
- Use path filters to skip jobs when unrelated files change
- Matrix for Node/Python versions; fail-fast optional for nightly

## Security
- Least-privilege \`permissions:\` at workflow level
- Secrets via GitHub Secrets; never echo secrets in logs
- Use OIDC for cloud deploy instead of long-lived keys when possible

## Deploy
- Deploy only from protected branches with required checks
- Tag Docker images with git SHA
- Manual approval gate for production environments`
  },
  {
    id: 'authjs-nextauth',
    title: 'Auth.js / NextAuth Rules',
    tool: 'Cursor',
    category: 'Code Quality / Security',
    framework: 'Auth.js',
    frameworks: ['Auth.js', 'NextAuth', 'Next.js', 'TypeScript'],
    description: 'Authentication with Auth.js — providers, sessions, middleware, and RBAC.',
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
    tags: ['Auth.js', 'NextAuth', 'OAuth', 'Security'],
    content: `# Auth.js / NextAuth Rules

You are an expert implementing auth with Auth.js in Next.js.

## Setup
- Use Auth.js v5 with \`auth.ts\` config and Route Handlers
- Store \`AUTH_SECRET\` in env; rotate on compromise
- Configure providers (Google, GitHub) with minimal scopes

## Sessions
- Prefer database or JWT sessions based on deployment model
- Extend session callback for roles and user ID
- Protect routes with middleware \`auth()\` wrapper

## Security
- CSRF built-in for Auth.js — do not bypass
- Validate session on every server action touching user data
- Implement RBAC in one \`authorize\` helper, reuse everywhere
- Never expose refresh tokens to client components

## UX
- Custom sign-in/error pages matching app design
- Redirect after login to intended URL safely (same-origin)`
  },
  {
    id: 'zod-validation',
    title: 'Zod Schema Validation Rules',
    tool: 'Windsurf',
    category: 'Code Quality / Security',
    framework: 'Zod',
    frameworks: ['Zod', 'TypeScript'],
    description: 'Runtime validation, inferred types, and API boundary schemas with Zod.',
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
    tags: ['Zod', 'Validation', 'TypeScript', 'API'],
    content: `# Zod Schema Validation Rules

You are an expert using Zod for runtime validation.

## Patterns
- Define schemas once; infer types with \`z.infer<typeof Schema>\`
- Compose with \`.merge\`, \`.pick\`, \`.omit\`, \`.extend\`
- Use \`.safeParse\` at boundaries; \`.parse\` only when failure is exceptional
- Custom errors with \`.refine\` and \`path\` for field-level messages

## API Boundaries
- Validate request body, query, and params at handler entry
- Return 400 with flattened \`fieldErrors\` for forms
- Share schemas between client and server in monorepo \`packages/shared\`

## Forms
- Integrate with react-hook-form \`zodResolver\`
- Coerce types (\`z.coerce.number\`) for HTML form strings
- Trim strings with \`.trim()\` on user input schemas

## Testing
- Test schemas with valid/invalid fixtures
- Snapshot error messages for critical validation rules`
  },
  {
    id: 'sveltekit-frontend',
    title: 'SvelteKit Frontend Rules',
    tool: 'Cursor',
    category: 'Frontend / UI',
    framework: 'Svelte',
    frameworks: ['Svelte', 'SvelteKit', 'TypeScript'],
    description: 'SvelteKit routing, load functions, forms, and progressive enhancement.',
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
    tags: ['Svelte', 'SvelteKit', 'SSR', 'TypeScript'],
    content: `# SvelteKit Frontend Rules

You are an expert SvelteKit developer.

## Routing & Data
- Use \`+page.server.ts\` load for server-only data; \`+page.ts\` for universal
- Form actions with \`use:enhance\` for progressive enhancement
- Invalidate data with \`invalidate\` / \`invalidateAll\` after mutations
- Type loads with \`PageServerLoad\`, \`Actions\`

## Components
- Prefer Svelte 5 runes (\`$state\`, \`$derived\`) in new code
- Keep components small; slots and snippets for composition
- Scoped styles by default; CSS variables for theming

## Performance
- Lazy-load heavy client components with dynamic import
- Preload data on hover with \`data-sveltekit-preload-data\`
- Optimize images; use adapter matching host (Vercel, Node)

## Security
- Never expose secrets in \`+page.ts\` loads sent to client
- CSRF protection on form actions is built-in — use it
- Sanitize user HTML if rendering rich content`
  },
  {
    id: 'postgresql-db',
    title: 'PostgreSQL Database Rules',
    tool: 'Windsurf',
    category: 'Database / ORM',
    framework: 'PostgreSQL',
    frameworks: ['PostgreSQL', 'SQL'],
    description: 'Schema design, indexing, queries, migrations, and Postgres-specific features.',
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
    tags: ['PostgreSQL', 'SQL', 'Database', 'Indexing'],
    content: `# PostgreSQL Database Rules

You are an expert PostgreSQL DBA and application developer.

## Schema Design
- Normalize to 3NF; denormalize deliberately with documented tradeoffs
- Use \`UUID\` or \`BIGSERIAL\` PKs; timestamptz for all timestamps
- Enforce constraints in DB (UNIQUE, FK, CHECK), not only app layer
- Name tables plural snake_case; columns snake_case

## Indexing
- Index FK columns and WHERE/JOIN columns
- Use partial indexes for filtered queries
- \`EXPLAIN ANALYZE\` before shipping slow queries
- Avoid over-indexing write-heavy tables

## Queries
- Parameterized queries only — no string concatenation
- Use CTEs for readability; window functions for analytics
- Limit result sets; paginate with keyset when possible

## Operations
- Migrations via Flyway, sqitch, or ORM migrate tools
- Regular VACUUM/ANALYZE; monitor bloat and connection counts
- Backups tested with restore drills`
  },
  {
    id: 'kubernetes-devops',
    title: 'Kubernetes Deployment Rules',
    tool: 'Cursor',
    category: 'DevOps / Deployment',
    framework: 'AWS',
    frameworks: ['Kubernetes', 'Docker', 'AWS'],
    description: 'K8s manifests, Helm, health probes, resources limits, and GitOps.',
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
    tags: ['Kubernetes', 'K8s', 'Helm', 'DevOps'],
    content: `# Kubernetes Deployment Rules

You are an expert Kubernetes platform engineer.

## Manifests
- One Deployment + Service per app; ConfigMaps/Secrets for config
- Set \`requests\` and \`limits\` on every container
- Liveness vs readiness probes — different endpoints and thresholds
- Use namespaces per environment or team

## Security
- Non-root containers; read-only root filesystem when possible
- NetworkPolicy for least-privilege pod communication
- Secrets from external manager (Sealed Secrets, ESO), not plain YAML in git
- Pin image digests in production

## GitOps
- Helm charts or Kustomize overlays per environment
- Argo CD / Flux for declarative deploys
- Rollback strategy documented; maxUnavailable tuned for zero-downtime

## Observability
- Structured logs to stdout; metrics on /metrics
- Distributed tracing headers propagated
- Alerts on error rate, latency p99, pod restarts`
  },
  {
    id: 'eslint-prettier',
    title: 'ESLint & Prettier Rules',
    tool: 'Windsurf',
    category: 'Code Quality / Security',
    framework: 'ESLint',
    frameworks: ['ESLint', 'Prettier', 'TypeScript'],
    description: 'Lint and format setup — flat config, CI integration, and team conventions.',
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
    tags: ['ESLint', 'Prettier', 'Linting', 'TypeScript'],
    content: `# ESLint & Prettier Rules

You are an expert configuring ESLint and Prettier for TypeScript projects.

## Setup
- ESLint flat config (\`eslint.config.js\`) with typescript-eslint
- Prettier for formatting; eslint-config-prettier to disable conflicts
- \`lint-staged\` + husky for pre-commit on changed files
- \`eslint . --max-warnings 0\` in CI

## Rules Philosophy
- Enforce \`no-unused-vars\`, \`no-explicit-any\`, import order
- Project-specific overrides in monorepo per package
- Disable rules only with comment explaining why

## Integration
- Editor format-on-save with Prettier default
- VS Code/Cursor ESLint extension for live diagnostics
- Share config in internal npm package for monorepos

## Do Not
- Debate style in PR — Prettier decides
- Commit with lint warnings unless explicitly waived`
  },
  {
    id: 'turborepo-monorepo',
    title: 'Turborepo Monorepo Rules',
    tool: 'Cursor',
    category: 'Documentation / Productivity',
    framework: 'Turborepo',
    frameworks: ['Turborepo', 'pnpm', 'Monorepo', 'TypeScript'],
    description: 'Monorepo structure, turbo pipelines, shared packages, and caching.',
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
    tags: ['Turborepo', 'Monorepo', 'pnpm', 'TypeScript'],
    content: `# Turborepo Monorepo Rules

You are an expert monorepo developer using Turborepo and pnpm.

## Structure
- \`apps/\` for deployables; \`packages/\` for shared libs
- \`packages/ui\`, \`packages/config-eslint\`, \`packages/tsconfig\`
- Workspace protocol \`workspace:*\` for internal deps
- One package.json per package; root for scripts only

## Turbo
- Define \`pipeline\` in \`turbo.json\` with \`dependsOn: ["^build"]\`
- Remote caching in CI for faster builds
- \`turbo run lint test build --filter=...\` for affected packages

## Dependencies
- Hoist shared deps at root when versions align
- No circular deps between packages — enforce with tooling
- Version internal packages together or with changesets

## CI
- Detect affected with \`turbo run ... --filter=[origin/main]\`
- Publish packages from dedicated release workflow`
  },
  {
    id: 'shadcn-ui',
    title: 'shadcn/ui Component Rules',
    tool: 'Cursor',
    category: 'Frontend / UI',
    framework: 'shadcn/ui',
    frameworks: ['shadcn/ui', 'React', 'Tailwind CSS', 'Radix UI'],
    description: 'Accessible UI components with shadcn/ui, Radix primitives, and Tailwind.',
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
    tags: ['shadcn/ui', 'Radix UI', 'Tailwind CSS', 'React'],
    content: `# shadcn/ui Component Rules

You are an expert building UIs with shadcn/ui and Radix primitives.

## Usage
- Components live in \`components/ui/\` — customize freely, not node_modules
- Add via CLI \`npx shadcn@latest add\`; keep cn() utility for class merging
- Extend variants with \`cva\` for consistent button/input sizes

## Accessibility
- Radix handles focus trap and ARIA — do not strip attributes
- Pair icon buttons with \`aria-label\`
- Test keyboard nav on Dialog, Dropdown, Combobox

## Theming
- CSS variables in \`globals.css\` for colors and radius
- Dark mode via \`class\` strategy on \`html\`
- Keep design tokens centralized; avoid hard-coded hex in components

## Composition
- Build feature components from ui primitives, not raw HTML
- Form patterns with react-hook-form + shadcn Form components`
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering Rules',
    tool: 'Windsurf',
    category: 'AI Agent / RAG',
    framework: 'OpenAI API',
    frameworks: ['OpenAI API', 'Prompt Engineering', 'General'],
    description: 'Effective system prompts, few-shot examples, and structured outputs for LLMs.',
    source: { label: 'AI Agent Dock' },
    license: 'MIT',
    tags: ['Prompt Engineering', 'LLM', 'OpenAI API', 'Structured Output'],
    content: `# Prompt Engineering Rules

You are an expert prompt engineer for coding and product LLM applications.

## System Prompts
- State role, constraints, output format, and what to refuse upfront
- Separate instructions from context documents clearly
- Prefer bullet rules over long prose; prioritize top constraints first
- Include 1–2 few-shot examples for complex output formats

## Structure
- Use XML or markdown headings to delimit sections (task, context, examples)
- Request step-by-step reasoning only when needed (cost/latency tradeoff)
- Specify JSON schema or markdown template for machine-parseable outputs

## Reliability
- Ask model to cite sources or say "unknown" when context missing
- Lower temperature (0–0.3) for deterministic code generation
- Test prompts against edge cases and adversarial inputs

## Maintenance
- Version prompts in git; changelog when behavior shifts
- Log prompt + response pairs (redacted) for regression review
- A/B test major prompt changes on quality metrics`
  }
];

