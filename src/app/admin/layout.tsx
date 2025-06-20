'use client';

import React from 'react';
import { AuthProviders } from '@/components/auth/providers';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="admin-layout flex min-h-screen w-screen bg-slate-50">
        <AdminSidebar />
        <div className="flex-1">
          <header className="admin-header border-b bg-white p-4 shadow-sm">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="ml-4 text-xl font-bold">Admin Dashboard</h1>
            </div>
          </header>
          <main className="admin-content p-6">
            {children}
          </main>
          <footer className="admin-footer border-t bg-white p-4 text-center text-sm text-gray-500">
            <p>© 2023 Power Landmark. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
