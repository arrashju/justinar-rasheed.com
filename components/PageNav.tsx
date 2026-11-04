"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { color, duration, ease, space, type, weight } from "@/styles/tokens";

type Item = { id: string; label: string };

// The portfolio's sections, with the one being read marked. It follows the scroll; a
// click jumps to the section.
export function PageNav({ items, className }: { items: Item[]; className?: string }) {
  const [active, setActive] = useState(items[0]?.id);
  // A click marks its section at once and holds it while the page scrolls there: near the
  // end of the page the last sections can't reach the top, so the scroll alone would mark
  // the one above.
  const heldUntil = useRef(0);

  useEffect(() => {
    const targets = items
      .map((item) => ({ id: item.id, el: document.getElementById(item.id)?.closest("section") }))
      .filter((t): t is { id: string; el: HTMLElement } => Boolean(t.el));
    // The section being read is the last one whose top has passed the upper fifth of the
    // window. At the end of the page it is the last section, however short: a short last
    // section never reaches that line, so it would never be marked.
    let frame = 0;
    const update = () => {
      frame = 0;
      if (Date.now() < heldUntil.current || !targets.length) return;
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const line = window.innerHeight * 0.2;
      const passed = targets.filter((t) => t.el.getBoundingClientRect().top <= line);
      setActive(atEnd ? targets[targets.length - 1].id : (passed[passed.length - 1] ?? targets[0]).id);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav aria-label="On this page" className={className}>
      <List>
        {items.map((item) => (
          <li key={item.id}>
            <Entry
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              onClick={() => {
                heldUntil.current = Date.now() + 1200;
                setActive(item.id);
              }}
            >
              {item.label}
            </Entry>
          </li>
        ))}
      </List>
    </nav>
  );
}

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${space(2)};
`;

const Entry = styled.a`
  ${type.small}
  font-weight: ${weight.medium};
  color: ${color.tertiary};
  transition: color ${duration.fast} ${ease};

  &[aria-current="true"] {
    color: ${color.ink};
  }

  @media (hover: hover) {
    &:hover {
      color: ${color.ink};
    }
  }
`;
