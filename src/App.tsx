import { useState, useEffect } from 'react'
import frontMatter from 'front-matter'
import ReactMarkdown from 'react-markdown'

interface PostAttributes {
  id: string
  date: string
  category: string
  title: string
  excerpt: string
  readTime: string
}

interface Post {
  attributes: PostAttributes
  body: string
  slug: string
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dispatches' | 'about'>('dispatches')
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  // 1. The Markdown Pipeline (No changes here)
  useEffect(() => {
    const loadPosts = async () => {
      const files = import.meta.glob('/src/content/*.md', { query: '?raw', import: 'default' })
      const loadedPosts: Post[] = []

      for (const path in files) {
        const rawMarkdown = await files[path]() as string
        const { attributes, body } = frontMatter<PostAttributes>(rawMarkdown)
        const slug = path.split('/').pop()?.replace('.md', '') || ''
        loadedPosts.push({ attributes, body, slug })
      }

      loadedPosts.sort((a, b) => new Date(b.attributes.date).getTime() - new Date(a.attributes.date).getTime())
      setPosts(loadedPosts)
    }

    loadPosts()
  }, [])

  // 2. NEW: Hash Routing Engine
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      
      if (hash.startsWith('#dispatch-')) {
        const slug = hash.replace('#dispatch-', '')
        // Find the post matching the URL slug
        const post = posts.find(p => p.slug === slug)
        if (post) {
          setSelectedPost(post)
          setActiveTab('dispatches')
        }
      } else if (hash === '#about') {
        setSelectedPost(null)
        setActiveTab('about')
      } else {
        // Default back to the main feed if hash is empty or unrecognized
        setSelectedPost(null)
        setActiveTab('dispatches')
      }
    }

    // Run once when posts load (this allows direct linking/bookmarking to work)
    handleHashChange()

    // Listen for the physical browser Back/Forward clicks
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [posts])

  return (
    <div className="min-h-screen bg-brutal-bg text-gray-200 font-mono p-6 md:p-12 selection:bg-brand-orange selection:text-white max-w-5xl mx-auto">
      
      <header className="border-b border-gray-800 pb-6 mb-8 flex justify-between items-end">
        <div>
          <p className="text-gray-500 text-xs tracking-widest uppercase mb-2">
            Dispatches from the Algo-Economy · Est. Jul 2026
          </p>
          {/* Action updated to clear the hash */}
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

      {selectedPost ? (
        <nav className="flex gap-6 border-b border-gray-800/80 pb-4 mb-8 text-xs tracking-widest uppercase">
          {/* Action updated to clear the hash */}
          <button 
            onClick={() => window.location.hash = ''}
            className="text-gray-400 hover:text-brand-orange transition-colors flex items-center gap-2"
          >
            ← RETURN TO FEED
          </button>
        </nav>
      ) : (
        <nav className="flex gap-6 border-b border-gray-800/80 pb-4 mb-8 text-xs tracking-widest uppercase">
          {/* Actions updated to set specific hashes */}
          <button 
            onClick={() => window.location.hash = ''}
            className={`transition-colors ${activeTab === 'dispatches' ? 'text-brand-orange font-bold border-b-2 border-brand-orange pb-4 -mb-4' : 'text-gray-500 hover:text-gray-300'}`}
          >
            // DISPATCHES ({posts.length})
          </button>
          <button 
            onClick={() => window.location.hash = 'about'}
            className={`transition-colors ${activeTab === 'about' ? 'text-brand-orange font-bold border-b-2 border-brand-orange pb-4 -mb-4' : 'text-gray-500 hover:text-gray-300'}`}
          >
            // ABOUT THE PROJECT
          </button>
        </nav>
      )}

      <main>
        {selectedPost ? (
          <article className="border border-gray-800/80 bg-brutal-panel p-8 md:p-12 rounded-none">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8 pb-8 border-b border-gray-800">
              <div>
                <span className="text-brand-orange font-semibold tracking-wider text-sm mb-4 block">
                  [{selectedPost.attributes.category}]
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  {selectedPost.attributes.title}
                </h1>
              </div>
              <div className="flex md:flex-col gap-4 md:gap-1 text-xs text-gray-500 text-left md:text-right">
                <span>{selectedPost.attributes.date}</span>
                <span>{selectedPost.attributes.readTime}</span>
              </div>
            </div>

            <div className="text-gray-300 leading-relaxed text-base space-y-6">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h2 className="text-2xl font-bold text-white mt-10 mb-4" {...props} />,
                  h2: ({node, ...props}) => <h3 className="text-xl font-bold text-white mt-8 mb-4" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4" {...props} />,
                  a: ({node, ...props}) => <a className="text-brand-orange hover:underline" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-400" {...props} />,
                  li: ({node, ...props}) => <li {...props} />,
                  code: ({node, inline, className, children, ...props}: any) => {
                    return inline ? (
                      <code className="bg-black text-brand-green px-1.5 py-0.5 rounded text-sm border border-gray-800" {...props}>
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-black text-brand-green p-4 overflow-x-auto border border-gray-800 my-6 text-sm">
                        <code {...props}>{children}</code>
                      </pre>
                    )
                  }
                }}
              >
                {selectedPost.body}
              </ReactMarkdown>
            </div>
          </article>
        ) : activeTab === 'dispatches' ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <article 
                key={post.attributes.id} 
                onClick={() => window.location.hash = `dispatch-${post.slug}`}
                className="group border border-gray-800/80 bg-brutal-panel p-6 rounded-none hover:border-brand-orange/50 transition-all duration-200 cursor-pointer"
              >
                <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                  <span className="text-brand-orange font-semibold tracking-wider">
                    [{post.attributes.category}]
                  </span>
                  <div className="flex gap-4">
                    <span>{post.attributes.date}</span>
                    <span>·</span>
                    <span>{post.attributes.readTime}</span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white group-hover:text-brand-orange transition-colors mb-3">
                  {post.attributes.title}
                </h2>

                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {post.attributes.excerpt}
                </p>

                <div className="text-xs text-gray-500 group-hover:text-gray-300 flex items-center gap-1 font-semibold">
                  READ DISPATCH <span className="text-brand-orange">→</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-gray-800 bg-brutal-panel p-8 text-gray-300 leading-relaxed text-sm space-y-4">
            <h2 className="text-xl font-bold text-white">About CTRL+ALT+BUILD</h2>
            <p>
              This site is a transparent public build log created to document progress, share engineering insights, and record practical evidence as projects move from concept to execution.
            </p>
          </div>
        )}
      </main>

    </div>
  )
}
