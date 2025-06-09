// app/layout.jsx
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import './globals.css';

export const metadata = {
  title: 'Your App',
  description: 'Your app description',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
  