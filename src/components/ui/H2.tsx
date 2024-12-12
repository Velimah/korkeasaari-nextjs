import { cn } from "@/utils/twMerge";

export function H2(props: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h2
      {...props}
      className={cn("text-2xl font-semibold tracking-tight", props.className)}
    />
  );
}
