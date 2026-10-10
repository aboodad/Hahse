import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const useBranches = () =>
  useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const { data, error } = await supabase.from('branches').select('id,code,name,type,is_active').order('name')
      if (error) throw error
      return data ?? []
    },
    staleTime: 5 * 60_000,
  })

export const useMainWarehouse = () => {
  const q = useBranches()
  return { ...q, data: q.data?.find((b) => b.type === 'main_warehouse') }
}

export const usePaymentMethods = () =>
  useQuery({
    queryKey: ['payment_methods'],
    queryFn: async () => {
      const { data, error } = await supabase.from('payment_methods').select('id,name,type,is_cash').eq('is_active', true).order('name')
      if (error) throw error
      return data ?? []
    },
    staleTime: 5 * 60_000,
  })

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('id,name').eq('is_active', true).order('sort_order')
      if (error) throw error
      return data ?? []
    },
    staleTime: 5 * 60_000,
  })

export const useCompany = () =>
  useQuery({
    queryKey: ['company'],
    queryFn: async () => {
      const { data } = await supabase.from('company_profile').select('*').limit(1).maybeSingle()
      return data
    },
    staleTime: 10 * 60_000,
  })

/** وردية المستخدم المفتوحة (إن وُجدت) */
export const useOpenShift = (userId?: string) =>
  useQuery({
    queryKey: ['open-shift', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from('shifts').select('*').eq('user_id', userId!).eq('status', 'open').maybeSingle()
      if (error) throw error
      return data
    },
  })

/** قراءة إعداد عام من جدول settings (branch_id = null) */
export const useSetting = <T,>(key: string, fallback: T) =>
  useQuery({
    queryKey: ['setting', key],
    queryFn: async () => {
      const { data } = await supabase.from('settings').select('value').eq('key', key).is('branch_id', null).maybeSingle()
      return ((data?.value as T) ?? fallback) as T
    },
    staleTime: 60_000,
  })

/** حفظ إعداد عام (تحديث إن وُجد وإلا إدراج) */
export async function saveSetting(key: string, value: unknown) {
  const { data } = await supabase.from('settings').select('id').eq('key', key).is('branch_id', null).maybeSingle()
  const res = data
    ? await supabase.from('settings').update({ value }).eq('id', data.id)
    : await supabase.from('settings').insert({ key, value })
  if (res.error) throw res.error
}
