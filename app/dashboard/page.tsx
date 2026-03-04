import { Metadata } from 'next';
import DashboardClient from './dashboard-client';

export const metadata: Metadata = {
  title: 'DEFRAG | Dashboard',
};

export default function DashboardPage() {
  return <DashboardClient />;
}
