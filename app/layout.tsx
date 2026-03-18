import type { Metadata } from 'next';
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata: Metadata = {
  title: 'DSCPortal — Digital Signature Certificates Paperless & Instant | CCA Licensed CA',
  description: 'Apply for Class 3, DGFT, and Document Signer DSCs in under 10 minutes. 100% paperless video-based eKYC. CCA Licensed Certifying Authority under IT Act 2000.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
