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
    <div className="min-h-screen">
      <Header onAddProduct={() => setShowAddProduct(true)} />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 opacity-90"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.2
          }}></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm font-medium mb-8 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Join 10,000+ Product Enthusiasts
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight leading-none">
              <span className="block">BEST OF</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-pink-400 to-orange-400 bg-clip-text text-transparent animate-pulse">
                EVERYTHING
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              🚀 Discover the world&apos;s best products voted by real users
              <br className="hidden md:block" />
              ⭐ Share your favorites and help others make better choices
            </p>

            <div className="max-w-3xl mx-auto mb-16">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                className="shadow-2xl scale-110"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 text-lg"
              >
                🎯 Add Your Favorite Product
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300 text-lg">
                📊 Browse Trending
              </button>
            </div>
          </div>

          {/* Enhanced Stats with Icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">📦</div>
              <div className="text-4xl font-black text-white mb-2">1K+</div>
              <div className="text-white/80 font-medium">Products</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">👍</div>
              <div className="text-4xl font-black text-white mb-2">5K+</div>
              <div className="text-white/80 font-medium">Votes</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">👥</div>
              <div className="text-4xl font-black text-white mb-2">500+</div>
              <div className="text-white/80 font-medium">Users</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">🏷️</div>
              <div className="text-4xl font-black text-white mb-2">10+</div>
              <div className="text-white/80 font-medium">Categories</div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Filters */}
      <SearchFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Main Content */}
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              {searchTerm ? (
                <>
                  🔍 Results for{' '}
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    &ldquo;{searchTerm}&rdquo;
                  </span>
                </>
              ) : (
                <>
                  🔥 <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Trending</span> Products
                </>
              )}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {searchTerm
                ? 'The best products matching your search, ranked by community votes'
                : 'Top-rated products loved by thousands of users worldwide'
              }
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-2xl border border-purple-100 p-8">
            <ProductList
              searchTerm={searchTerm}
              filters={filters}
              refreshTrigger={refreshTrigger}
            />
          </div>
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