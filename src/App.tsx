import { useState, useEffect } from 'react'
import frontMatter from 'front-matter'
import ReactMarkdown from 'react-markdown'
import statsData from './data/stats.json'
import MoraleChart from './components/MoraleChart'

interface PostAttributes {
  id: string
  date: string
  category: string
  title: string
  excerpt: string
  readTime: string
  tags?: string[]
}

interface Post {
  attributes: PostAttributes
  body: string
  slug: string
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'notes' | 'about'>('home')
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  // 1. The Markdown Pipeline
  useEffect(() => {
    const loadPosts = async () => {
      const files = import.meta.glob('/src/content/*.md', { query: '?raw', import: 'default' })
      const loadedPosts: Post[] = []

      for (const path in files) {
        const rawMarkdown = await files[path]() as string
        const { attributes, body } = frontMatter<PostAttributes>(rawMarkdown)
        
        // NEW: Use the clean ID from the YAML frontmatter instead of the local filename
        const slug = attributes.id 
        
        loadedPosts.push({ attributes, body, slug })
      }

      loadedPosts.sort((a, b) => {
        const dateDiff = new Date(b.attributes.date).getTime() - new Date(a.attributes.date).getTime()
        if (dateDiff !== 0) return dateDiff
        return b.attributes.id.localeCompare(a.attributes.id, undefined, { numeric: true })
      })
      setPosts(loadedPosts)
    }

    loadPosts()
  }, [])

  // 2. Hash Routing Engine
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      
      if (hash.startsWith('#note-') || hash.startsWith('#dispatch-')) {
        const slug = hash.replace('#note-', '').replace('#dispatch-', '')
        const post = posts.find(p => p.slug === slug)
        if (post) {
          setSelectedPost(post)
        }
      } else if (hash === '#notes') {
        setSelectedPost(null)
        setActiveTab('notes')
      } else if (hash === '#about') {
        setSelectedPost(null)
        setActiveTab('about')
      } else {
        setSelectedPost(null)
        setActiveTab('home')
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [posts])

  // 3. NEW: Auto-Scroll to Top on Navigation
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [selectedPost, activeTab])

  // Find adjacent posts for navigation
  const currentIndex = selectedPost ? posts.findIndex(p => p.slug === selectedPost.slug) : -1
  const newerPost = currentIndex > 0 ? posts[currentIndex - 1] : null
  const olderPost = currentIndex !== -1 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null

  // Calculate dynamic days since start date
  const startDay = new Date(statsData.startDate)
  const today = new Date()
  startDay.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  const daysBuilding = Math.max(1, Math.floor((today.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24)) + 1)

  const dashboardCards = [
    { label: 'PROJECTS', value: statsData.cards.projects },
    { label: 'NOTES', value: posts.length },
    { label: 'TOOLS', value: statsData.cards.tools },
    { label: 'TALKS', value: statsData.cards.talks },
    { label: 'JOBS', value: statsData.cards.jobs }
  ]

  const renderPostsList = () => (
    <>
      {posts.map((post) => (
        <article 
          key={post.attributes.id} 
          onClick={() => window.location.hash = `note-${post.slug}`}
          className="group border border-gray-800/80 bg-brutal-panel p-6 rounded-none hover:border-brand-orange/50 transition-all duration-200 cursor-pointer"
        >
          <div className="text-xs mb-3">
            <span className="text-brand-orange font-semibold tracking-wider">
              [{post.attributes.category}]
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white group-hover:text-brand-orange transition-colors mb-2">
            {post.attributes.title}
          </h2>

          <div className="flex gap-4 text-xs text-gray-500 mb-3">
            <span>{post.attributes.date}</span>
            <span>·</span>
            <span>{post.attributes.readTime}</span>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            {post.attributes.excerpt}
          </p>

          {/* Render Tags in the Feed */}
          {post.attributes.tags && (
            <div className="flex gap-2 mb-6 flex-wrap">
              {post.attributes.tags.map(tag => (
                <span key={tag} className="text-[10px] uppercase tracking-widest text-gray-500 border border-gray-800 px-2 py-0.5 group-hover:border-brand-green/50 group-hover:text-brand-green transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="text-xs text-gray-500 group-hover:text-gray-300 flex items-center gap-1 font-semibold">
            READ NOTE <span className="text-brand-orange">→</span>
          </div>
        </article>
      ))}
    </>
  )

  return (
    <div className="min-h-screen bg-brutal-bg text-gray-200 font-mono p-6 md:p-12 selection:bg-brand-orange selection:text-white max-w-5xl mx-auto">
      
      {/* GLOBAL HEADER */}
      <header className="border-b border-gray-800 pb-6 mb-8 flex justify-between items-end">
        <div>
          <p className="text-gray-500 text-xs tracking-widest uppercase mb-2">
            Notes from job searching in the AI era
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter cursor-pointer" onClick={() => window.location.hash = ''}>
            CTRL+ALT+<span className="text-brand-orange">BUILD</span>
          </h1>
        </div>

        <div className="text-right hidden sm:block">
          <span className="inline-flex items-center gap-2 text-brand-green text-xs tracking-widest border border-brand-green/30 px-3 py-1 bg-brand-green/10 rounded-full">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
            SYSTEM ONLINE
          </span>
        </div>
      </header>

      {/* NAVIGATION */}
      {selectedPost ? (
        <nav className="flex justify-between border-b border-gray-800/80 pb-4 mb-8 text-xs tracking-widest uppercase">
          <button 
            onClick={() => window.location.hash = ''}
            className="text-gray-400 hover:text-brand-orange transition-colors flex items-center gap-2"
          >
            ← RETURN TO FEED
          </button>
          
          {/* NEXT / PREVIOUS ARROWS */}
          <div className="flex gap-6 font-bold">
            <button 
              onClick={() => newerPost && (window.location.hash = `note-${newerPost.slug}`)}
              disabled={!newerPost}
              className={`flex items-center transition-colors ${newerPost ? 'text-brand-orange/60 hover:text-brand-orange cursor-pointer' : 'text-gray-800 cursor-default'}`}
              title={newerPost ? "Newer Note" : ""}
            >
              NEWER ↑
            </button>
            <button 
              onClick={() => olderPost && (window.location.hash = `note-${olderPost.slug}`)}
              disabled={!olderPost}
              className={`flex items-center transition-colors ${olderPost ? 'text-brand-orange/60 hover:text-brand-orange cursor-pointer' : 'text-gray-800 cursor-default'}`}
              title={olderPost ? "Older Note" : ""}
            >
              OLDER ↓
            </button>
          </div>
        </nav>
      ) : (
        <nav className="flex justify-between items-center border-b border-gray-800/80 pb-4 mb-8 text-xs tracking-widest uppercase">
          <div className="flex gap-6">
            <button 
              onClick={() => window.location.hash = ''}
              className={`transition-colors ${activeTab === 'home' ? 'text-brand-orange font-bold border-b-2 border-brand-orange pb-4 -mb-4' : 'text-gray-500 hover:text-gray-300'}`}
            >
              // HOME
            </button>
            <button 
              onClick={() => window.location.hash = 'notes'}
              className={`transition-colors ${activeTab === 'notes' ? 'text-brand-orange font-bold border-b-2 border-brand-orange pb-4 -mb-4' : 'text-gray-500 hover:text-gray-300'}`}
            >
              // NOTES ({posts.length})
            </button>
            <button 
              onClick={() => window.location.hash = 'about'}
              className={`transition-colors ${activeTab === 'about' ? 'text-brand-orange font-bold border-b-2 border-brand-orange pb-4 -mb-4' : 'text-gray-500 hover:text-gray-300'}`}
            >
              // ABOUT THE PROJECT
            </button>
          </div>

          <div className="text-gray-500 font-medium hidden sm:block">
            DAY <span className="text-white font-bold">{daysBuilding}</span> OF BUILDING
          </div>
        </nav>
      )}

      {/* MAIN CONTENT AREA */}
      <main>
        {selectedPost ? (
          <article className="border border-gray-800/80 bg-brutal-panel p-8 md:p-12 rounded-none">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 mb-8 pb-8 border-b border-gray-800">
              
              {/* LEFT SIDE: Category and Title */}
              <div className="max-w-3xl">
                <span className="text-brand-orange font-semibold tracking-wider text-sm mb-4 block">
                  [{selectedPost.attributes.category}]
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  {selectedPost.attributes.title}
                </h1>
              </div>

              {/* RIGHT SIDE: Meta Info (Date and Tags) */}
              <div className="flex flex-col md:items-end gap-4 shrink-0">
                
                {/* Date and Read Time - FORCED INLINE */}
                <div className="text-xs text-gray-500 md:text-right w-full whitespace-nowrap">
                  {selectedPost.attributes.date}
                  <span className="mx-3 text-gray-700">·</span>
                  {selectedPost.attributes.readTime}
                </div>
                
                {/* Tags Array */}
                {selectedPost.attributes.tags && (
                  <div className="flex gap-2 flex-wrap md:justify-end max-w-[250px]">
                    {selectedPost.attributes.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-widest text-brand-green border border-brand-green/30 px-2 py-0.5 bg-brand-green/10">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="text-gray-300 leading-relaxed text-base space-y-6">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h2 className="text-2xl font-bold text-white mt-10 mb-4" {...props} />,
                  h2: ({node, ...props}) => <h3 className="text-xl font-bold text-white mt-8 mb-4" {...props} />,
                  h3: ({node, ...props}) => <h4 className="text-lg font-bold text-white mt-6 mb-3" {...props} />,
                  h4: ({node, ...props}) => <h5 className="text-base font-bold text-white mt-4 mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4" {...props} />,
                  a: ({node, ...props}) => <a className="text-brand-orange hover:underline" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-400" {...props} />,
                  li: ({node, ...props}) => <li {...props} />,
                  code: ({node, className, children, ...props}: any) => {
                    // Check for a language tag or a multiline string to identify block-level code
                    const match = /language-(\w+)/.exec(className || '')
                    const isBlock = match || String(children).includes('\n')
                    
                    return !isBlock ? (
                      // INLINE CODE
                      <code className="bg-black text-brand-green px-1.5 py-0.5 rounded text-sm border border-gray-800" {...props}>
                        {children}
                      </code>
                    ) : (
                      // BLOCK CODE
                      <pre className="bg-black text-brand-green p-4 overflow-x-auto border border-gray-800 my-6 text-sm">
                        <code className={className} {...props}>{children}</code>
                      </pre>
                    )
                  }
                }}
              >
                {selectedPost.body.trimStart().replace(/^#\s+.*[\r\n]+/, '')}
              </ReactMarkdown>
            </div>
          </article>
        ) : activeTab === 'home' ? (
          <div className="space-y-6">
            {/* DASHBOARD METRICS CARDS (COMPACT HORIZONTAL SCROLL) */}
            <div className="w-full overflow-x-auto border border-gray-800/80 bg-brutal-panel mb-4">
              <div className="grid grid-cols-5 min-w-[600px] divide-x divide-gray-800/80">
                {dashboardCards.map((card) => (
                  <div key={card.label} className="px-4 py-2 flex items-baseline gap-2 justify-start">
                    <span className="text-xl font-black text-white tracking-tight font-mono">
                      {card.value}
                    </span>
                    <span className="text-[10px] tracking-widest uppercase text-gray-500 font-semibold truncate">
                      {card.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* MOOD TREND LINE CHART */}
            <MoraleChart />

            {renderPostsList()}
          </div>
        ) : activeTab === 'notes' ? (
          <div className="space-y-6">
            {renderPostsList()}
          </div>
        ) : (
          <div className="border border-gray-800 bg-brutal-panel p-8 text-gray-300 leading-relaxed text-sm space-y-4">
            <h2 className="text-xl font-bold text-white">About CTRL+ALT+BUILD</h2>
            <p>
              This site is a mixture of microblogging, learning how stuff works - and a distraction from the repetitive nature of applying for jobs.  I needed some way to build and learn while tackling a job search, and this is it.  It's not meant to be a live CV, a demomstration of my coding prowess or a guide to life, the universe and everything.  If it helps anyone with their job search, or even getting started building things - happy days.
            </p>
          </div>
        )}
      </main>

    </div>
  )
}
