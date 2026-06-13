import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { Toaster } from 'sonner';
import { DemoRoleProvider } from '@/contexts/DemoRoleContext';
import AppHeader from '@/components/AppHeader';
import MobileNav from '@/components/MobileNav';
import SplashScreen from '@/components/SplashScreen';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'Urbio | Premium Home Services',
  description: 'Your one-stop destination for premium home services and professionals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${poppins.variable} font-sans antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-24 md:pb-0`}
      >
        <DemoRoleProvider>
          <SplashScreen />
          <AppHeader />
          <MobileNav />

          <main className="flex-1 w-full">
            {children}
          </main>

          <Toaster position="top-right" richColors />

          <footer className="bg-black border-t border-slate-800 mt-auto text-white">
            <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-2">
                  <Image src="/logo_transparent.png" alt="Urbio Logo" width={64} height={64} className="rounded-sm object-cover object-center invert" />
                </div>
                <p className="mt-4 text-sm text-slate-400">Premium home services at your fingertips. Guaranteed quality, every time.</p>
              </div>

              <div>
                <h4 className="font-bold text-white mb-4">Customers</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link href="#" className="hover:text-white transition-colors">Book a Service</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Urbio Guarantee</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Help & Support</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white mb-4">Professionals</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link href="#" className="hover:text-white transition-colors">Join as a Pro</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Pro Guidelines</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Success Stories</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Terms & Privacy</Link></li>
                </ul>
              </div>
            </div>
            <div className="max-w-6xl mx-auto px-4 py-6 border-t border-slate-800 text-center">
              <p className="text-sm text-slate-500">© 2026 Urbio by SuchirReddy. All rights reserved.</p>
            </div>
          </footer>
        </DemoRoleProvider>
      </body>
    </html>
  );
}
