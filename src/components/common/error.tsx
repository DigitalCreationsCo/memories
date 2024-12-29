
import { Alert } from '@/components/ui/alert';
import { useTranslations } from 'next-intl';

interface ErrorProps {
  message?: string;
}

const Error = (props: ErrorProps) => {
  const { message } = props;
  const t = useTranslations('common');

  return (
    <Alert title="error">
      <p>{message || t('unknown-error')}</p>
    </Alert>
  );
};

export default Error;