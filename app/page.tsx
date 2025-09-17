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
    <div className="min-h-screen bg-gray-50">
      <Header onAddProduct={() => setShowAddProduct(true)} />

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Best Of Everything
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Find and vote on the best products in any category. Help others discover great products through community voting.
            </p>

            <div className="max-w-2xl mx-auto">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
              />
            </div>
          </div>

          {/* Quick stats or trending categories could go here */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1000+</div>
              <div className="text-sm text-gray-600">Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">5000+</div>
              <div className="text-sm text-gray-600">Votes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">500+</div>
              <div className="text-sm text-gray-600">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">10</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <SearchFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchTerm ? `Search results for "${searchTerm}"` : 'All Products'}
          </h2>
          <p className="text-gray-600 mt-1">
            {searchTerm
              ? 'Showing products matching your search'
              : 'Discover the best products voted by the community'
            }
          </p>
        </div>

        <ProductList
          searchTerm={searchTerm}
          filters={filters}
          refreshTrigger={refreshTrigger}
        />
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