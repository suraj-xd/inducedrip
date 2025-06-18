"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function DiaFooter() {
  const imageRef = useRef<HTMLDivElement>(null);
  const [scaleY, setScaleY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return;

      const imageRect = imageRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.scrollY;
      
      // Calculate how far we are from the bottom of the page
      const distanceFromBottom = documentHeight - (scrollPosition + windowHeight);
      
      // Start animation when we're approaching the footer
      // Use a larger threshold to make the animation more gradual
      const threshold = windowHeight * 1.2;
      
      if (distanceFromBottom < threshold) {
        // Calculate scale based on proximity to bottom
        // This creates a more fluid, gradual scaling effect
        const newScale = Math.max(0, Math.min(1 - (distanceFromBottom / threshold), 1));
        setScaleY(newScale);
      } else {
        setScaleY(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="w-full relative">
      <footer role="contentinfo" className="relative">
        <div 
          ref={imageRef}
          className="absolute bottom-0 left-0 right-0 h-40 md:h-60 lg:h-[65vh] overflow-hidden z-0"
        >
          <div
            style={{
              transform: `scaleY(${scaleY})`,
              transformOrigin: "bottom",
              transition: "transform 0.3s ease-out",
            }}
          >
            <Image
              className="w-full h-full"
              src="/dia-svg.svg"
              alt="Dia Footer"
              width={1271}
              height={599}
            />
          </div>
        </div>
        
        <section className="overflow-x-clip relative z-10" aria-label="Site footer">
          <nav className="h-max w-full site-grid justify-center items-baseline font-mono uppercase text-13 leading-16 tracking-10 py-20 gap-y-24" aria-label="Footer navigation">
            <ul className="hidden 1000:flex row-start-1 col-span-3 col-start-2 justify-center gap-40 800:justify-start self-end" aria-label="Legal information">
              <li>
                <span className="inline-block">
                  <a className="link--underline--hover hidden 800:block" title="Careers" target="_blank" rel="noopener noreferrer" aria-label="Careers (opens in new window)" href="https://thebrowser.company/careers">Careers</a>
                </span>
                <a className="800:hidden" title="Careers" target="_blank" rel="noopener noreferrer" aria-label="Careers (opens in new window)" href="https://thebrowser.company/careers">Careers</a>
              </li>
              <li>
                <span className="inline-block mr-12">
                  <a className="link--underline--hover hidden 800:block" title="Privacy Policy" href="/privacy">Privacy Policy</a>
                </span>
                <a className="800:hidden" title="Privacy Policy" href="/privacy">Privacy Policy</a>
              </li>
            </ul>
            <div className="row-start-1 col-span-12 1000:col-span-4 1000:col-start-5 flex flex-col justify-center self-end">
              <div className="text-center max-w-prose mx-auto rich-text">
                <p>Designed and Built by<br />
                  <a href="https://thebrowser.company/">The Browser Company of New York</a>
                </p>
              </div>
              <nav aria-label="Social media links">
                <ul className="mt-24 flex flex-wrap justify-center gap-20">
                  <li>
                    <a className="link--underline--hover" title="X" target="_blank" rel="noopener noreferrer" aria-label="X (opens in new window)" href="https://x.com/diabrowser">X</a>
                  </li>
                  <li>
                    <a className="link--underline--hover" title="Instagram" target="_blank" rel="noopener noreferrer" aria-label="Instagram (opens in new window)" href="https://www.instagram.com/diabrowser/">Instagram</a>
                  </li>
                  <li>
                    <a className="link--underline--hover" title="LinkedIn" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in new window)" href="https://www.linkedin.com/company/the-browser-company/posts/?feedView=all">LinkedIn</a>
                  </li>
                </ul>
              </nav>
            </div>
            <p className="hidden 1000:flex col-span-3 col-start-9 justify-end self-end">
              <span className="hidden 800:block">
                <span className="inline-block mr-12">Current Status:{" "}</span>
                <span className="inline-block">Beta</span>
              </span>
              <span className="800:hidden">Current Status: Beta</span>
            </p>
            <div className="1000:hidden col-span-12 flex flex-wrap justify-center gap-x-40 gap-y-24">
              <ul className="flex flex-wrap justify-center gap-x-40 gap-y-24" aria-label="Legal information">
                <li>
                  <a className="link--underline--hover" title="Careers" target="_blank" rel="noopener noreferrer" aria-label="Careers (opens in new window)" href="https://thebrowser.company/careers">Careers</a>
                </li>
                <li>
                  <a className="link--underline--hover" title="Privacy Policy" href="/privacy">Privacy Policy</a>
                </li>
              </ul>
              <p>Current Status: Beta</p>
            </div>
          </nav>
        </section>
        
        {/* Add padding to ensure content doesn't overlap with the absolute positioned SVG */}
        <div className="h-40 md:h-60 lg:h-[65vh]"></div>
      </footer>
    </div>
  );
}
