'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Role = 'customer' | 'professional' | 'admin' | null;

interface DemoRoleContextType {
  demoRole: Role;
  selectedUserId: string | null;
  selectedProfessionalId: string | null;
  selectedUserName: string | null;
  setDemoCustomer: (userId: string, userName: string) => void;
  setDemoProfessional: (professionalId: string, professionalName: string) => void;
  setDemoAdmin: () => void;
  clearDemoRole: () => void;
}

const DemoRoleContext = createContext<DemoRoleContextType | undefined>(undefined);

export function DemoRoleProvider({ children }: { children: React.ReactNode }) {
  const [demoRole, setDemoRole] = useState<Role>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);

  useEffect(() => {
    // Load from localStorage on mount
    const storedRole = localStorage.getItem('demoRole') as Role;
    const storedUserId = localStorage.getItem('selectedUserId');
    const storedProId = localStorage.getItem('selectedProfessionalId');
    const storedUserName = localStorage.getItem('selectedUserName');

    if (storedRole) setDemoRole(storedRole);
    if (storedUserId) setSelectedUserId(storedUserId);
    if (storedProId) setSelectedProfessionalId(storedProId);
    if (storedUserName) setSelectedUserName(storedUserName);
  }, []);

  const saveState = (role: Role, userId: string | null, proId: string | null, userName: string | null) => {
    setDemoRole(role);
    setSelectedUserId(userId);
    setSelectedProfessionalId(proId);
    setSelectedUserName(userName);

    if (role) localStorage.setItem('demoRole', role);
    else localStorage.removeItem('demoRole');

    if (userId) localStorage.setItem('selectedUserId', userId);
    else localStorage.removeItem('selectedUserId');

    if (proId) localStorage.setItem('selectedProfessionalId', proId);
    else localStorage.removeItem('selectedProfessionalId');

    if (userName) localStorage.setItem('selectedUserName', userName);
    else localStorage.removeItem('selectedUserName');
  };

  const setDemoCustomer = (userId: string, userName: string) => saveState('customer', userId, null, userName);
  const setDemoProfessional = (professionalId: string, professionalName: string) => saveState('professional', null, professionalId, professionalName);
  const setDemoAdmin = () => saveState('admin', null, null, 'Admin User');
  const clearDemoRole = () => saveState(null, null, null, null);

  return (
    <DemoRoleContext.Provider
      value={{
        demoRole,
        selectedUserId,
        selectedProfessionalId,
        selectedUserName,
        setDemoCustomer,
        setDemoProfessional,
        setDemoAdmin,
        clearDemoRole,
      }}
    >
      {children}
    </DemoRoleContext.Provider>
  );
}

export function useDemoRole() {
  const context = useContext(DemoRoleContext);
  if (context === undefined) {
    throw new Error('useDemoRole must be used within a DemoRoleProvider');
  }
  return context;
}
