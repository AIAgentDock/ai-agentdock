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
      mobile: {
        label: 'Mobile',
        frameworks: [
          'Expo',
          'React Native',
          'Flutter',
          'iOS',
          'Android'
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
          'Cloudflare Workers',
          'Cloudflare Pages',
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
          'TypeScript',
          'General',
          'Code Review'
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
      },
      saas: {
        label: 'SaaS',
        frameworks: ['Next.js', 'Supabase', 'Generic']
      },
      security: {
        label: 'Security',
        frameworks: ['Generic', 'Auth.js', 'Supabase', 'OWASP']
      },
      debugging: {
        label: 'Debugging',
        frameworks: ['Generic', 'TypeScript', 'Python']
      },
      refactoring: {
        label: 'Refactoring',
        frameworks: ['Generic', 'TypeScript', 'Python']
      },
      performance: {
        label: 'Performance',
        frameworks: ['Next.js', 'React', 'Generic']
      },
      documentation: {
        label: 'Documentation',
        frameworks: ['README', 'Markdown', 'Generic']
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
          'Material UI',
          'React Native',
          'Expo'
        ]
      },
      mobile: {
        label: 'Mobile',
        frameworks: [
          'Expo',
          'React Native',
          'Flutter'
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
          'Cloudflare Workers',
          'Cloudflare Pages',
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
          'OWASP',
          'General',
          'Code Review'
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

  'claude-code': {
    label: 'Claude Code',
    categories: {
      general: { label: 'General Coding', frameworks: ['Generic'] },
      fullstack: { label: 'Fullstack', frameworks: ['Next.js', 'React', 'TypeScript'] },
      frontend: { label: 'Frontend / UI', frameworks: ['React', 'TypeScript', 'Tailwind CSS'] },
      ai: { label: 'AI Agent / RAG', frameworks: ['MCP', 'OpenAI API'] },
      testing: { label: 'Testing / QA', frameworks: ['Playwright', 'Vitest', 'Generic'] },
      debugging: { label: 'Debugging', frameworks: ['Generic'] },
      documentation: { label: 'Documentation', frameworks: ['README', 'Generic'] }
    }
  },

  'github-copilot': {
    label: 'GitHub Copilot',
    categories: {
      general: { label: 'General Coding', frameworks: ['Generic'] },
      fullstack: { label: 'Fullstack', frameworks: ['Next.js', 'React', 'TypeScript'] },
      backend: { label: 'Backend / API', frameworks: ['Node.js', 'Python', 'Go'] },
      testing: { label: 'Testing / QA', frameworks: ['Playwright', 'Vitest'] }
    }
  },

  codex: {
    label: 'Codex',
    categories: {
      general: { label: 'General Coding', frameworks: ['Generic'] },
      fullstack: { label: 'Fullstack', frameworks: ['Next.js', 'React'] },
      ai: { label: 'AI Agent / RAG', frameworks: ['MCP', 'OpenAI API'] }
    }
  },

  mcp: {
    label: 'MCP',
    categories: {
      ai: { label: 'AI Agent / RAG', frameworks: ['MCP', 'Generic'] },
      devops: { label: 'DevOps / Deployment', frameworks: ['Cloudflare', 'Generic'] }
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
