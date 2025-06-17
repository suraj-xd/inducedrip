
const Footer = () => {
    return (
        <div className="w-[90%] md:w-[95%] flex justify-between items-start md:items-center flex-col md:flex-row gap-16 md:gap-5">
            <div className="flex flex-col gap-1 w-full md:w-auto">
                {/* <div className="text-xs tracking-[0.36px]">
                    Join the Conversation
                </div>
                <div className="w-full md:min-w-[340px] relative">
                    <input 
                        type="text" 
                        placeholder="EMAIL ADDRESS"
                        className="w-full text-xs placeholder:tracking-[1.8px] placeholder:text-black p-2 border-b border-black outline-none font-medium"
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 right-1">
                        <HiArrowLongRight size={20} />
                    </div>
                </div> */}
            </div>

            <div className='flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-7 uppercase text-xs cursor-pointer font-medium tracking-[1.8px] pb-10 md:pb-0'>
                {/* <div className='flex items-center gap-1'>
                    India (INR ₹) 
                    <IoIosArrowUp size={16} />
                </div>

                <div>contact</div>
                <div>client services</div>
                <div>legal notices</div> */}
                <a href='https://www.instagram.com/fyi.wearit/' target='_blank' rel='noreferrer'>social</a>
            </div>
        </div>
    )
}

export default Footer;