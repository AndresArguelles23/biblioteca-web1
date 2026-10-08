'use client';

import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Dashboard', exact: true },
  { href: '/inventario', label: 'Inventario' },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {LINKS.map((link) => {
        const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <a
            key={link.href}
            href={link.href}
            className={isActive ? 'active' : ''}
            aria-current={isActive ? 'page' : undefined}
          >
            {link.label}
          </a>
        );
      })}
    </>
  );
}
