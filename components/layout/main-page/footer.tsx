import DiaFooter from "./dia-footer";

const Footer = () => {
  return (
    <>
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
      <div className="row-start-1 col-span-12 1000:col-span-4 1000:col-start-5 flex flex-col justify-center self-end">
        <div className="text-center max-w-prose mx-auto rich-text">
          <p className="font-ppMondwest opacity-70 my-5" >
            Designed and Built by
            <br />
            <a href="https://thebrowser.company/">The XD Code of New York</a>
          </p>
        </div>
      </div>
      {/* <DiaFooter/> */}
    </>
  );
};

export default Footer;
