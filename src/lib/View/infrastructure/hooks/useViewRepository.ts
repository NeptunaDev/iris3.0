'use client';

import { useMemo } from 'react';
import { getCookie } from 'cookies-next';
import { createViewFetchRepository } from '../ViewFetchRepository';

export const useViewRepository = () => {
  const token = getCookie("token") as string;

  const repository = useMemo(() => {
    return createViewFetchRepository(token);
  }, [token]);

  return repository;
}; 