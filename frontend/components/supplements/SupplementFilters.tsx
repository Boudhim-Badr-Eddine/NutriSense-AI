"use client";

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
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SupplementFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

interface FilterValues {
  search: string;
  category: string;
  goal: string;
  sort: string;
}

const categories = [
  "all",
  "proteins",
  "creatine",
  "bcaa",
  "pre-workout",
  "recovery",
];
const goals = ["all", "mass gain", "fat loss", "endurance", "recovery"];
const sortOptions = [
  { value: "name", label: "Name (A-Z)" },
  { value: "-name", label: "Name (Z-A)" },
  { value: "-popularity", label: "Most Popular" },
  { value: "popularity", label: "Least Popular" },
];

export const SupplementFilters = ({
  onFilterChange,
}: SupplementFiltersProps) => {
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    category: "all",
    goal: "all",
    sort: "-popularity",
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
      goal: "all",
      sort: "-popularity",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <X className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
      <div>
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="search"
            placeholder="Search supplements..."
            className="pl-10"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
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
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="goal">Goal</Label>
        <Select
          value={filters.goal}
          onValueChange={(value: string) => setFilters({ ...filters, goal: value })}
        >
          <SelectTrigger id="goal">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {goals.map((goal) => (
              <SelectItem key={goal} value={goal}>
                {goal.charAt(0).toUpperCase() + goal.slice(1)}
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
