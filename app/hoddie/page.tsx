import Footer from "@/components/layout/main-page/footer";
import Navbar from "@/components/layout/main-page/navbar";
import ViewerPage from "@/components/products/jeans/page";
import CustomShirtPage from "./custom-shirt-page";

export default function ShirtPage() {
  return(
    <>
    <Navbar/>
    <CustomShirtPage/>
    <Footer/>
    </>
  );
}