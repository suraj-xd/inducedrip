interface ProductInfoProps {
  name?: string;
  price?: string;
}

export default function ProductInfo({ name, price }: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-y-1">
      <div className="text-2xl font-semibold">{name}</div>
      <div className="text-xs text-[#757575]">{price}</div>
    </div>
  );
} 