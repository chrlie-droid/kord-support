import { ClientShell } from '@/components/client-shell';
import { RequestWizard } from '@/components/request-wizard';

export default function ClientHelpWizardPage() {
  return (
    <ClientShell>
      <RequestWizard />
    </ClientShell>
  );
}
