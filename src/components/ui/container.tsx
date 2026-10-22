import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12",
        size === "default" && "max-w-[1360px]",
        size === "narrow" && "max-w-4xl",
        size === "wide" && "max-w-[1560px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
