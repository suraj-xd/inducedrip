import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <div
      onClick={() => router.back()}
      className="cursor-pointer uppercase text-xs font-semibold flex items-center gap-x-2"
    >
      <ArrowLeftIcon size={16} />
      <span>Back</span>
    </div>
  );
}