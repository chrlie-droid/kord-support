function parseAttachment(body: string): { type: 'image' | 'file'; label: string; url: string } | null {
  const imageMatch = body.match(/^!\[(.*)]\((.*)\)$/);
  if (imageMatch) {
    return { type: 'image', label: imageMatch[1] || 'image', url: imageMatch[2] };
  }

  const fileMatch = body.match(/^Файл: \[(.*)]\((.*)\)$/);
  if (fileMatch) {
    return { type: 'file', label: fileMatch[1] || 'file', url: fileMatch[2] };
  }

  return null;
}

export function ChatMessage({ authorName, body }: { authorName: string; body: string }) {
  const isOperator = authorName === 'Оператор';
  const attachment = parseAttachment(body);

  return (
    <div className={`max-w-2xl rounded-2xl p-4 text-sm ${isOperator ? 'ml-auto bg-slate-950 text-white' : 'bg-slate-100 text-slate-700'}`}>
      <div className={`mb-2 text-xs font-semibold ${isOperator ? 'text-slate-300' : 'text-slate-500'}`}>{authorName}</div>
      {attachment?.type === 'image' ? (
        <a href={attachment.url} target="_blank" rel="noreferrer" className="block">
          <img src={attachment.url} alt={attachment.label} className="max-h-96 rounded-xl border object-contain" />
          <div className={`mt-2 text-xs ${isOperator ? 'text-slate-300' : 'text-slate-500'}`}>{attachment.label}</div>
        </a>
      ) : attachment?.type === 'file' ? (
        <a href={attachment.url} target="_blank" rel="noreferrer" className={`inline-flex rounded-xl border px-3 py-2 ${isOperator ? 'border-white/20 text-white' : 'text-slate-700'}`}>
          📎 {attachment.label}
        </a>
      ) : (
        <div className="whitespace-pre-line">{body}</div>
      )}
    </div>
  );
}
