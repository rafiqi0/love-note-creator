import { createFileRoute, useSearch } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo } from "react";
import { decodeCard } from "@/lib/share-link";
import CardRenderer from "@/components/CardRenderer";
import { DEFAULT_CARD } from "@/lib/card-types";

const search = z.object({
  d: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/card")({
  validateSearch: zodValidator(search),
  head: () => ({
    meta: [
      { title: "A Wish Card For You 💌" },
      { name: "description", content: "Someone made you a custom wish card. Open it!" },
    ],
  }),
  component: CardView,
});

function CardView() {
  const { d } = useSearch({ from: "/card" });
  const card = useMemo(() => (d ? decodeCard(d) : null) ?? DEFAULT_CARD, [d]);
  return <CardRenderer card={card} />;
}
