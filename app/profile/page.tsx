'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { getUserVotes } from '@/lib/database'
import Header from '@/components/header'
import { Calendar, ThumbsUp, Package } from 'lucide-react'

export default function ProfilePage() {
  const { user, profile, loading } = useAuth()
  const [userVotes, setUserVotes] = useState<any[]>([])
  const [votesLoading, setVotesLoading] = useState(true)

  useEffect(() => {
    const loadUserVotes = async () => {
      if (!user) return

      try {
        const votes = await getUserVotes(user.id)
        setUserVotes(votes || [])
      } catch (error) {
        console.error('Error loading user votes:', error)
      } finally {
        setVotesLoading(false)
      }
    }

    if (user) {
      loadUserVotes()
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Please sign in to view your profile
            </h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {(profile?.display_name || user.email)?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.display_name || user.email?.split('@')[0]}
              </h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined {new Date(profile?.created_at || user.created_at).toLocaleDateString()}
                  </span>
                </div>
                {profile?.email_verified && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ThumbsUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {userVotes.length}
                </div>
                <div className="text-sm text-gray-600">Total Votes</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Products Added</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.ceil((Date.now() - new Date(profile?.created_at || user.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-gray-600">Days Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Votes */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Votes</h2>
          </div>

          {votesLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : userVotes.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <ThumbsUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>You haven&apos;t voted on any products yet.</p>
              <p className="text-sm mt-1">Start exploring and vote for products you recommend!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {userVotes.map((vote: any) => (
                <div key={vote.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {vote.products?.name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {vote.products?.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{vote.products?.total_votes} votes</span>
                        <span>•</span>
                        <span>Voted {new Date(vote.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-blue-600">
                      <ThumbsUp className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}