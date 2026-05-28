import ContentLoading from '@/components/ContentLoading';
import SaleReceiptScreen from '@/components/sales/SaleReceiptScreen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSale } from '@/hooks/useData';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function SaleReceiptRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  // const sale = DUMMY_SALES.find((s) => s.id === id);
  const { data: sale, isLoading } = useSale(id);

  if (isLoading) return <ContentLoading />;

  if (!sale) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Sale not found</ThemedText>
      </ThemedView>
    );
  }

  return <SaleReceiptScreen sale={sale} onClose={() => router.back()} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
