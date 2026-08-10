import { Construction } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';

interface ComingSoonProps {
  title: string;
}

export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div>
      <PageHeader title={title} />
      <EmptyState
        icon={<Construction className="w-6 h-6" />}
        title="Coming Soon"
        description={`The ${title} section is under development and will be available soon.`}
      />
    </div>
  );
}
