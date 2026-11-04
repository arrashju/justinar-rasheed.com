// Shim for Need to Talk's MUI skeleton. The demo never loads, so a plain
// block in the product's skeleton fill is enough.
import styled from "styled-components";
import theme from "library/styled";

export const CustomSkeleton = styled.div`
  width: ${(p) => (typeof p.width === "number" ? `${p.width}px` : p.width || "100%")};
  height: ${(p) => (typeof p.height === "number" ? `${p.height}px` : p.height || "100%")};
  border-radius: ${theme.radius.md};
  background: ${theme.color.surfaceSunken};
`;
