"use client";

import { ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";

import { useCart } from "@/app/CartContext";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMaterialsData } from "@/hooks/useMaterialsData";
import { formatPrice } from "@/lib/productPricing";

interface MaterialDetailPageClientProps {
  id: string;
}

/**
 * WHY: Show material details with direct add-to-grocery flow.
 */
export const MaterialDetailPageClient = ({
  id,
}: MaterialDetailPageClientProps) => {
  const { materials } = useMaterialsData();
  const material = materials.find((item) => item.id === id);
  const { addItem } = useCart();

  if (!material) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <Container>
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="text-xl font-semibold text-slate-900">
                Material not found
              </p>
              <p className="text-sm text-slate-500">
                This item does not exist or has been removed.
              </p>
              <Button asChild>
                <Link href="/materials">Back to Materials</Link>
              </Button>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/materials">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Materials
            </Link>
          </Button>
        </div>

        <Card className="overflow-hidden border-slate-200">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="relative aspect-square bg-slate-100">
              <img
                src={material.image}
                alt={material.name}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/images/placeholders/product.svg";
                }}
              />
            </div>

            <CardContent className="p-6 lg:p-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <Badge variant="secondary">{material.level}</Badge>
                <Badge variant="outline">{material.category}</Badge>
              </div>

              <h1 className="mb-2 text-3xl font-bold text-slate-900">
                {material.name}
              </h1>
              <p className="mb-5 text-lg font-semibold text-emerald-700">
                {formatPrice(material.price)}
              </p>

              <p className="mb-6 text-slate-600">{material.description}</p>
              <p className="mb-8 text-sm text-slate-500">{material.purpose}</p>

              <Button
                className="w-full sm:w-auto"
                onClick={() =>
                  addItem({
                    id: material.id,
                    type: "material",
                    name: material.name,
                    slug: material.id,
                    image: material.image,
                    price: material.price,
                    category: material.category,
                    detailPath: `/materials/${material.id}`,
                  })
                }
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Grocery
              </Button>
            </CardContent>
          </div>
        </Card>
      </Container>
    </div>
  );
};
