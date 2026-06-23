'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function ChatAutoRefresh({ intervalMs = 5000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setInterval(() => {
      router.refresh();
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, router]);

  return <div className="text-xs text-slate-400">чат автообновляется каждые {Math.round(intervalMs / 1000)} сек.</div>;
}
