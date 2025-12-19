// src/app/page.tsx - SIMPLE: Always redirect to login
import { redirect } from 'next/navigation';

export default function HomePage() {
  // Always go to login page
  redirect('/auth/super-admin');
  return null;
}