import { Suspense } from 'react';
import GridClient from './grid-client';

export default function GridPage() {
  return (
    <Suspense fallback={null}>
      <GridClient />
    </Suspense>
  );
}
