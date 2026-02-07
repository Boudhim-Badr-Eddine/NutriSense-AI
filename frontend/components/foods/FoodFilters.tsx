"use client";

import { Filter, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface FoodFilterValues {
  search: string;
  type: string;
  diet: string;
}

interface FoodFiltersProps {
  onFilterChange: (filters: FoodFilterValues) => void;
}

const types = ["all", "animal", "vegetal", "supplement"];
const diets = ["all", "vegetarian", "vegan", "lactose-free", "gluten-free"];

/**
 * WHY: Provide keyword + diet/type filters with debounce.
 */
export const FoodFilters = ({ onFilterChange }: FoodFiltersProps) => {
  const [filters, setFilters] = useState<FoodFilterValues>({
    search: "",
    type: "all",
    diet: "all",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, onFilterChange]);

  const handleReset = () => {
    setFilters({
      search: "",
      type: "all",
      diet: "all",
    });
  };

  const filtersContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <X className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <div>
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="search"
            placeholder="Search foods..."
            className="pl-10"
            value={filters.search}
            onChange={(event) =>
              setFilters({ ...filters, search: event.target.value })
            }
          />
        </div>
      </div>

      <div>
        <Label htmlFor="type">Type</Label>
        <Select
          value={filters.type}
          onValueChange={(value: string) =>
            setFilters({ ...filters, type: value })
          }
        >
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="diet">Diet</Label>
        <Select
          value={filters.diet}
          onValueChange={(value: string) =>
            setFilters({ ...filters, diet: value })
          }
        >
          <SelectTrigger id="diet">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {diets.map((diet) => (
              <SelectItem key={diet} value={diet}>
                {diet.charAt(0).toUpperCase() + diet.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden rounded-lg border bg-white p-6 shadow-sm md:block">
        {filtersContent}
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Badge variant="secondary">Filters</Badge>
                <span className="text-sm">Refine</span>
              </span>
              <Filter className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader className="mb-4">
              <SheetTitle>Filters</SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="sm">
                  Close
                </Button>
              </SheetClose>
            </SheetHeader>
            {filtersContent}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
