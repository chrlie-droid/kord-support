'use client';

import Link from 'next/link';

const storageKey = 'kord-support-client-request-draft-v3';

export function NewRequestLink({ className, children = 'Создать новое обращение' }: { className?: string; children?: React.ReactNode }) {
  return (
    <Link
      href="/client/help/wizard?new=1"
      onClick={() => window.localStorage.removeItem(storageKey)}
      className={className}
    >
      {children}
    </Link>
  );
}
