import { supabase } from './supabase'

export interface SuspiciousActivityCheck {
  isSuspicious: boolean
  reasons: string[]
  riskScore: number
}

export async function checkSuspiciousVotingActivity(
  userId: string,
  productId: string
): Promise<SuspiciousActivityCheck> {
  const reasons: string[] = []
  let riskScore = 0

  try {
    // Check 1: Too many votes in short time period
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { data: recentVotes } = await supabase
      .from('votes')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', oneHourAgo)

    if (recentVotes && recentVotes.length > 15) {
      reasons.push('Excessive voting in short time period')
      riskScore += 30
    }

    // Check 2: Voting pattern (always voting for products by same user)
    const { data: userVotes } = await supabase
      .from('votes')
      .select(`
        id,
        products!inner (
          added_by
        )
      `)
      .eq('user_id', userId)
      .limit(20)

    if (userVotes && userVotes.length >= 10) {
      const uniqueProductAdders = new Set(
        userVotes.map((vote: any) => vote.products?.added_by).filter(Boolean)
      )

      if (uniqueProductAdders.size === 1) {
        reasons.push('Suspicious voting pattern detected')
        riskScore += 40
      }
    }

    // Check 3: Account age vs voting activity
    const { data: profile } = await (supabase
      .from('profiles') as any)
      .select('created_at')
      .eq('id', userId)
      .single()

    if (profile) {
      const accountAge = Date.now() - new Date(profile.created_at).getTime()
      const accountAgeHours = accountAge / (1000 * 60 * 60)

      if (accountAgeHours < 24 && recentVotes && recentVotes.length > 5) {
        reasons.push('New account with high activity')
        riskScore += 25
      }
    }

    // Check 4: Check if user has verified email
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user?.email_confirmed_at) {
      reasons.push('Unverified email address')
      riskScore += 20
    }

    // Check 5: Multiple votes on same product (shouldn't happen due to constraints)
    const { data: duplicateVotes } = await supabase
      .from('votes')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)

    if (duplicateVotes && duplicateVotes.length > 1) {
      reasons.push('Multiple votes detected')
      riskScore += 50
    }

  } catch (error) {
    console.error('Error checking suspicious activity:', error)
    riskScore += 10 // Add minor penalty for errors
  }

  return {
    isSuspicious: riskScore >= 50,
    reasons,
    riskScore
  }
}

export async function checkSuspiciousProductSubmission(
  userId: string,
  productData: {
    name: string
    description: string
  }
): Promise<SuspiciousActivityCheck> {
  const reasons: string[] = []
  let riskScore = 0

  try {
    // Check 1: Too many product submissions recently
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data: recentProducts } = await (supabase
      .from('products') as any)
      .select('id')
      .eq('added_by', userId)
      .gte('created_at', oneDayAgo)

    if (recentProducts && recentProducts.length > 3) {
      reasons.push('Too many product submissions in 24 hours')
      riskScore += 35
    }

    // Check 2: Duplicate or very similar product names
    const { data: similarProducts } = await (supabase
      .from('products') as any)
      .select('name')
      .ilike('name', `%${productData.name.toLowerCase()}%`)
      .limit(5)

    if (similarProducts && similarProducts.length > 0) {
      const exactMatch = similarProducts.find(
        (p: any) => p.name.toLowerCase() === productData.name.toLowerCase()
      )
      if (exactMatch) {
        reasons.push('Product with same name already exists')
        riskScore += 40
      }
    }

    // Check 3: Content quality checks
    if (productData.description.length < 20) {
      reasons.push('Product description too short')
      riskScore += 15
    }

    if (productData.name.length < 3) {
      reasons.push('Product name too short')
      riskScore += 20
    }

    // Check 4: Spam detection (repeated words, excessive caps)
    const upperCaseRatio = (productData.name.match(/[A-Z]/g) || []).length / productData.name.length
    if (upperCaseRatio > 0.7 && productData.name.length > 5) {
      reasons.push('Excessive use of capital letters')
      riskScore += 15
    }

    // Check 5: Account verification
    const { data: profile } = await (supabase
      .from('profiles') as any)
      .select('email_verified')
      .eq('id', userId)
      .single()

    if (profile && !profile.email_verified) {
      reasons.push('Unverified email address')
      riskScore += 25
    }

  } catch (error) {
    console.error('Error checking suspicious product submission:', error)
    riskScore += 10
  }

  return {
    isSuspicious: riskScore >= 40,
    reasons,
    riskScore
  }
}

export async function logSuspiciousActivity(
  userId: string,
  activityType: 'vote' | 'product_submission',
  details: SuspiciousActivityCheck,
  productId?: string
) {
  try {
    // In a real application, you'd want to log this to a separate table
    // or monitoring service. For now, we'll just console.log
    console.warn('Suspicious activity detected:', {
      userId,
      activityType,
      productId,
      riskScore: details.riskScore,
      reasons: details.reasons,
      timestamp: new Date().toISOString()
    })

    // TODO: Implement actual logging to database or monitoring service
  } catch (error) {
    console.error('Error logging suspicious activity:', error)
  }
}