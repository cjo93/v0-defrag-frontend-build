import { Suspense } from 'react';
import SelfReadoutClient from './readout-self-client';

export default function SelfReadoutPage() {
  return (
    <Suspense fallback={null}>
      <SelfReadoutClient />
    </Suspense>
  );
}
