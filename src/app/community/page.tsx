/**
 * Zambia Property - Community Forum Page
 */

import Link from 'next/link';
import { Navigation } from '@/components/navigation/Navigation';
import { Footer } from '@/components/navigation/Footer';

const forumCategories = [
  {
    title: 'General Discussion',
    description: 'Talk about anything related to property in Zambia',
    topics: 234,
    posts: 1892,
    icon: '💬',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Landlord Tips',
    description: 'Share and learn best practices for property management',
    topics: 156,
    posts: 892,
    icon: '🏠',
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'Tenant Advice',
    description: 'Questions and answers for renters',
    topics: 312,
    posts: 2103,
    icon: '🔑',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Market Updates',
    description: 'Discuss property market trends in Zambia',
    topics: 89,
    posts: 456,
    icon: '📈',
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    title: 'Legal Questions',
    description: 'Get advice on property-related legal matters',
    topics: 178,
    posts: 923,
    icon: '⚖️',
    color: 'bg-red-100 text-red-600',
  },
  {
    title: 'Property Investment',
    description: 'Discuss real estate investment strategies',
    topics: 145,
    posts: 712,
    icon: '💰',
    color: 'bg-indigo-100 text-indigo-600',
  },
];

const recentTopics = [
  {
    title: 'Best areas to invest in Mumbwa District?',
    author: 'JohnM',
    replies: 23,
    views: 456,
    lastPost: '2 hours ago',
    category: 'Property Investment',
  },
  {
    title: 'Tenant not paying rent - what are my options?',
    author: 'LandlordZed',
    replies: 45,
    views: 892,
    lastPost: '4 hours ago',
    category: 'Legal Questions',
  },
  {
    title: 'How to handle security deposit disputes',
    author: 'ChipoK',
    replies: 12,
    views: 234,
    lastPost: '6 hours ago',
    category: 'Landlord Tips',
  },
  {
    title: 'Looking for advice on first-time renting',
    author: 'NewTenant2024',
    replies: 34,
    views: 567,
    lastPost: '8 hours ago',
    category: 'Tenant Advice',
  },
  {
    title: 'Property prices in Lusaka - 2024 trends',
    author: 'MarketWatcher',
    replies: 67,
    views: 1234,
    lastPost: '1 day ago',
    category: 'Market Updates',
  },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Community Forum
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Connect with landlords, tenants, and property experts across Zambia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/login"
                className="px-8 py-3 bg-white text-indigo-600 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Join the Discussion
              </Link>
              <button className="px-8 py-3 border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors">
                Browse Topics
              </button>
            </div>
          </div>
        </section>

        {/* Forum Stats */}
        <section className="py-8 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Members', value: '12,450' },
                { label: 'Topics', value: '1,114' },
                { label: 'Posts', value: '6,978' },
                { label: 'Online Now', value: '234' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Forum Categories */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Forum Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forumCategories.map((category) => (
                <Link
                  key={category.title}
                  href="#"
                  className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${category.color}`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                      <div className="flex gap-4 mt-3 text-xs text-gray-400">
                        <span>{category.topics} topics</span>
                        <span>{category.posts} posts</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Topics */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Recent Topics</h2>
              <Link href="#" className="text-primary font-medium hover:underline">
                View All
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {recentTopics.map((topic, index) => (
                  <Link
                    key={index}
                    href="#"
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-medium">
                      {topic.author.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{topic.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>by {topic.author}</span>
                        <span>•</span>
                        <span className="text-primary">{topic.category}</span>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-6 text-sm text-gray-500">
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{topic.replies}</div>
                        <div>replies</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{topic.views}</div>
                        <div>views</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-500">{topic.lastPost}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Community Guidelines</h2>
            <p className="text-gray-600 mb-8">
              Our community thrives when everyone treats each other with respect. Please be kind, helpful, and constructive in your discussions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: '🤝', title: 'Be Respectful', desc: 'Treat others as you want to be treated' },
                { icon: '✅', title: 'Stay On Topic', desc: 'Keep discussions relevant and helpful' },
                { icon: '🚫', title: 'No Spam', desc: 'Don\'t post promotional content' },
              ].map((rule) => (
                <div key={rule.title} className="bg-gray-50 rounded-xl p-6">
                  <div className="text-3xl mb-2">{rule.icon}</div>
                  <h3 className="font-semibold text-gray-900">{rule.title}</h3>
                  <p className="text-sm text-gray-500">{rule.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
