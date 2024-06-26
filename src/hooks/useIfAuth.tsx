"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';

export default function useAuth () {
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("token");

    if (token) {
        router.push('/AdminDashboard');
      } else {
        router.push('/');
      }
    }, [router]);

  return getCookie("token");
};
