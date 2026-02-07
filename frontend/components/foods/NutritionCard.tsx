import { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface NutritionCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  toneClass: string;
}

/**
 * WHY: Reuse a bold CTA card layout across nutrition entry points.
 */
export const NutritionCard = ({
  title,
  description,
  href,
  icon: Icon,
  toneClass,
}: NutritionCardProps) => {
  return (
    <Card className="transition-shadow hover:shadow-xl">
      <CardHeader className="text-center">
        <div
          className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${toneClass}`}
        >
          <Icon className="h-8 w-8" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={href} className="w-full">
          <Button className="w-full" size="lg">
            View Rankings
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
