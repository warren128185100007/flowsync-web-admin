// src/contexts/SidebarContext.tsx - CREATE THIS NEW FILE
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  activeSection: string;
  toggleSidebar: () => void;
  setActiveSection: (section: string) => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  activeSection: 'dashboard',
  toggleSidebar: () => {},
  setActiveSection: () => {},
  closeSidebar: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleSetActiveSection = (section: string) => {
    setActiveSection(section);
    // Close sidebar on mobile when item is clicked
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };

  return (
    <SidebarContext.Provider value={{
      isOpen,
      activeSection,
      toggleSidebar,
      setActiveSection: handleSetActiveSection,
      closeSidebar,
    }}>
      {children}
    </SidebarContext.Provider>
  );
}