"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

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

export interface ComplementFilterValues {
  search: string;
  category: string;
  sort: string;
}

interface ComplementFiltersProps {
  onFilterChange: (filters: ComplementFilterValues) => void;
}

const categories = [
  "all",
  "vitamin",
  "mineral",
  "antioxidant",
  "omega",
  "adaptogen",
];
const sortOptions = [
  { value: "name", label: "Name (A-Z)" },
  { value: "-name", label: "Name (Z-A)" },
  { value: "-createdAt", label: "Newest" },
  { value: "createdAt", label: "Oldest" },
];

/**
 * WHY: Provide a clean filter UI with debounced updates.
 */
export const ComplementFilters = ({
  onFilterChange,
}: ComplementFiltersProps) => {
  const [filters, setFilters] = useState<ComplementFilterValues>({
    search: "",
    category: "all",
    sort: "-createdAt",
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
      category: "all",
      sort: "-createdAt",
    });
  };

  return (
    <div className="space-y-4 rounded-lg border bg-white p-6 shadow-sm">
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
            placeholder="Search complements..."
            className="pl-10"
            value={filters.search}
            onChange={(event) =>
              setFilters({ ...filters, search: event.target.value })
            }
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={filters.category}
          onValueChange={(value: string) =>
            setFilters({ ...filters, category: value })
          }
        >
          <SelectTrigger id="category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="sort">Sort By</Label>
        <Select
          value={filters.sort}
          onValueChange={(value: string) => setFilters({ ...filters, sort: value })}
        >
          <SelectTrigger id="sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
