function Card({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-gray-900_01 border border-blue_gray-900_01 border-solid rounded-[25px] shadow-bs w-full ${className}`}
    >
      {children}
    </div>
  );
}

export { Card };
