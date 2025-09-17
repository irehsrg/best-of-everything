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
    <div className="card p-6 mb-4 group hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-start space-x-6">
        {/* Vote section */}
        <div className="flex flex-col items-center space-y-2 min-w-0">
          <button
            onClick={handleVote}
            disabled={!user || isVoting}
            className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
              userVoted
                ? 'text-white bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25'
                : 'text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 bg-gray-50 hover:shadow-lg hover:shadow-blue-500/25'
            } ${!user ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            title={!user ? 'Sign in to vote' : userVoted ? 'Remove vote' : 'Vote for this product'}
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <span className={`text-lg font-bold px-3 py-1 rounded-full ${
            userVoted
              ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600'
              : 'text-gray-600 bg-gray-100'
          }`}>
            {voteCount}
          </span>
        </div>

        {/* Product info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {product.description}
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.category.map((cat) => (
              <span
                key={cat}
                className="inline-block bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm px-3 py-1 rounded-full border border-blue-100 font-medium"
              >
                {cat.replace('-', ' & ')}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">
              Added {new Date(product.created_at).toLocaleDateString()}
            </span>
            {product.verified && (
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                ✓ Verified
              </span>
            )}
          </div>
        </div>

        {/* Product image placeholder */}
        {product.image_url ? (
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden flex-shrink-0 ring-2 ring-white shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex-shrink-0 flex items-center justify-center ring-2 ring-white shadow-lg">
            <span className="text-gray-400 text-xs text-center font-medium">No Image</span>
          </div>
        )}
      </div>
    </div>
  )
}