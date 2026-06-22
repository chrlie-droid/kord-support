import { Shell } from '@/components/shell';

export default function KnowledgePage() {
  return (
    <Shell>
      <h1 className="text-3xl font-bold tracking-tight">База знаний</h1>
      <p className="mt-2 text-slate-600">Инструкции, типовые ошибки и решения, связанные с объектами и заявками.</p>
      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">Здесь будут статьи и быстрые решения для инженеров.</div>
    </Shell>
  );
}
