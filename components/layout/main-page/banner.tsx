import Image from "next/image";
import Link from "next/link";
import { clothes } from "./data";

const Banner = () => {
    return (
        <section className="w-[90%] md:w-[95%] flex flex-col gap-4 mt-20 md:mt-16">
            <img className="h-[100px] sm:h-[15vh] md:h-[30vh] md:mt-[50px] object-contain w-full" src="./brandBanner.png"/>

            {/* filter */}
            {/* <div className="flex gap-2 justify-end items-center font-medium text-xs uppercase tracking-[1.8px] cursor-pointer">
                <div>filter</div>
                <AiOutlinePlus className="stroke-[3]" />
            </div> */}

            {/* items */}
            <div className="grid-cols-2 md:grid-cols-3  grid gap-8 justify-center pt-5  md:pt-16">
                {clothes.map((_, i) => (
                    <Link href={`/product/${i+1}`} key={i} className=" mx-auto flex flex-col gap-2 md:pb-10 group cursor-pointer max-w-[400px]">
                        <Image 
                            src={_.images[0] ?? ""}
                            width={1000}
                            height={1000}
                            className="w-full h-full object-cover"
                            alt="hat"
                        />
                        <div className="flex flex-col text-xs text-black group-hover:text-[#767676] transition-all duration-150">
                            <div className="uppercase leading-4">{_.product_name}</div>
                            {/* <div className="leading-4">
                                Cotton Hat
                            </div> */}
                            <div className="text-[#757575] mt-1 font-medium tracking-[1.8px]">
                                {_.price}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* pagination */}
            {/* <div className="mt-3 w-full flex gap-5 items-center justify-center">
                <div className="w-10 aspect-square rounded-full border border-[#3D4246] text-[#3D4246] grid place-items-center cursor-pointer hover:bg-[#3d4246] hover:text-white transition-all duration-150">
                    <HiArrowLeft />
                </div>
                
                <div className="flex items-center gap-8 text-xs">
                    <div className="font-bold">1</div>
                    <div>2</div>
                    <div>3</div>
                    <div>...</div>
                    <div>10</div>
                </div>

                <div className="w-10 aspect-square rounded-full border border-[#3D4246] text-[#3D4246] grid place-items-center cursor-pointer hover:bg-[#3d4246] hover:text-white transition-all duration-150">
                    <HiArrowRight />
                </div>
            </div> */}
        </section>
    )
}

export default Banner;