import { useEffect, useRef } from 'react';
import { supabase, hasSupabaseConfig } from '../supabase';

export function useRealtimeSync(onChange: () => void) {
  const onChangeRef = useRef(onChange);

  // Keep the ref updated with the latest callback
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) return;

    const channel = supabase
      .channel('aerogest-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vuelos' },
        () => {
          onChangeRef.current();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'incidencias' },
        () => {
          onChangeRef.current();
        }
      )
      .subscribe();

    return () => {
      // Clean up websocket channel to avoid memory leaks
      supabase.removeChannel(channel);
    };
  }, []);
}
