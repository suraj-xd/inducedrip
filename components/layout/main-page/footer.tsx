"use client"

import { InfoIcon } from "@phosphor-icons/react";

const Footer = () => {
  return (
    <>
      <footer className="w-full flex flex-col gap-10 md:gap-0 pt-20 justify-center items-center bg-gradient-to-b from-white via-gray-50 to-blue-50">
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
            <p className="font-ppMondwest opacity-70 my-5">
              <span className="font-bold font-sans">Designed and Built by</span>
              <br />
              <a
                className="underline font-semibold"
                href="https://thebrowser.company/"
              >
                The XD Code of New York
              </a>
            </p>
            <p className="font-ppMondwest opacity-70 my-5 px-2 text-sm border flex items-center border-gray-200 py-1 bg-gray-100 rounded-md">
              {" "}
              <InfoIcon size={16} className="inline-block mr-2" /> This is not
              the official swag store of the company.
            </p>
          </div>
        </div>

        <div className="w-full py-6 px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              Hosted on
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline flex items-center gap-0.5 transition-colors duration-200"
              >
                Vercel
              </a>
            </div>
            <div className="flex items-center gap-1 mt-2 md:mt-0">
              Ideated with
              <a
                href="https://v0.dev/chat/three-js-logo-converter-JEQ692TQD4t"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline flex items-center transition-colors duration-200 gap-2"
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    clipRule="evenodd"
                    d="M14.252 8.25h5.624c.088 0 .176.006.26.018l-5.87 5.87a1.889 1.889 0 01-.019-.265V8.25h-2.25v5.623a4.124 4.124 0 004.125 4.125h5.624v-2.25h-5.624c-.09 0-.179-.006-.265-.018l5.874-5.875a1.9 1.9 0 01.02.27v5.623H24v-5.624A4.124 4.124 0 0019.876 6h-5.624v2.25zM0 7.5v.006l7.686 9.788c.924 1.176 2.813.523 2.813-.973V7.5H8.25v6.87L2.856 7.5H0z"
                  ></path>
                </svg>
              </a>
              <span className="text-muted-foreground">by</span>
              <a
                href="https://github.com/suraj-xd"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline font-medium hover:text-primary transition-colors duration-200"
              >
                surajgaud
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* <DiaFooter/> */}
    </>
  );
};

export default Footer;
