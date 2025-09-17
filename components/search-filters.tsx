'use client'

import { useState, useEffect } from 'react'
import { SearchFilters, Category } from '@/types'
import { getCategories } from '@/lib/database'
import { Filter, X } from 'lucide-react'

interface SearchFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
}

export default function SearchFiltersComponent({ filters, onFiltersChange }: SearchFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryToggle = (categorySlug: string) => {
    const currentCategories = filters.category || []
    const newCategories = currentCategories.includes(categorySlug)
      ? currentCategories.filter(c => c !== categorySlug)
      : [...currentCategories, categorySlug]

    onFiltersChange({
      ...filters,
      category: newCategories
    })
  }

  const handleSortChange = (sortBy: SearchFilters['sortBy']) => {
    onFiltersChange({
      ...filters,
      sortBy
    })
  }

  const handleTimeRangeChange = (timeRange: SearchFilters['timeRange']) => {
    onFiltersChange({
      ...filters,
      timeRange
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      sortBy: 'votes',
      category: [],
      timeRange: 'all'
    })
  }

  const activeFiltersCount =
    (filters.category?.length || 0) +
    (filters.sortBy !== 'votes' ? 1 : 0) +
    (filters.timeRange !== 'all' ? 1 : 0)

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
            {/* Sort By */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Sort by</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'votes', label: 'Most Votes' },
                  { value: 'recent', label: 'Most Recent' },
                  { value: 'name', label: 'Name A-Z' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value as SearchFilters['sortBy'])}
                    className={`px-3 py-1 text-sm rounded-full border ${
                      filters.sortBy === option.value
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Range */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Time range</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All time' },
                  { value: 'year', label: 'Past year' },
                  { value: 'month', label: 'Past month' },
                  { value: 'week', label: 'Past week' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleTimeRangeChange(option.value as SearchFilters['timeRange'])}
                    className={`px-3 py-1 text-sm rounded-full border ${
                      filters.timeRange === option.value
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Categories</h3>
              {loading ? (
                <div className="text-sm text-gray-500">Loading categories...</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.slug}
                      onClick={() => handleCategoryToggle(category.slug)}
                      className={`px-3 py-1 text-sm rounded-full border ${
                        filters.category?.includes(category.slug)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.name}
                      {category.product_count > 0 && (
                        <span className="ml-1 text-xs">({category.product_count})</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Active filters summary */}
            {activeFiltersCount > 0 && (
              <div className="border-t border-gray-200 pt-3">
                <div className="flex flex-wrap gap-2">
                  {filters.category?.map((categorySlug) => {
                    const category = categories.find(c => c.slug === categorySlug)
                    return (
                      <div
                        key={categorySlug}
                        className="flex items-center space-x-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        <span>{category?.name || categorySlug}</span>
                        <button
                          onClick={() => handleCategoryToggle(categorySlug)}
                          className="hover:text-blue-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  })}

                  {filters.sortBy !== 'votes' && (
                    <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      <span>
                        Sort: {filters.sortBy === 'recent' ? 'Most Recent' : 'Name A-Z'}
                      </span>
                      <button
                        onClick={() => handleSortChange('votes')}
                        className="hover:text-blue-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {filters.timeRange !== 'all' && (
                    <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      <span>
                        Time: {filters.timeRange === 'week' ? 'Past week' :
                               filters.timeRange === 'month' ? 'Past month' : 'Past year'}
                      </span>
                      <button
                        onClick={() => handleTimeRangeChange('all')}
                        className="hover:text-blue-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}