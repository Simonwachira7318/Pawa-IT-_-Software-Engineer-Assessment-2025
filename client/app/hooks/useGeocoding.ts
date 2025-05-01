/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { API_BASE_URL } from '../config/api';

export const useGeocoding = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setLocations([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/geocode?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) throw new Error('Failed to fetch locations');
      
      const data = await response.json();
      setLocations(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch locations');
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  return { locations, loading, error, searchLocations };
};