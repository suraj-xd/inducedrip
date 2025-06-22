import { InfoIcon } from "@phosphor-icons/react";

export default function PatchNotIncluded() {
  return (
    <p className="text-xs text-center px-2 py-1 bg-[#EFEFEF] flex items-center gap-x-2 rounded-md my-2">
      <InfoIcon size={12} /> Patch is not included with the product
    </p>
  );
}
