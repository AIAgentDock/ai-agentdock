/**
 * Tool → Category → Framework taxonomy for cascading filters.
 * Exposed as window.FILTER_TAXONOMY for app.js.
 */
window.FILTER_TAXONOMY = {
  cursor: {
    label: 'Cursor',
    categories: {
      fullstack: {
        label: 'Fullstack',
        frameworks: [
          'Next.js',
          'React',
          'TypeScript',
          'Tailwind CSS',
          'Supabase',
          'Prisma',
          'tRPC',
          'T3 Stack'
        ]
      },
      frontend: {
        label: 'Frontend / UI',
        frameworks: [
          'React',
          'Vue',
          'Svelte',
          'Angular',
          'Tailwind CSS',
          'shadcn/ui',
          'Material UI',
          'React Native',
          'Expo'
        ]
      },
      backend: {
        label: 'Backend / API',
        frameworks: [
          'Node.js',
          'Express',
          'NestJS',
          'FastAPI',
          'Django',
          'Flask',
          'Python',
          'Go',
          'Rust',
          'REST API',
          'GraphQL'
        ]
      },
      database: {
        label: 'Database / ORM',
        frameworks: [
          'PostgreSQL',
          'MySQL',
          'SQLite',
          'MongoDB',
          'Prisma',
          'Drizzle',
          'TypeORM',
          'Supabase'
        ]
      },
      ai: {
        label: 'AI Agent / RAG',
        frameworks: [
          'OpenAI API',
          'Vercel AI SDK',
          'LangChain',
          'LlamaIndex',
          'MCP',
          'RAG',
          'Vector Database',
          'Pinecone',
          'Chroma'
        ]
      },
      testing: {
        label: 'Testing / QA',
        frameworks: [
          'Playwright',
          'Cypress',
          'Jest',
          'Vitest',
          'Testing Library'
        ]
      },
      devops: {
        label: 'DevOps / Deployment',
        frameworks: [
          'Vercel',
          'Cloudflare',
          'Netlify',
          'Docker',
          'GitHub Actions',
          'AWS'
        ]
      },
      quality: {
        label: 'Code Quality / Security',
        frameworks: [
          'ESLint',
          'Prettier',
          'Zod',
          'Auth.js',
          'NextAuth',
          'Clerk',
          'OWASP',
          'TypeScript'
        ]
      },
      docs: {
        label: 'Documentation / Productivity',
        frameworks: [
          'README',
          'Markdown',
          'Git',
          'Monorepo',
          'Turborepo',
          'pnpm'
        ]
      }
    }
  },

  windsurf: {
    label: 'Windsurf',
    categories: {
      fullstack: {
        label: 'Fullstack',
        frameworks: [
          'Next.js',
          'React',
          'TypeScript',
          'Tailwind CSS',
          'Supabase',
          'Prisma',
          'T3 Stack'
        ]
      },
      frontend: {
        label: 'Frontend / UI',
        frameworks: [
          'React',
          'Vue',
          'Svelte',
          'Angular',
          'Tailwind CSS',
          'shadcn/ui',
          'Material UI'
        ]
      },
      backend: {
        label: 'Backend / API',
        frameworks: [
          'Node.js',
          'Express',
          'NestJS',
          'FastAPI',
          'Django',
          'Flask',
          'REST API',
          'GraphQL'
        ]
      },
      ai: {
        label: 'AI Agent / RAG',
        frameworks: [
          'OpenAI API',
          'Vercel AI SDK',
          'LangChain',
          'LlamaIndex',
          'MCP',
          'RAG',
          'Vector Database'
        ]
      },
      testing: {
        label: 'Testing / QA',
        frameworks: [
          'Playwright',
          'Cypress',
          'Jest',
          'Vitest'
        ]
      },
      devops: {
        label: 'DevOps / Deployment',
        frameworks: [
          'Vercel',
          'Cloudflare',
          'Docker',
          'GitHub Actions',
          'Netlify'
        ]
      },
      quality: {
        label: 'Code Quality / Security',
        frameworks: [
          'ESLint',
          'Prettier',
          'Zod',
          'TypeScript',
          'OWASP'
        ]
      },
      docs: {
        label: 'Documentation / Productivity',
        frameworks: [
          'README',
          'Markdown',
          'Git',
          'Monorepo',
          'pnpm'
        ]
      }
    }
  },

  universal: {
    label: 'Universal',
    categories: {
      general: {
        label: 'General Coding',
        frameworks: [
          'General',
          'Clean Code',
          'Refactoring',
          'Architecture',
          'Prompt Engineering'
        ]
      },
      fullstack: {
        label: 'Fullstack',
        frameworks: [
          'Next.js',
          'React',
          'TypeScript',
          'Tailwind CSS',
          'Supabase',
          'Prisma'
        ]
      },
      ai: {
        label: 'AI Agent / RAG',
        frameworks: [
          'OpenAI API',
          'MCP',
          'RAG',
          'LangChain',
          'LlamaIndex'
        ]
      },
      quality: {
        label: 'Code Quality / Security',
        frameworks: [
          'ESLint',
          'Prettier',
          'Zod',
          'OWASP',
          'TypeScript'
        ]
      },
      docs: {
        label: 'Documentation / Productivity',
        frameworks: [
          'README',
          'Markdown',
          'Git',
          'Documentation'
        ]
      }
    }
  }
};
