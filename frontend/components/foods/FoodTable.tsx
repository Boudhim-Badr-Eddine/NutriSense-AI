'use client';

import { ArrowUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Food } from '@/types';
import { FoodTableRow } from './FoodTableRow';

interface FoodTableProps {
  foods: Food[];
  highlightColumn?: 'proteins' | 'carbs' | 'fats';
}

/**
 * WHY: Present sortable nutrition rankings with responsive table layout.
 */
export const FoodTable = ({ foods, highlightColumn }: FoodTableProps) => {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<string>(highlightColumn || 'proteins');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const sortedFoods = useMemo(() => {
    const getValue = (food: Food) => {
      if (sortBy === 'name') {
        return food.name;
      }

      if (sortBy === 'proteinCalorieRatio') {
        return food.per100g.calories > 0
          ? (food.per100g.proteins * 4) / food.per100g.calories
          : 0;
      }

      return food.per100g[sortBy as keyof typeof food.per100g] || 0;
    };

    return [...foods].sort((a, b) => {
      const aValue = getValue(a);
      const bValue = getValue(b);

      if (typeof aValue === 'string' || typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      }

      return sortOrder === 'asc'
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    });
  }, [foods, sortBy, sortOrder]);

  const detailPath = (food: Food): string =>
    `/nutrition/foods/${food.slug || food._id}`;

  return (
    <>
      <div className='hidden overflow-hidden rounded-lg border bg-white md:block'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant='ghost' onClick={() => handleSort('name')}>
                  Food Name <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant='ghost' onClick={() => handleSort('calories')}>
                  Calories <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
              </TableHead>
              <TableHead
                className={highlightColumn === 'proteins' ? 'bg-primary/10' : ''}
              >
                <Button variant='ghost' onClick={() => handleSort('proteins')}>
                  Protein (g) <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
              </TableHead>
              <TableHead
                className={highlightColumn === 'carbs' ? 'bg-primary/10' : ''}
              >
                <Button variant='ghost' onClick={() => handleSort('carbs')}>
                  Carbs (g) <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
              </TableHead>
              <TableHead
                className={highlightColumn === 'fats' ? 'bg-primary/10' : ''}
              >
                <Button variant='ghost' onClick={() => handleSort('fats')}>
                  Fats (g) <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant='ghost'
                  onClick={() => handleSort('proteinCalorieRatio')}
                >
                  P/Cal Ratio <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedFoods.map((food, index) => (
              <FoodTableRow
                key={food._id}
                food={food}
                index={index}
                highlightColumn={highlightColumn}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className='space-y-4 md:hidden'>
        {sortedFoods.map((food) => (
          <Card
            key={food._id}
            className='cursor-pointer transition-shadow hover:shadow-md'
            onClick={() => router.push(detailPath(food))}
          >
            <CardHeader>
              <CardTitle className='text-lg'>{food.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-2 text-sm text-slate-600'>
                <div>Calories: {food.per100g.calories}</div>
                <div>Protein: {food.per100g.proteins}g</div>
                <div>Carbs: {food.per100g.carbs}g</div>
                <div>Fats: {food.per100g.fats}g</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};
