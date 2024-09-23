import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useTheme } from 'src/shared/contexts/index.ts';
import { Button, Dropdown } from 'src/frontend/components/ui/index.ts';
import { COLORS } from 'src/shared/constants/index.ts';
import classNames from 'classnames';

export const Header: React.FC = React.memo(() => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = user
    ? [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Network', path: '/network' },
        { label: 'Invites', path: '/invites' },
      ]
    : [
        { label: 'Home', path: '/' },
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' },
      ];

  const Logo = () => (
    <Link to="/" className="flex items-center">
      <span className="text-2xl font-bold text-primary">POLLEN8</span>
    </Link>
  );

  const NavMenu = ({ isMobile = false }) => (
    <nav className={classNames(isMobile ? 'flex flex-col' : 'hidden md:flex')}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  const UserProfile = () => (
    <Dropdown
      options={[
        { label: 'Profile', onClick: () => {} },
        { label: 'Settings', onClick: () => {} },
        { label: 'Logout', onClick: logout },
      ]}
      buttonContent={
        <div className="flex items-center">
          <img
            src={user.avatar || 'default-avatar.png'}
            alt="User avatar"
            className="w-8 h-8 rounded-full mr-2"
          />
          <span>{user.username}</span>
        </div>
      }
    />
  );

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Logo />

        <div className="hidden md:flex items-center space-x-4">
          <NavMenu />
          {user ? (
            <UserProfile />
          ) : (
            <Button
              label="Login"
              onClick={() => {}}
              variant="primary"
              size="sm"
            />
          )}
          <Button
            label={theme === 'light' ? '🌙' : '☀️'}
            onClick={toggleTheme}
            variant="secondary"
            size="sm"
            aria-label="Toggle theme"
          />
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          ☰
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <NavMenu isMobile />
          {user ? (
            <UserProfile />
          ) : (
            <Button
              label="Login"
              onClick={() => {}}
              variant="primary"
              size="sm"
              className="w-full mt-2"
            />
          )}
          <Button
            label={theme === 'light' ? '🌙' : '☀️'}
            onClick={toggleTheme}
            variant="secondary"
            size="sm"
            className="w-full mt-2"
            aria-label="Toggle theme"
          />
        </div>
      )}
    </header>
  );
});

Header.displayName = 'Header';