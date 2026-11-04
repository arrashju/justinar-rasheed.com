// The icon vocabulary, after Need to Talk's barrel: UI glyphs come from lucide-react and
// only from here, with the stroke set by size (2 below 22px, 1.75 at 22 and up), so call
// sites pass `size` and nothing else. Brand marks live in ./brand.
import { forwardRef } from "react";
import { Mail as LucideMail, type LucideIcon, type LucideProps } from "lucide-react";

export { ICON_SIZE } from "./size";
export { GitHubIcon, LinkedInIcon } from "./brand";

const sized = (Icon: LucideIcon) => {
  const Sized = forwardRef<SVGSVGElement, LucideProps>(function SizedIcon({ size = 24, strokeWidth, ...rest }, ref) {
    const px = typeof size === "number" ? size : 24;
    return <Icon ref={ref} size={size} strokeWidth={strokeWidth ?? (px >= 22 ? 1.75 : 2)} aria-hidden="true" {...rest} />;
  });
  Sized.displayName = Icon.displayName;
  return Sized;
};

export const Mail = sized(LucideMail); // email
