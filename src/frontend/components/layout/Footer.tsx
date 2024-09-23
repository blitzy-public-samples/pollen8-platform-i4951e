import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from 'src/shared/contexts/index.ts';
import { COLORS } from 'src/shared/constants/index.ts';
import classNames from 'classnames';

const Footer: React.FC = React.memo(() => {
  const { theme } = useTheme();

  const footerLinks = [
    { name: 'About', path: '/about' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ];

  const socialIcons = [
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com/pollen8' },
    { name: 'LinkedIn', icon: '🔗', url: 'https://linkedin.com/company/pollen8' },
    { name: 'Instagram', icon: '📷', url: 'https://instagram.com/pollen8' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className={classNames(
      'bg-white border-t border-gray-200 py-8',
      { 'text-black': theme === 'light', 'text-white bg-black': theme === 'dark' }
    )}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <ul className="flex flex-wrap">
              {footerLinks.map((link) => (
                <li key={link.name} className="mr-6 mb-2">
                  <Link 
                    to={link.path}
                    className="hover:text-gray-600 transition-colors duration-200"
                    aria-label={link.name}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/3 mb-4 md:mb-0 flex justify-center">
            {socialIcons.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2 text-2xl hover:text-gray-600 transition-colors duration-200"
                aria-label={`Follow us on ${social.name}`}
              >
                {social.icon}
              </a>
            ))}
          </div>
          <div className="w-full md:w-1/3 text-center md:text-right">
            <p>&copy; {currentYear} Pollen8. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;