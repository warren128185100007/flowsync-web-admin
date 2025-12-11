// src/components/providers.tsx - CREATE THIS NEW FILE
'use client';

import { ReactNode } from 'react';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { SidebarProvider } from '@/contexts/SidebarContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AdminAuthProvider>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </AdminAuthProvider>
  );
}