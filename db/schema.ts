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
            foreignKeyName: 'inventories_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profile'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'inventories_skin_in_fkey'
            columns: ['skin_in']
            isOneToOne: false
            referencedRelation: 'skins'
            referencedColumns: ['id']
          },
        ]
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
