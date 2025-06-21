import { SpinnerIcon } from "@phosphor-icons/react";

export default function SpinnerLoadingCenter() {
  return (
    <div className="flex justify-center items-center h-full w-full min-h-[500px]">
      <SpinnerIcon size={24} className="animate-spin" />
    </div>
  );
}