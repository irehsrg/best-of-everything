import { supabase } from './supabase'
import { Product, Category, SearchFilters } from '@/types'

export async function getProducts(
  filters: SearchFilters = {},
  limit: number = 20,
  offset: number = 0
) {
  let query = supabase
    .from('products')
    .select('*')
    .eq('verified', true)

  // Apply category filter
  if (filters.category && filters.category.length > 0) {
    query = query.overlaps('category', filters.category)
  }

  // Apply time range filter
  if (filters.timeRange && filters.timeRange !== 'all') {
    const now = new Date()
    let startDate: Date

    switch (filters.timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(0) // Beginning of time
    }

    query = query.gte('created_at', startDate.toISOString())
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'votes':
      query = query.order('total_votes', { ascending: false })
      break
    case 'recent':
      query = query.order('created_at', { ascending: false })
      break
    case 'name':
      query = query.order('name', { ascending: true })
      break
    default:
      query = query.order('total_votes', { ascending: false })
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) throw error

  return { products: data as Product[], count }
}

export async function searchProducts(
  searchTerm: string,
  filters: SearchFilters = {},
  limit: number = 20,
  offset: number = 0
) {
  let query = supabase
    .from('products')
    .select('*')
    .eq('verified', true)
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)

  // Apply category filter
  if (filters.category && filters.category.length > 0) {
    query = query.overlaps('category', filters.category)
  }

  // Apply time range filter
  if (filters.timeRange && filters.timeRange !== 'all') {
    const now = new Date()
    let startDate: Date

    switch (filters.timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(0)
    }

    query = query.gte('created_at', startDate.toISOString())
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'votes':
      query = query.order('total_votes', { ascending: false })
      break
    case 'recent':
      query = query.order('created_at', { ascending: false })
      break
    case 'name':
      query = query.order('name', { ascending: true })
      break
    default:
      query = query.order('total_votes', { ascending: false })
  }

  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query

  if (error) throw error

  return data as Product[]
}

export async function getProduct(id: string, userId?: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error

  let userVoted = false
  if (userId) {
    const { data: voteData } = await supabase
      .from('votes')
      .select('id')
      .eq('product_id', id)
      .eq('user_id', userId)
      .single()

    userVoted = !!voteData
  }

  return { ...(data as any), user_voted: userVoted } as Product
}

export async function addProduct(product: {
  name: string
  description: string
  category: string[]
  added_by: string
  image_url?: string
}) {
  // Import here to avoid circular dependencies
  const { productSubmissionRateLimit } = await import('./rate-limit')
  const { checkSuspiciousProductSubmission, logSuspiciousActivity } = await import('./anti-manipulation')

  // Rate limiting check
  if (!productSubmissionRateLimit.isAllowed(`product:${product.added_by}`)) {
    throw new Error('Rate limit exceeded. Please wait before submitting another product.')
  }

  // Anti-manipulation check
  const suspiciousCheck = await checkSuspiciousProductSubmission(product.added_by, {
    name: product.name,
    description: product.description
  })

  if (suspiciousCheck.isSuspicious) {
    await logSuspiciousActivity(product.added_by, 'product_submission', suspiciousCheck)
    throw new Error('Product submission blocked due to suspicious activity. Please contact support if you believe this is an error.')
  }

  const { data, error } = await (supabase
    .from('products') as any)
    .insert([product])
    .select()
    .single()

  if (error) throw error

  return data as Product
}

export async function voteForProduct(userId: string, productId: string) {
  // Import here to avoid circular dependencies
  const { voteRateLimit } = await import('./rate-limit')
  const { checkSuspiciousVotingActivity, logSuspiciousActivity } = await import('./anti-manipulation')

  // Rate limiting check
  if (!voteRateLimit.isAllowed(`vote:${userId}`)) {
    throw new Error('Rate limit exceeded. Please wait before voting again.')
  }

  // Anti-manipulation check
  const suspiciousCheck = await checkSuspiciousVotingActivity(userId, productId)
  if (suspiciousCheck.isSuspicious) {
    await logSuspiciousActivity(userId, 'vote', suspiciousCheck, productId)
    throw new Error('Vote blocked due to suspicious activity. Please contact support if you believe this is an error.')
  }

  const { data, error } = await (supabase
    .from('votes') as any)
    .insert([{ user_id: userId, product_id: productId }])
    .select()
    .single()

  if (error) throw error

  return data
}

export async function removeVote(userId: string, productId: string) {
  const { data, error } = await supabase
    .from('votes')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)
    .select()
    .single()

  if (error) throw error

  return data
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('product_count', { ascending: false })

  if (error) throw error

  return data as Category[]
}

export async function getUserVotes(userId: string) {
  const { data, error } = await supabase
    .from('votes')
    .select(`
      id,
      created_at,
      product_id,
      products (
        id,
        name,
        description,
        total_votes,
        category
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data
}

export async function getTrendingProducts(limit: number = 10) {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('verified', true)
    .gte('created_at', oneWeekAgo.toISOString())
    .order('total_votes', { ascending: false })
    .limit(limit)

  if (error) throw error

  return data as Product[]
}