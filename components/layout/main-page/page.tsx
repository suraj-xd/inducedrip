import Head from "next/head";
import Navbar from "./navbar";
import Banner from "./banner";
import Footer from "./footer";


export default function MainPage() {
    return (
        <>
            <Head>
                <title>FYI Clothing</title>
                <meta name="description" content="Fashion Your Identity. Defining fashion through authenticity and individuality. Every piece a chapter in your style narrative. #fashionyouridentity" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
                <Navbar />
                <Banner />
                <Footer />
        </>
    );
}
