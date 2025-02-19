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
      characters: {
        Row: {
          id: number
          image: string | null
          name: string | null
        }
        Insert: {
          id?: number
          image?: string | null
          name?: string | null
        }
        Update: {
          id?: number
          image?: string | null
          name?: string | null
        }
        Relationships: []
      }
      ct_fundamentals_problems: {
        Row: {
          category: string
          coins_reward: number | null
          ct_pillar: string | null
          difficulty: Database['public']['Enums']['problems-difficulty']
          experience_reward: number | null
          id: number
          name: string | null
        }
        Insert: {
          category?: string
          coins_reward?: number | null
          ct_pillar?: string | null
          difficulty: Database['public']['Enums']['problems-difficulty']
          experience_reward?: number | null
          id?: number
          name?: string | null
        }
        Update: {
          category?: string
          coins_reward?: number | null
          ct_pillar?: string | null
          difficulty?: Database['public']['Enums']['problems-difficulty']
          experience_reward?: number | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      ct_fundamentals_submissions: {
        Row: {
          created_at: string
          ct_fundamentals_problem_id: number
          id: number
          profile_id: string
          time_in_seconds: number | null
        }
        Insert: {
          created_at?: string
          ct_fundamentals_problem_id: number
          id?: number
          profile_id?: string
          time_in_seconds?: number | null
        }
        Update: {
          created_at?: string
          ct_fundamentals_problem_id?: number
          id?: number
          profile_id?: string
          time_in_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'ct_fundamentals_submissions_ct_fundamentals_problem_id_fkey'
            columns: ['ct_fundamentals_problem_id']
            isOneToOne: false
            referencedRelation: 'ct_fundamentals_problems'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'ct_fundamentals_submissions_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
        ]
      }
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
            foreignKeyName: 'inventories_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'inventories_skin_id_fkey'
            columns: ['skin_id']
            isOneToOne: false
            referencedRelation: 'skins'
            referencedColumns: ['id']
          },
        ]
      }
      perks: {
        Row: {
          description: string
          id: number
          name: string
          picture: string
          price: number
        }
        Insert: {
          description?: string
          id?: number
          name?: string
          picture?: string
          price?: number
        }
        Update: {
          description?: string
          id?: number
          name?: string
          picture?: string
          price?: number
        }
        Relationships: []
      }
      perks_inventories: {
        Row: {
          id: number
          perk_id: number
          profile_id: string
          quantity: number
        }
        Insert: {
          id?: number
          perk_id: number
          profile_id?: string
          quantity?: number
        }
        Update: {
          id?: number
          perk_id?: number
          profile_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: 'perks_inventories_perk_id_fkey'
            columns: ['perk_id']
            isOneToOne: false
            referencedRelation: 'perks'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'perks_inventories_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
        ]
      }
      problems: {
        Row: {
          coins_reward: number | null
          description: string | null
          difficulty: Database['public']['Enums']['problems-difficulty']
          experience_reward: number | null
          hint: string | null
          id: number
          initial_value: string | null
          name: string | null
          special_hint: string
          topics: string[]
        }
        Insert: {
          coins_reward?: number | null
          description?: string | null
          difficulty: Database['public']['Enums']['problems-difficulty']
          experience_reward?: number | null
          hint?: string | null
          id?: number
          initial_value?: string | null
          name?: string | null
          special_hint?: string
          topics?: string[]
        }
        Update: {
          coins_reward?: number | null
          description?: string | null
          difficulty?: Database['public']['Enums']['problems-difficulty']
          experience_reward?: number | null
          hint?: string | null
          id?: number
          initial_value?: string | null
          name?: string | null
          special_hint?: string
          topics?: string[]
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
          picture: string | null
          picture_filename: string | null
          streak: number
          username: string | null
        }
        Insert: {
          bio?: string | null
          coins_amount?: number
          created_at?: string
          experience_points?: number
          github_url?: string | null
          id?: string
          picture?: string | null
          picture_filename?: string | null
          streak?: number
          username?: string | null
        }
        Update: {
          bio?: string | null
          coins_amount?: number
          created_at?: string
          experience_points?: number
          github_url?: string | null
          id?: string
          picture?: string | null
          picture_filename?: string | null
          streak?: number
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
      story_telling: {
        Row: {
          character_id: number | null
          id: number
          problem_id: number | null
          text: string | null
        }
        Insert: {
          character_id?: number | null
          id?: number
          problem_id?: number | null
          text?: string | null
        }
        Update: {
          character_id?: number | null
          id?: number
          problem_id?: number | null
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'story_telling_character_id_fkey'
            columns: ['character_id']
            isOneToOne: false
            referencedRelation: 'characters'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'story_telling_problem_id_fkey'
            columns: ['problem_id']
            isOneToOne: false
            referencedRelation: 'problems'
            referencedColumns: ['id']
          },
        ]
      }
      submissions: {
        Row: {
          code: string | null
          created_at: string
          has_concluded: boolean | null
          id: number
          problem_id: number
          profile_id: string
          time_in_seconds: number | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          has_concluded?: boolean | null
          id?: number
          problem_id: number
          profile_id?: string
          time_in_seconds?: number | null
        }
        Update: {
          code?: string | null
          created_at?: string
          has_concluded?: boolean | null
          id?: number
          problem_id?: number
          profile_id?: string
          time_in_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'submissions_problem_id_fkey'
            columns: ['problem_id']
            isOneToOne: false
            referencedRelation: 'problems'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'submissions_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
        ]
      }
      test_cases: {
        Row: {
          execution: string | null
          expected_output: string | null
          id: number
          input: string | null
          problem_id: number
        }
        Insert: {
          execution?: string | null
          expected_output?: string | null
          id?: number
          input?: string | null
          problem_id: number
        }
        Update: {
          execution?: string | null
          expected_output?: string | null
          id?: number
          input?: string | null
          problem_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'test_cases_problem_id_fkey'
            columns: ['problem_id']
            isOneToOne: false
            referencedRelation: 'problems'
            referencedColumns: ['id']
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
      'problems-difficulty': 'hard' | 'medium' | 'easy'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
