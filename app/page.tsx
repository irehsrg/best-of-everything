'use client'

import { useState } from 'react'
import { SearchFilters } from '@/types'
import Header from '@/components/header'
import SearchBar from '@/components/search-bar'
import SearchFiltersComponent from '@/components/search-filters'
import ProductList from '@/components/product-list'
import AddProductForm from '@/components/add-product-form'

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'votes',
    category: [],
    timeRange: 'all'
  })
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
  }

  const handleProductAdded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header onAddProduct={() => setShowAddProduct(true)} />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Best Of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Everything
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Discover and vote on the best products in every category.
              <br className="hidden md:block" />
              Join thousands of users building the ultimate product guide.
            </p>

            <div className="max-w-2xl mx-auto">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                className="shadow-2xl"
              />
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <div className="text-center glass rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-blue-200 font-medium">Products</div>
            </div>
            <div className="text-center glass rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">5000+</div>
              <div className="text-blue-200 font-medium">Votes</div>
            </div>
            <div className="text-center glass rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-200 font-medium">Users</div>
            </div>
            <div className="text-center glass rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">10</div>
              <div className="text-blue-200 font-medium">Categories</div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(248 250 252)"/>
          </svg>
        </div>
      </div>

      {/* Filters */}
      <SearchFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {searchTerm ? (
              <>
                Search results for{' '}
                <span className="text-gradient">&ldquo;{searchTerm}&rdquo;</span>
              </>
            ) : (
              'Trending Products'
            )}
          </h2>
          <p className="text-lg text-gray-600">
            {searchTerm
              ? 'Find the best products matching your search'
              : 'Discover the top-rated products voted by our community'
            }
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-1">
          <ProductList
            searchTerm={searchTerm}
            filters={filters}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>

      {/* Add Product Modal */}
      <AddProductForm
        isOpen={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        onProductAdded={handleProductAdded}
      />
    </div>
  )
}