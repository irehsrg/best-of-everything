'use client'

import { useState, useEffect } from 'react'
import { SearchFilters } from '@/types'
import Header from '@/components/header'
import SearchBar from '@/components/search-bar'
import SearchFiltersComponent from '@/components/search-filters'
import ProductList from '@/components/product-list'
import AddProductForm from '@/components/add-product-form'
import { getStatistics } from '@/lib/database'

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'votes',
    category: [],
    timeRange: 'all'
  })
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [stats, setStats] = useState({ products: 0, users: 0, votes: 0, categories: 0 })

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
  }

  const handleProductAdded = () => {
    setRefreshTrigger(prev => prev + 1)
    loadStats() // Refresh stats when a product is added
  }

  const loadStats = async () => {
    try {
      const statistics = await getStatistics()
      setStats(statistics)
    } catch (error) {
      console.error('Error loading statistics:', error)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header onAddProduct={() => setShowAddProduct(true)} />

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-muted rounded-full text-muted-foreground text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Join {stats.users}+ Product Enthusiasts
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight">
              Best of Everything
            </h1>

            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Discover amazing products voted by real users. Share your favorites and help others make better choices.
            </p>

            <div className="max-w-2xl mx-auto mb-12">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                className=""
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add Product
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 bg-card rounded-lg border">
              <div className="text-3xl mb-2">{stats.products}</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
            <div className="text-center p-6 bg-card rounded-lg border">
              <div className="text-3xl mb-2">{stats.votes}</div>
              <div className="text-sm text-muted-foreground">Votes</div>
            </div>
            <div className="text-center p-6 bg-card rounded-lg border">
              <div className="text-3xl mb-2">{stats.users}</div>
              <div className="text-sm text-muted-foreground">Users</div>
            </div>
            <div className="text-center p-6 bg-card rounded-lg border">
              <div className="text-3xl mb-2">{stats.categories}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <SearchFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {searchTerm ? (
                <>
                  Results for &ldquo;{searchTerm}&rdquo;
                </>
              ) : (
                <>
                  Trending Products
                </>
              )}
            </h2>
            <p className="text-lg text-muted-foreground">
              {searchTerm
                ? 'Products matching your search, ranked by community votes'
                : 'Top-rated products loved by our community'
              }
            </p>
          </div>

          <ProductList
            searchTerm={searchTerm}
            filters={filters}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </section>

      {/* Add Product Modal */}
      <AddProductForm
        isOpen={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        onProductAdded={handleProductAdded}
      />
    </div>
  )
}