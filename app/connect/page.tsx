import { Suspense } from 'react';
import ConnectClient from './connect-client';

export default function ConnectPage() {
  return (
    <Suspense fallback={null}>
      <ConnectClient />
    </Suspense>
  );
}
