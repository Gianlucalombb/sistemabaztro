import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xbuflrswpntacrlxggtm.supabase.co'
const supabaseKey = 'sb_publishable_6szbhUtlgLfpMxc3cFSUlw_6Np6WE8d'

export const supabase = createClient(supabaseUrl, supabaseKey)