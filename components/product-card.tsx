'use client'

import { useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { Product } from '@/types'
import { useAuth } from '@/contexts/auth-context'
import { voteForProduct, removeVote } from '@/lib/database'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
    <Card className="mb-6 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Vote section */}
          <div className="flex flex-col items-center gap-2 min-w-[80px]">
            <Button
              onClick={handleVote}
              disabled={!user || isVoting}
              size="icon"
              variant={userVoted ? "default" : "outline"}
              className={`h-12 w-12 rounded-full ${
                userVoted ? 'bg-primary' : ''
              }`}
              title={!user ? 'Sign in to vote' : userVoted ? 'Remove vote' : 'Vote for this product'}
            >
              {isVoting ? (
                <div className="w-5 h-5 animate-spin">⭐</div>
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </Button>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">
                {voteCount}
              </div>
              <div className="text-xs text-muted-foreground">
                votes
              </div>
            </div>
          </div>

          {/* Product info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-semibold text-foreground leading-tight">
                {product.name}
              </h3>
              {product.verified && (
                <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
                  <span className="mr-1">✓</span>
                  VERIFIED
                </div>
              )}
            </div>

            <p className="text-muted-foreground mb-4 line-clamp-2">
              {product.description}
            </p>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.category.map((cat) => (
                <span
                  key={cat}
                  className="inline-block bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-md font-medium"
                >
                  {cat.replace('-', ' & ')}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
              <div>
                {new Date(product.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <span>⭐</span>
                <span>Trending</span>
              </div>
            </div>
          </div>

          {/* Product image */}
          <div className="flex-shrink-0">
            {product.image_url ? (
              <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg">📦</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}