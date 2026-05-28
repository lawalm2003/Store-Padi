import ContentLoading from '@/components/ContentLoading';
import ProductDetailScreen from '@/components/product/productDetails/ProductDetailScreen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useProduct } from '@/hooks/useData';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function ProductDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  // const product = DUMMY_PRODUCTS.find((p) => p.id === id);

  const { data: product, isLoading } = useProduct(id);

  if (isLoading) return <ContentLoading />;

  if (!product) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Sale not found</ThemedText>
      </ThemedView>
    );
  }

  return <ProductDetailScreen product={product} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
