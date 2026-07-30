import { getAllAssets } from '@/lib/assets';
import AdminDashboardClient from '@/components/AdminDashboardClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Control Center | BrokenCheats Store',
  description: 'Protected administrative management portal for game assets, URL slugs, and ad network placements.',
};

export const revalidate = 0;

export default async function AdminPage() {
  const assets = await getAllAssets(true); // Fetch all assets including hidden
  return <AdminDashboardClient initialAssets={assets} />;
}
