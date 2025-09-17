'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: (term: string) => void
  placeholder?: string
  className?: string
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search for any product...",
  className = ""
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue)
        onSearch(localValue)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [localValue, value, onChange, onSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onChange(localValue)
    onSearch(localValue)
  }

  const handleClear = () => {
    setLocalValue('')
    onChange('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="block w-full pl-10 pr-12 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
          placeholder={placeholder}
        />

        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-8 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center px-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          Search
        </button>
      </div>

      {/* Search suggestions could be added here */}
    </form>
  )
}