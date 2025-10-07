interface ArrowProps {
  size?: number;
  className?: string;
  color?: string;
  direction?: "left" | "right" | "up" | "down";
}

export default function Arrow({
  size = 24,
  className = "",
  color = "#0077FF",
  direction = "right",
}: ArrowProps) {
  const rotations = {
    right: 0,
    down: 90,
    left: 180,
    up: 270,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `rotate(${rotations[direction]}deg)` }}
    >
      <path
        d="M9 18L15 12L9 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
