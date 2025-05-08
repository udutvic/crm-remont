import { useState, useCallback } from 'react';
type Order = 'asc' | 'desc';
interface SortingOptions<T> {
  defaultOrderBy: keyof T;
  defaultDirection?: Order;
}
export function useSorting<T>({ defaultOrderBy, defaultDirection = 'desc' }: SortingOptions<T>) {
  const [orderDirection, setOrderDirection] = useState<Order>(defaultDirection);
  const [orderBy, setOrderBy] = useState<keyof T>(defaultOrderBy);
  const handleRequestSort = useCallback((property: keyof T) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [orderBy, orderDirection]);
  const sortItems = useCallback((items: T[]) => {
    return [...items].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      if (!aValue || !bValue) {
        return 0;
      }
      if (
        orderBy === 'createdAt' as keyof T || 
        orderBy === 'date' as keyof T
      ) {
        const dateA = new Date(aValue as string).getTime();
        const dateB = new Date(bValue as string).getTime();
        return orderDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (orderBy === 'price' as keyof T) {
        const numA = Number(aValue) || 0;
        const numB = Number(bValue) || 0;
        return orderDirection === 'asc' ? numA - numB : numB - numA;
      }
      return orderDirection === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [orderBy, orderDirection]);
  return {
    orderBy,
    orderDirection,
    handleRequestSort,
    sortItems
  };
}
export default useSorting;
