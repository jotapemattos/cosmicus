import { Database } from './schema'

export type Profile = Database['public']['Tables']['profile']['Row']
export type Skin = Database['public']['Tables']['skins']['Row']
export type Inventory = Database['public']['Tables']['inventories']['Row']
export type Problem = Database['public']['Tables']['problems']['Row']
export type TestCase = Database['public']['Tables']['test_cases']['Row']
