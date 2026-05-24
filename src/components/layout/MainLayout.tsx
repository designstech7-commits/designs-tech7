import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export default function MainLayout({ children, hideFooter = false }: MainLayoutProps) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}
