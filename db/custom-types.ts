import { Database } from './schema'

export type Profile = Database['public']['Tables']['profile']['Row']
export type Skin = Database['public']['Tables']['skins']['Row']
export type Inventory = Database['public']['Tables']['inventories']['Row']
export type Problem = Database['public']['Tables']['problems']['Row']
export type TestCase = Database['public']['Tables']['test_cases']['Row']
export type StoryTellig = Database['public']['Tables']['story_telling']['Row']
export type Character = Database['public']['Tables']['characters']['Row']
export type Submission = Database['public']['Tables']['submissions']['Row']
export type CtProblem =
  Database['public']['Tables']['ct_fundamentals_problems']['Row']
export type CtSubmission =
  Database['public']['Tables']['ct_fundamentals_submissions']['Row']
