"use client"

import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
    return (
        <>
            <nav className="w-full px-[5%] md:px-[2.5%] fixed top-0 left-0 bg-white/40 backdrop-blur-md z-[5]">
                <div className="flex justify-center items-center">
                    <Link href={"/"}>
                        <div className="flex items-center gap-x-4">
                            <Image src={"/Frame 41.png"} width={150} height={150} alt="fyi-text" />
                        </div>
                    </Link>
                </div>
            </nav>
        </>
    )
}

export default Navbar;