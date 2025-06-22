import Head from "next/head";
import Navbar from "./navbar";
import Banner from "./banner";
import Footer from "./footer";

export default function MainPage() {
  return (
    <>
      <Head>
        <title>Inducedrip - Swagstore for Induced AI</title>
        <meta name="description" content="Swagstore for Induced AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <Banner />
      <Footer />
    </>
  );
}
