import Link from 'next/link';
import React from 'react';

type NavLink = {
  href: string;
  label: string;
};

type NavigationMenuProps = {
  links: NavLink[];
  className?: string;
};

const NavigationMenu: React.FC<NavigationMenuProps> = ({ links, className = '' }) => {
  return (
    <nav className={`text-black ${className}`}>
      <ul className="flex space-x-4 p-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} legacyBehavior>
              <a className="hover:text-gray-400">{link.label}</a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationMenu;
