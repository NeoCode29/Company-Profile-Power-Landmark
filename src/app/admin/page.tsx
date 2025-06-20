import { auth } from '@/auth';
import React from 'react';
import { redirect } from 'next/navigation';

const AdminPage = async () => {
    const session = await auth();
    if (!session?.user) {
        redirect('/login');
    }
  return (
    <div>
      <h1>Admin Page</h1>
      <p>Welcome to the admin panel. Here you can manage the application settings and user data.</p>
    </div>
  );
};

export default AdminPage;
