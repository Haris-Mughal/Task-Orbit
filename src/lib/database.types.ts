export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          streak_count: number
          badges: string[]
          mood: string
          last_login: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string
          email: string
          streak_count?: number
          badges?: string[]
          mood?: string
          last_login?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          streak_count?: number
          badges?: string[]
          mood?: string
          last_login?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          due_date: string | null
          category: string
          priority: number
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          due_date?: string | null
          category?: string
          priority?: number
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          due_date?: string | null
          category?: string
          priority?: number
          completed?: boolean
          created_at?: string
          updated_at?: string
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

// Type helpers
export type User = Database['public']['Tables']['users']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];
export type NewUser = Database['public']['Tables']['users']['Insert'];
export type NewTask = Database['public']['Tables']['tasks']['Insert'];
export type UpdateUser = Database['public']['Tables']['users']['Update'];
export type UpdateTask = Database['public']['Tables']['tasks']['Update'];