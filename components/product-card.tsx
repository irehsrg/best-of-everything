'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Product } from '@/types'
import { useAuth } from '@/contexts/auth-context'
import { voteForProduct, removeVote } from '@/lib/database'

interface ProductCardProps {
  product: Product
  onVoteUpdate?: (productId: string, newVoteCount: number, userVoted: boolean) => void
}

export default function ProductCard({ product, onVoteUpdate }: ProductCardProps) {
  const { user } = useAuth()
  const [isVoting, setIsVoting] = useState(false)
  const [userVoted, setUserVoted] = useState(product.user_voted || false)
  const [voteCount, setVoteCount] = useState(product.total_votes)

  const handleVote = async () => {
    if (!user || isVoting) return

    setIsVoting(true)
    try {
      if (userVoted) {
        await removeVote(user.id, product.id)
        setUserVoted(false)
        setVoteCount(prev => prev - 1)
        onVoteUpdate?.(product.id, voteCount - 1, false)
      } else {
        await voteForProduct(user.id, product.id)
        setUserVoted(true)
        setVoteCount(prev => prev + 1)
        onVoteUpdate?.(product.id, voteCount + 1, true)
      }
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-6 group hover:scale-[1.02] hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50 -z-10"></div>

      <div className="flex items-start space-x-8">
        {/* Vote section */}
        <div className="flex flex-col items-center space-y-3 min-w-0">
          <button
            onClick={handleVote}
            disabled={!user || isVoting}
            className={`p-4 rounded-2xl transition-all duration-500 transform hover:scale-125 hover:rotate-12 relative ${
              userVoted
                ? 'text-white bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 shadow-2xl shadow-purple-500/50'
                : 'text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 bg-gray-100 hover:shadow-2xl hover:shadow-purple-500/50'
            } ${!user ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            title={!user ? 'Sign in to vote' : userVoted ? 'Remove vote' : 'Vote for this product'}
          >
            {isVoting ? (
              <div className="w-7 h-7 animate-spin">⭐</div>
            ) : (
              <ChevronUp className="w-7 h-7" />
            )}
            {userVoted && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            )}
          </button>
          <div className={`text-2xl font-black px-4 py-2 rounded-2xl min-w-[4rem] text-center ${
            userVoted
              ? 'text-white bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg'
              : 'text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200'
          }`}>
            {voteCount}
          </div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            votes
          </div>
        </div>

        {/* Product info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-2xl font-black text-gray-900 group-hover:text-purple-600 transition-all duration-300 leading-tight">
              {product.name}
            </h3>
            {product.verified && (
              <div className="flex items-center bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
                <span className="mr-1">🎖️</span>
                VERIFIED
              </div>
            )}
          </div>

          <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed text-lg">
            {product.description}
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-6">
            {product.category.map((cat, index) => (
              <span
                key={cat}
                className={`inline-block text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg transform hover:scale-110 transition-all duration-300 ${
                  index % 4 === 0
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500'
                    : index % 4 === 1
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    : index % 4 === 2
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                    : 'bg-gradient-to-r from-green-500 to-teal-500'
                }`}
              >
                #{cat.replace('-', ' & ')}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center text-gray-500">
              <span className="text-sm font-medium">📅</span>
              <span className="ml-2 text-sm font-medium">
                {new Date(product.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center text-gray-500">
              <span className="text-sm font-medium">⭐</span>
              <span className="ml-1 text-sm font-medium">Trending</span>
            </div>
          </div>
        </div>

        {/* Product image placeholder */}
        <div className="flex-shrink-0">
          {product.image_url ? (
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl overflow-hidden ring-4 ring-white shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center ring-4 ring-white shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <div className="text-center">
                <div className="text-2xl mb-1">📦</div>
                <span className="text-gray-400 text-xs font-bold">NO IMG</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}