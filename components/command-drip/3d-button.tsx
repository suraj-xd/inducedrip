export default function ThreeDButton({
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button onClick={onClick} className={`button ${className}`}>
      <div className="button-outer">
        <div className="button-inner">
          <span>{children}</span>
        </div>
      </div>
    </button>
  );
}   