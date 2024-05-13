export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      inventories: {
        Row: {
          id: number
          is_activated: boolean | null
          profile_id: string | null
          skin_id: number | null
        }
        Insert: {
          id?: number
          is_activated?: boolean | null
          profile_id?: string | null
          skin_id?: number | null
        }
        Update: {
          id?: number
          is_activated?: boolean | null
          profile_id?: string | null
          skin_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventories_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventories_skin_id_fkey"
            columns: ["skin_id"]
            isOneToOne: false
            referencedRelation: "skins"
            referencedColumns: ["id"]
          },
        ]
      }
      problems: {
        Row: {
          coins_reward: number | null
          description: string | null
          difficulty: string
          experience_reward: number | null
          hint: string | null
          id: number
          initial_value: string | null
          name: string | null
        }
        Insert: {
          coins_reward?: number | null
          description?: string | null
          difficulty: string
          experience_reward?: number | null
          hint?: string | null
          id?: number
          initial_value?: string | null
          name?: string | null
        }
        Update: {
          coins_reward?: number | null
          description?: string | null
          difficulty?: string
          experience_reward?: number | null
          hint?: string | null
          id?: number
          initial_value?: string | null
          name?: string | null
        }
        Relationships: []
      }
      profile: {
        Row: {
          bio: string | null
          coins_amount: number
          created_at: string
          experience_points: number
          github_url: string | null
          id: string
          linkedin_url: string | null
          picture: string | null
          picture_filename: string | null
          username: string | null
        }
        Insert: {
          bio?: string | null
          coins_amount?: number
          created_at?: string
          experience_points?: number
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          picture?: string | null
          picture_filename?: string | null
          username?: string | null
        }
        Update: {
          bio?: string | null
          coins_amount?: number
          created_at?: string
          experience_points?: number
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          picture?: string | null
          picture_filename?: string | null
          username?: string | null
        }
        Relationships: []
      }
      skins: {
        Row: {
          description: string | null
          id: number
          name: string | null
          picture: string | null
          price: number | null
        }
        Insert: {
          description?: string | null
          id?: number
          name?: string | null
          picture?: string | null
          price?: number | null
        }
        Update: {
          description?: string | null
          id?: number
          name?: string | null
          picture?: string | null
          price?: number | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          code: string | null
          created_at: string
          has_concluded: boolean | null
          id: number
          problem_id: number | null
          time_in_seconds: number | null
          user_id: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          has_concluded?: boolean | null
          id?: number
          problem_id?: number | null
          time_in_seconds?: number | null
          user_id?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string
          has_concluded?: boolean | null
          id?: number
          problem_id?: number | null
          time_in_seconds?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      test_cases: {
        Row: {
          execution: string | null
          expected_output: string | null
          id: number
          problem_id: number
        }
        Insert: {
          execution?: string | null
          expected_output?: string | null
          id?: number
          problem_id: number
        }
        Update: {
          execution?: string | null
          expected_output?: string | null
          id?: number
          problem_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "test_cases_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
