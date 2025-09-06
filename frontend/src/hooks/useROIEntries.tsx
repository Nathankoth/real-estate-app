import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

interface ROIEntry {
  id: string;
  property_name: string;
  month: string;
  income: number;
  expenses: number;
  roi: number;
  created_at: string;
}

export const useROIEntries = () => {
  const [entries, setEntries] = useState<ROIEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchEntries = async () => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    try {
      // First get the user's profile ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        setEntries([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('roi_entries')
        .select('*')
        .eq('user_id', profile.id)
        .order('month', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching ROI entries:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (entry: Omit<ROIEntry, 'id' | 'created_at'>) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      // Get user's profile ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      const { data, error } = await supabase
        .from('roi_entries')
        .insert({
          user_id: profile.id,
          property_name: entry.property_name,
          month: entry.month,
          income: entry.income,
          expenses: entry.expenses,
          roi: entry.roi
        })
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => [data, ...prev]);
      return { success: true, data };
    } catch (error) {
      console.error('Error adding ROI entry:', error);
      return { success: false, error: 'Failed to add entry' };
    }
  };

  const updateEntry = async (id: string, updates: Partial<ROIEntry>) => {
    try {
      const { data, error } = await supabase
        .from('roi_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => prev.map(entry => entry.id === id ? data : entry));
      return { success: true, data };
    } catch (error) {
      console.error('Error updating ROI entry:', error);
      return { success: false, error: 'Failed to update entry' };
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('roi_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntries(prev => prev.filter(entry => entry.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting ROI entry:', error);
      return { success: false, error: 'Failed to delete entry' };
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [user]);

  return {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    refetch: fetchEntries
  };
};