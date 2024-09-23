import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, ThemeProvider, NetworkProvider } from 'src/shared/contexts/index.ts';
import Header from 'src/frontend/components/layout/Header.tsx';
import Footer from 'src/frontend/components/layout/Footer.tsx';
import Sidebar from 'src/frontend/components/layout/Sidebar.tsx';
import Welcome from 'src/frontend/pages/Welcome.tsx';
import Onboarding from 'src/frontend/pages/Onboarding.tsx';
import Profile from 'src/frontend/pages/Profile.tsx';
import InviteManagement from 'src/frontend/pages/InviteManagement.tsx';
import Account from 'src/frontend/pages/Account.tsx';
import NetworkFeed from 'src/frontend/pages/NetworkFeed.tsx';
import Toast from 'src/frontend/components/ui/Toast.tsx';
import { COLORS } from 'src/shared/constants/index.ts';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <NetworkProvider>
            <div className="flex flex-col min-h-screen bg-white text-black">
              <Header />
              <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-4">
                  <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/invites" element={<InviteManagement />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/feed" element={<NetworkFeed />} />
                    {/* Add more routes as needed */}
                  </Routes>
                </main>
              </div>
              <Footer />
            </div>
            <Toast />
          </NetworkProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;