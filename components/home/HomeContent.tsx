// components/home/HomeContent.tsx

import useAppTheme from '@/hooks/useAppTheme';
import { DashboardMetrics } from '@/types';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import RestockAlert from './RestockAlert';
import StatCard from './StatCard';

type Props = {
  data: DashboardMetrics;
  onOpenModal: () => void;
};

export default function HomeContent({ data, onOpenModal }: Props) {
  const { colors } = useAppTheme();

  return (
    <>
      {/* Stat Cards */}
      <View style={styles.statCards}>
        <View style={styles.cardWrapper}>
          <StatCard
            title='Total Revenue'
            value={`₦${data?.totalRevenue?.toLocaleString() ?? 0}`}
            growth={data?.revenueChangePercent}
            color={colors.primary}
          />
        </View>

        <View style={styles.cardWrapper}>
          <StatCard
            title='Net Profit'
            value={`₦${data?.totalProfit?.toLocaleString() ?? 0}`}
            subText={`${data?.profitMarginPercent?.toFixed(1)}% margin`}
            subTextColor={colors.success}
            color={colors.main_green}
          />
        </View>

        <View style={styles.cardWrapper}>
          <StatCard
            title='Products'
            value={`${data?.totalProducts ?? 0} items`}
            subText={`${data?.lowStockCount ?? 0} low stock`}
            color={colors.golden_yellow}
          />
        </View>

        <View style={styles.cardWrapper}>
          <StatCard
            title='Sales Today'
            value={`₦${data?.transactionsToday?.toLocaleString() ?? 0}`}
            subText={`${data?.salesToday ?? 0} transactions`}
            color={colors.purple}
          />
        </View>
      </View>

      {(data?.lowStockCount ?? 0) > 0 && (
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ paddingHorizontal: 16, marginBottom: 16 }}
          onPress={onOpenModal}
        >
          <RestockAlert lowStockCount={data.lowStockCount} />
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  statCards: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 12,
  },
});
