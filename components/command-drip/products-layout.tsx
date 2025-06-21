import Navbar from "../layout/main-page/navbar";
import Footer from "../layout/main-page/footer";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
