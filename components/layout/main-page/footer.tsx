import DiaFooter from "./dia-footer";

const Footer = () => {
  return (
    <>
    <footer className="w-full flex flex-col gap-10 md:gap-0 py-20 justify-center items-center bg-gradient-to-b from-white via-gray-50 to-blue-50">

      <div className="w-[90%] md:w-[95%] flex justify-between items-start md:items-center flex-col md:flex-row gap-16 md:gap-5">
        <div className="flex flex-col gap-1 w-full md:w-auto"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-7 uppercase text-xs cursor-pointer font-medium tracking-[1.8px] pb-10 md:pb-0">
          <a
            href="https://www.instagram.com/fyi.wearit/"
            target="_blank"
            rel="noreferrer"
          >
            social
          </a>
        </div>
      </div>
      <div className="">
        <div className="text-center max-w-prose mx-auto rich-text">
          <p className="font-ppMondwest opacity-70 my-5" >
            Designed and Built by
            <br />
            <a className="underline font-semibold" href="https://thebrowser.company/">The XD Code of New York</a>
          </p>
        </div>
      </div>
    </footer>
      {/* <DiaFooter/> */}
    </>
  );
};

export default Footer;
