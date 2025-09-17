export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          email_verified: boolean
          display_name: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          email_verified?: boolean
          display_name?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          email_verified?: boolean
          display_name?: string | null
        }
      }
      products: {
        Row: {
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
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string[]
          total_votes?: number
          created_at?: string
          updated_at?: string
          added_by: string
          image_url?: string | null
          verified?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string[]
          total_votes?: number
          created_at?: string
          updated_at?: string
          added_by?: string
          image_url?: string | null
          verified?: boolean
        }
      }
      votes: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          product_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          product_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          product_count?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}