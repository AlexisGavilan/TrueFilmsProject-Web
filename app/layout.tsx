import Navbar from '@/components/Navbar';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-neutral-950 text-white min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">{children}</div>
      </body>
    </html>
  );
}