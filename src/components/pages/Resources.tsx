import ThemeToggle from '@/components/ThemeToggle'
import { GoogleAd } from '../GoogleAds';
import { useState } from 'react';
import { readingListItems } from '@/app/reading-list/items';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Reading List Card Component
const ReadingListCard = ({ 
  item, 
  onSelect 
}: { 
  item: typeof readingListItems[0], 
  onSelect: (id: number) => void 
}) => (
  <article 
    onClick={() => onSelect(item.id)}
    className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
  >
    <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
      <svg className="w-6 h-6 text-primary dark:text-primary/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>
    <div>
      <h3 className="font-medium text-neutral-800 dark:text-neutral-100 mb-1">{item.title}</h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">
        {item.description}
      </p>
    </div>
  </article>
);

// Individual Reading Page Component
const ReadingPage = ({ 
  item, 
  onBack 
}: { 
  item: typeof readingListItems[0], 
  onBack: () => void 
}) => (
  <div className="peaceful-card p-6">
    <button 
      onClick={onBack} 
      className="mb-4 text-sm text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100 transition-colors"
    >
      ← Back to Reading List
    </button>
    <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">{item.title}</h2>
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h3: ({...props}) => <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mt-4 mb-2" {...props} />,
          h1: ({...props}) => <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4" {...props} />,
          blockquote: ({...props}) => <blockquote className="border-l-4 border-primary pl-4 italic text-neutral-600 dark:text-neutral-300 my-4" {...props} />,
          ul: ({...props}) => <ul className="list-disc pl-6 my-2" {...props} />,
          ol: ({...props}) => <ol className="list-decimal pl-6 my-2" {...props} />,
          p: ({...props}) => <p className="text-lg text-neutral-700 dark:text-neutral-200 mb-4" {...props} />,
          a: ({...props}) => <a className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors" {...props} />,
        }}
      >
        {item.content}
      </ReactMarkdown>
    </div>
  </div>
);

export default function Resources() {
  const [view, setView] = useState<'main' | 'reading-list' | 'reading-item'>('main');
  const [selectedReadingItem, setSelectedReadingItem] = useState<number | null>(null);

  const handleReadingListClick = () => {
    setView('reading-list');
  };

  const handleReadingItemSelect = (id: number) => {
    setSelectedReadingItem(id);
    setView('reading-item');
  };

  const handleBackToReadingList = () => {
    setView('reading-list');
  };

  const handleBackToMain = () => {
    setView('main');
    setSelectedReadingItem(null);
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-fadeIn">
      <div className="flex-1 overflow-y-auto px-3 pb-28">
        {/* Theme toggle positioned at the top right */}
        <div className="flex justify-end mt-4 mb-2">
          <ThemeToggle />
        </div>
        
        {view === 'main' && (
          <div className="space-y-6">
            {/* Daily Wisdom */}
            <section className="peaceful-card p-6">
              <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-100 mb-4">Daily Wisdom</h2>
              <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 border border-primary/10 dark:border-primary/20">
                <p className="text-lg text-neutral-800 dark:text-neutral-100 mb-2 font-medium">
                  &quot;All of humanity&apos;s problems stem from man&apos;s inability to sit quietly in a room alone.&quot;
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  - Blaise Pascal
                </p>
              </div>
            </section>

            {/* Quick Access Resources */}
            <section className="peaceful-card p-6">
              <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-100 mb-4">Quick Access</h2>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleReadingListClick}
                  className="p-4 rounded-xl bg-secondary dark:bg-neutral-700 hover:bg-secondary/90 dark:hover:bg-neutral-600 transition-colors text-left group"
                >
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Reading List</h3>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">Curated articles and books</p>
                </button>
                
                <button className="p-4 rounded-xl bg-secondary dark:bg-neutral-700 hover:bg-secondary/90 dark:hover:bg-neutral-600 transition-colors text-left group">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h3 className="font-medium text-green-700 dark:text-green-300 mb-1">Self-Care</h3>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">Mindfulness practices</p>
                </button>
              </div>
            </section>
          </div>
        )}

        {view === 'reading-list' && (
          <section className="peaceful-card p-6">
            <button 
              onClick={handleBackToMain} 
              className="mb-4 text-sm text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100 transition-colors"
            >
              ← Back to Main
            </button>
            <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-100 mb-4">Reading List</h2>
            <div className="space-y-4">
              {readingListItems.map(item => (
                <ReadingListCard 
                  key={item.id} 
                  item={item} 
                  onSelect={handleReadingItemSelect} 
                />
              ))}
            </div>
          </section>
        )}

        {view === 'reading-item' && selectedReadingItem !== null && (
          <ReadingPage 
            item={readingListItems.find(item => item.id === selectedReadingItem)!} 
            onBack={handleBackToReadingList} 
          />
        )}
      </div>
      <GoogleAd 
        adClient="pub-2905641464701628" 
        adSlot="6800217849" 
      />
    </div>
  )
}
