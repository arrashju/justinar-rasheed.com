"use client";

import { createGlobalStyle } from "styled-components";
import { color, colorVars, ease, media, type, weight } from "./tokens";

export const GlobalStyle = createGlobalStyle`
  :root {
    ${colorVars.light}
    color-scheme: light dark;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      ${colorVars.dark}
    }
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    -webkit-text-size-adjust: 100%;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    margin: 0;
    /* The homepage cover bleeds to the window's edges; never let it add a sideways scroll. */
    overflow-x: clip;
    background: ${color.bg};
    color: ${color.ink};
    font-family: var(--font-sans), ui-sans-serif, system-ui, -apple-system, sans-serif;
    font-weight: ${weight.regular};
    font-feature-settings: "cv11", "ss01";
    ${type.body}
  }

  h1, h2, h3, p, ul, ol, dl, dd, figure {
    margin: 0;
  }

  ul, ol {
    padding: 0;
    list-style: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ::selection {
    background: ${color.selection};
  }

  :focus-visible {
    outline: 2px solid ${color.accent};
    outline-offset: 3px;
    border-radius: 4px;
  }

  ${media.motion} {
    html {
      scroll-behavior: smooth;
    }

    main {
      animation: enter 480ms ${ease} both;
    }

    @keyframes enter {
      from {
        opacity: 0;
        transform: translateY(6px);
      }
    }

    /* For a page exactly the window's height, where the 6px rise would overflow it. */
    @keyframes fade {
      from {
        opacity: 0;
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      transition-duration: 0ms !important;
    }
  }

  /* Used by the skip link and icon-only text. */
  .visually-hidden:not(:focus) {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
`;
