
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { useToast } from '@/hooks/use-toast';

export interface GuestPreference {
  id: string;
  guest_id: string;
  category: string;
  value: string;
  created_at: string;
}

export interface GuestMedicalAlert {
  id: string;
  guest_id: string;
  alert_type: string;
  severity: string;
  description: string;
  created_at: string;
}

const useGuestId = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['guest-id', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('guests')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data?.id ?? null;
    },
    enabled: !!user?.id,
  });
};

export const useGuestPreferences = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: guestId, isLoading: guestLoading } = useGuestId();

  const preferencesQuery = useQuery({
    queryKey: ['guest-preferences', guestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guest_preferences')
        .select('*')
        .eq('guest_id', guestId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as GuestPreference[];
    },
    enabled: !!guestId,
  });

  const alertsQuery = useQuery({
    queryKey: ['guest-medical-alerts', guestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guest_medical_alerts')
        .select('*')
        .eq('guest_id', guestId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as GuestMedicalAlert[];
    },
    enabled: !!guestId,
  });

  const addPreference = useMutation({
    mutationFn: async ({ category, value }: { category: string; value: string }) => {
      if (!guestId) throw new Error('No guest record found');
      const { error } = await supabase
        .from('guest_preferences')
        .insert({ guest_id: guestId, category, value });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-preferences', guestId] });
      toast({ title: 'Preference added' });
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add preference' });
    },
  });

  const deletePreference = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('guest_preferences').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-preferences', guestId] });
      toast({ title: 'Preference removed' });
    },
  });

  const addAlert = useMutation({
    mutationFn: async (alert: { alert_type: string; severity: string; description: string }) => {
      if (!guestId) throw new Error('No guest record found');
      const { error } = await supabase
        .from('guest_medical_alerts')
        .insert({ guest_id: guestId, ...alert });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-medical-alerts', guestId] });
      toast({ title: 'Medical alert added' });
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add alert' });
    },
  });

  const deleteAlert = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('guest_medical_alerts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-medical-alerts', guestId] });
      toast({ title: 'Alert removed' });
    },
  });

  return {
    guestId,
    preferences: preferencesQuery.data ?? [],
    alerts: alertsQuery.data ?? [],
    isLoading: guestLoading || preferencesQuery.isLoading || alertsQuery.isLoading,
    addPreference,
    deletePreference,
    addAlert,
    deleteAlert,
  };
};
