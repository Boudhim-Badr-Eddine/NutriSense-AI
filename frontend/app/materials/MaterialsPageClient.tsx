"use client";

import { motion } from "framer-motion";
import { Dumbbell, Shield, Sparkles, Wind } from "lucide-react";
import Link from "next/link";

import { useCart } from "@/app/CartContext";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMaterialsData } from "@/hooks/useMaterialsData";
import { formatPrice } from "@/lib/productPricing";

const iconByType = {
  grip: Dumbbell,
  belt: Shield,
  salts: Wind,
  chalk: Sparkles,
  sleeves: Shield,
} as const;

/**
 * WHY: Give users a dedicated accessories section for practical gym materials.
 */
export const MaterialsPageClient = () => {
  const { addItem } = useCart();
  const { materials } = useMaterialsData();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Materials</h1>
          <p className="max-w-3xl text-lg text-gray-600">
            Training accessories for grip, stability, and PR performance:
            straps, belts, smelling salts, chalk, sleeves, and more.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {materials.map((item, index) => {
            const Icon = iconByType[item.icon];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: index * 0.04 }}
              >
                <Card className="h-full border-slate-200/90 bg-white/95 shadow-sm transition-shadow hover:shadow-md">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          "/images/placeholders/product.svg";
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <p className="absolute left-3 bottom-2 text-xs font-medium uppercase tracking-wide text-white/85">
                      {item.category}
                    </p>
                  </div>

                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="secondary">{item.level}</Badge>
                    </div>
                    <CardTitle className="text-xl text-slate-900">
                      {item.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3 text-sm text-slate-600">
                    <p>
                      <span className="font-semibold text-slate-900">
                        Category:
                      </span>{" "}
                      {item.category}
                    </p>
                    <p className="line-clamp-2">{item.purpose}</p>
                    <div className="flex items-center justify-between gap-3 pt-2">
                      <p className="font-semibold text-emerald-700">
                        {formatPrice(item.price)}
                      </p>
                      <Button
                        size="sm"
                        onClick={() =>
                          addItem({
                            id: item.id,
                            type: "material",
                            name: item.name,
                            slug: item.id,
                            image: item.image,
                            price: item.price,
                            category: item.category,
                            detailPath: `/materials/${item.id}`,
                          })
                        }
                      >
                        Add to Grocery
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <Link href={`/materials/${item.id}`}>More details</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};
