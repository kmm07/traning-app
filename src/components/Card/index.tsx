function Card({
  children,
  className,
  onClick,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`bg-gray-900_01 border border-blue_gray-900_01 border-solid rounded-[25px] shadow-bs w-full ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export { Card };
