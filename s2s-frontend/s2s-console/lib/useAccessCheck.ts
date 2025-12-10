'use client';

import { useState, useEffect } from 'react';

const CMS_BACKEND_URL = process.env.NEXT_PUBLIC_CMS_BACKEND_URL || 'http://localhost:4000';

interface AccessStatus {
  has_access: boolean;
  user_id: string | null;
  email: string | null;
  products: Array<{
    product_code: string;
    product_name?: string;
    activated_at: string;
    expires_at: string | null;
  }>;
}

interface UseAccessCheckResult {
  hasAccess: boolean;
  isLoading: boolean;
  accessStatus: AccessStatus | null;
  error: string | null;
  checkAccess: () => Promise<void>;
}

/**
 * Hook to check console access for current user
 * Checks by email (from localStorage) or user_id
 */
export function useAccessCheck(): UseAccessCheckResult {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessStatus, setAccessStatus] = useState<AccessStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkAccess = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get email from localStorage (set during diagnostic)
      const email = localStorage.getItem('diagnostic_email');
      const user_id = localStorage.getItem('user_id');

      if (!email && !user_id) {
        setHasAccess(false);
        setAccessStatus(null);
        setIsLoading(false);
        return;
      }

      const params = new URLSearchParams();
      if (user_id) {
        params.append('user_id', user_id);
      } else if (email) {
        params.append('email', email);
      }

      const response = await fetch(
        `${CMS_BACKEND_URL}/api/console/v3/access/check?${params.toString()}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check access');
      }

      const data: AccessStatus = await response.json();
      setAccessStatus(data);
      setHasAccess(data.has_access);
    } catch (err: any) {
      console.error('Error checking access:', err);
      setError(err.message || 'Failed to check access');
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAccess();
  }, []);

  return {
    hasAccess,
    isLoading,
    accessStatus,
    error,
    checkAccess,
  };
}



