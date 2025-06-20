"use client"

import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
    return (
        <>
            <nav className="w-full px-[5%] md:px-[2.5%] fixed top-0 left-0 bg-white/40 backdrop-blur-md z-[5]">
                <div className="flex justify-between items-center">
                    <div className="flex-1 hidden md:flex gap-8 items-center uppercase font-medium text-[10px] tracking-[1.8px]">
                    </div>
                    <Link href={"/test"}>
                        <div className="flex items-center gap-x-4">
                            <Image src={"/Frame 41.svg"} width={150} height={150} alt="fyi-text" />
                        </div>
                    </Link>
                    <div className="flex-1 hidden md:flex gap-8 items-center justify-end uppercase font-medium text-[10px] tracking-[1.8px] ">
                        {/* <div className="cursor-pointer" onClick={toggleExpand}>Bag</div> */}
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar;