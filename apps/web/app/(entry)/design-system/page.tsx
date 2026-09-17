import { redirect } from 'next/navigation';
import { designSystemOrigin } from '@/lib/design-system';
export default function Page() {
  redirect(`${designSystemOrigin}/fa`);
}
