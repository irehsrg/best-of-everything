export interface Product {
  id: string
  name: string
  description: string
  category: string[]
  total_votes: number
  created_at: string
  updated_at: string
  added_by: string
  image_url: string | null
  verified: boolean
  user_voted?: boolean
}

export interface Profile {
  id: string
  email: string
  created_at: string
  updated_at: string
  email_verified: boolean
  display_name: string | null
}

export interface Vote {
  id: string
  user_id: string
  product_id: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  product_count: number
  created_at: string
}

export interface SearchFilters {
  category?: string[]
  sortBy?: 'votes' | 'recent' | 'name'
  timeRange?: 'all' | 'week' | 'month' | 'year'
}