import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ChatTemplate {
  id: string;
  category: string;
  title: string;
  message: string;
  is_active: boolean;
  sort_order: number;
}

export function useChatTemplates() {
  const [templates, setTemplates] = useState<ChatTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_templates')
          .select('*')
          .eq('is_active', true)
          .order('category', { ascending: true })
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Error fetching chat templates:', error);
          return;
        }

        setTemplates(data || []);
      } catch (error) {
        console.error('Error in fetchTemplates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const getTemplatesByCategory = (category: string) => {
    return templates.filter(template => template.category === category);
  };

  const getAllCategories = () => {
    const categories = [...new Set(templates.map(t => t.category))];
    return categories.sort();
  };

  return {
    templates,
    loading,
    getTemplatesByCategory,
    getAllCategories
  };
}