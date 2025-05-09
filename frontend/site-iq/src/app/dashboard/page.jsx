// /dashboard/page.tsx

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
const Dashboard = () => {
  return (
    <ClerkProvider>
    <div>
      <h1>Welcome to the Dashboard! i am very big and tall </h1>
    </div>
    </ClerkProvider>
        
  );
};

export default Dashboard;