import './globals.css';

export const metadata = {
  title: 'ProConnect Service Request Board',
  description: 'Browse and manage trade requests',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
