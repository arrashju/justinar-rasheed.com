"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { color, duration, ease, space, type, weight } from "@/styles/tokens";

type Item = { id: string; label: string };

// The portfolio's sections, with the one being read marked. It follows the scroll; a
// click jumps to the section.
export function PageNav({ items, className }: { items: Item[]; className?: string }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id)?.closest("section"))
      .filter((el): el is HTMLElement => Boolean(el));
    // A section counts as being read once it crosses the upper part of the window.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          const id = top.target.querySelector("h2")?.id;
          if (id) setActive(id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className={className}>
      <List>
        {items.map((item) => (
          <li key={item.id}>
            <Entry href={`#${item.id}`} aria-current={active === item.id ? "true" : undefined}>
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
