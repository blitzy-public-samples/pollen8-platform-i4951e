import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, useNetwork } from 'src/shared/contexts/index.ts';
import { Button } from 'src/frontend/components/ui/Button.tsx';
import { Icon } from 'src/frontend/components/ui/Icon.tsx';
import { COLORS } from 'src/shared/constants/index.ts';
import classNames from 'classnames';

const Sidebar: React.FC = React.memo(() => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  const { networkValue } = useNetwork();
  const location = useLocation();

  // Define navigation items
  const navItems = [
    { icon: 'home', label: 'Home', route: '/' },
    { icon: 'network', label: 'My Network', route: '/network' },
    { icon: 'invite', label: 'Invites', route: '/invites' },
    { icon: 'industries', label: 'Industries', route: '/industries' },
  ];

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Automatically collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside
      className={classNames(
        'flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out',
        {
          'w-64': !isCollapsed,
          'w-20': isCollapsed,
        }
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4">
        <Link to="/" className="flex items-center">
          <Icon name="logo" size={32} color={COLORS.PRIMARY} />
          {!isCollapsed && <span className="ml-2 font-bold text-xl">Pollen8</span>}
        </Link>
        <Button
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1"
        >
          <Icon name={isCollapsed ? 'chevron-right' : 'chevron-left'} size={20} />
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-grow mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.route}>
              <Link
                to={item.route}
                className={classNames(
                  'flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100 transition-colors',
                  {
                    'bg-gray-100': location.pathname === item.route,
                  }
                )}
              >
                <Icon name={item.icon} size={24} color={COLORS.PRIMARY} />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Network Value Display */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <Icon name="network-value" size={24} color={COLORS.PRIMARY} />
          {!isCollapsed && (
            <div className="ml-3">
              <div className="text-sm text-gray-500">Network Value</div>
              <div className="font-bold">{networkValue}</div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/profile"
          className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
        >
          <Icon name="user" size={24} color={COLORS.PRIMARY} />
          {!isCollapsed && <span className="ml-3">{user?.username || 'Profile'}</span>}
        </Link>
      </div>
    </aside>
  );
});

export default Sidebar;