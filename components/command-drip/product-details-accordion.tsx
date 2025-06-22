"use client";

import { useState } from "react";

interface ProductDetailsAccordionProps {
  details: string[];
}

export default function ProductDetailsAccordion({
  details,
}: ProductDetailsAccordionProps) {
  const [toggle, setToggle] = useState<
    "details" | "shipping" | "share" | null
  >(null);

  return (
    <div className="mt-4 text-xs">
      <div
        onClick={() =>
          setToggle((prev) => (prev === "details" ? null : "details"))
        }
        className="uppercase cursor-pointer tracking-[1.1px]"
      >
        Details{" "}
        <span className="text-sm">{toggle === "details" ? "-" : "+"}</span>
      </div>
      <div
        className={`ml-4 my-4 cursor-pointer ${
          toggle === "details" ? "block" : "hidden"
        }`}
      >
        <ul className="list-disc font-semibold">
          {details.map((d, id) => (
            <li key={id}>{d}</li>
          ))}
        </ul>
      </div>

      <div
        onClick={() =>
          setToggle((prev) => (prev === "shipping" ? null : "shipping"))
        }
        className="uppercase cursor-pointer tracking-[1.1px]"
      >
        Shipping Policy{" "}
        <span className="text-sm">{toggle === "shipping" ? "-" : "+"}</span>
      </div>
      <div
        className={`ml-4 my-4 cursor-pointer ${
          toggle === "shipping" ? "block" : "hidden"
        }`}
      >
        <ul className="list-disc font-semibold">
          <li>This Product Is Not Available For Immediate Shipment</li>
          <li>Custom orders may take up to 7 to 10 days to ship</li>
        </ul>
      </div>

      <div
        onClick={() => setToggle((prev) => (prev === "share" ? null : "share"))}
        className="uppercase cursor-pointer tracking-[1.1px]"
      >
        Share <span className="text-sm">{toggle === "share" ? "-" : "+"}</span>
      </div>
      <div
        className={`ml-4 my-4 cursor-pointer ${
          toggle === "share" ? "block" : "hidden"
        }`}
      >
        <ul className="list-disc font-semibold">
          <a
            href="https://www.instagram.com/suraj.xdd"
            target="_blank"
            rel="noreferrer"
          >
            INSTAGRAM
          </a>
        </ul>
      </div>
    </div>
  );
} 