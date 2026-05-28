import { Sale, SaleFilterPeriod } from '@/types';

export function filterSales(sales: Sale[], period: SaleFilterPeriod): Sale[] {
  const now = new Date();
  return sales.filter((sale) => {
    const d = new Date(sale.createdAt);
    if (period === 'today') return d.toDateString() === now.toDateString();
    if (period === 'this_week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return d >= weekAgo;
    }
    if (period === 'this_month')
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    return true;
  });
}

export function groupByDate(sales: Sale[]): { date: string; data: Sale[] }[] {
  const map = new Map<string, Sale[]>();
  sales.forEach((sale) => {
    const d = new Date(sale.createdAt);
    const now = new Date();
    let label: string;
    if (d.toDateString() === now.toDateString()) {
      label = 'Today';
    } else {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      label =
        d.toDateString() === yesterday.toDateString()
          ? 'Yesterday'
          : d.toLocaleDateString([], {
              weekday: 'long',
              day: 'numeric',
              month: 'short',
            });
    }
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(sale);
  });
  return Array.from(map.entries()).map(([date, data]) => ({ date, data }));
}
