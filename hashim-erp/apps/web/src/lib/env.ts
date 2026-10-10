// التحقق من متغيرات البيئة (الربط بـ Supabase يحتاج هذين المفتاحين فقط)
const url = (import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

export const env = { supabaseUrl: url, supabaseAnonKey: key }
export const envReady =
  /^https?:\/\/.+/.test(url) && !url.includes('YOUR-PROJECT') && key.length > 20 && !key.includes('YOUR-ANON-KEY')
