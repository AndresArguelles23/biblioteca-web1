'use client';

import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Dashboard', exact: true },
  { href: '/inventario', label: 'Inventario' },
  { href: '/revisar', label: 'Revisar', countKey: 'pendientes' },
];

export default function NavLinks({ pendientes }) {
  const pathname = usePathname();

  return (
    <>
      {LINKS.map((link) => {
        const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        const count = link.countKey === 'pendientes' ? pendientes : null;
        return (
          <a
            key={link.href}
            href={link.href}
            className={isActive ? 'active' : ''}
            aria-current={isActive ? 'page' : undefined}
          >
            {link.label}
            {!!count && <span className="nav-count">{count > 99 ? '99+' : count}</span>}
          </a>
        );
      })}
    </>
  );
}
