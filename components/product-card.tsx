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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex items-start space-x-4">
        {/* Vote section */}
        <div className="flex flex-col items-center space-y-1 min-w-0">
          <button
            onClick={handleVote}
            disabled={!user || isVoting}
            className={`p-1 rounded-full transition-colors ${
              userVoted
                ? 'text-blue-600 bg-blue-100'
                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
            } ${!user ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            title={!user ? 'Sign in to vote' : userVoted ? 'Remove vote' : 'Vote for this product'}
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <span className={`text-sm font-semibold ${userVoted ? 'text-blue-600' : 'text-gray-600'}`}>
            {voteCount}
          </span>
          <ChevronDown className="w-6 h-6 text-gray-300" />
        </div>

        {/* Product info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {product.description}
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-3">
            {product.category.map((cat) => (
              <span
                key={cat}
                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Added {new Date(product.created_at).toLocaleDateString()}
            </span>
            {product.verified && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Product image placeholder */}
        {product.image_url ? (
          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
            <span className="text-gray-400 text-xs text-center">No Image</span>
          </div>
        )}
      </div>
    </div>
  )
}