import { Database } from './schema'

export type Profile = Database['public']['Tables']['profile']['Row']
export type Skin = Database['public']['Tables']['skins']['Row']
export type Invetory = Database['public']['Tables']['inventories']['Row']
