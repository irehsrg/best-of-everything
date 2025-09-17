'use client'

import { useState, useEffect } from 'react'
import { Product, SearchFilters } from '@/types'
import { getProducts, searchProducts } from '@/lib/database'
import ProductCard from './product-card'
import { Loader2 } from 'lucide-react'

interface ProductListProps {
  searchTerm?: string
  filters?: SearchFilters
  refreshTrigger?: number
}

export default function ProductList({ searchTerm = '', filters = {}, refreshTrigger }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)

  const LIMIT = 20

  const loadProducts = async (reset = false) => {
    if (reset) {
      setLoading(true)
      setProducts([])
      setOffset(0)
      setError('')
    } else {
      setLoadingMore(true)
    }

    try {
      const currentOffset = reset ? 0 : offset
      let result: Product[]

      if (searchTerm.trim()) {
        result = await searchProducts(searchTerm, filters, LIMIT, currentOffset)
      } else {
        const data = await getProducts(filters, LIMIT, currentOffset)
        result = data.products
      }

      if (reset) {
        setProducts(result)
      } else {
        setProducts(prev => [...prev, ...result])
      }

      setHasMore(result.length === LIMIT)
      setOffset(currentOffset + LIMIT)
    } catch (err: any) {
      setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    loadProducts(true)
  }, [searchTerm, filters, refreshTrigger]) // loadProducts is defined in component scope

  const handleVoteUpdate = (productId: string, newVoteCount: number, userVoted: boolean) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, total_votes: newVoteCount, user_voted: userVoted }
          : product
      )
    )
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error && products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => loadProducts(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">
          {searchTerm ? 'No products found matching your search.' : 'No products available.'}
        </p>
        {searchTerm && (
          <p className="text-sm text-gray-500">
            Try different keywords or add this product yourself!
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {products.map((product, index) => (
        <ProductCard
          key={`${product.id}-${index}`}
          product={product}
          onVoteUpdate={handleVoteUpdate}
        />
      ))}

      {hasMore && (
        <div className="text-center py-4">
          <button
            onClick={() => loadProducts(false)}
            disabled={loadingMore}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center mx-auto"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          You&apos;ve reached the end of the list
        </div>
      )}
    </div>
  )
}