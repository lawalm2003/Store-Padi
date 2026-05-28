import useAppTheme from '@/hooks/useAppTheme';
import { useProducts } from '@/hooks/useData';
import { useAuth } from '@/Providers/AuthContext';
import { useCart } from '@/Providers/CartProvider';
import { lookupBarcode } from '@/utils/helper';
import { Ionicons } from '@expo/vector-icons';
import {
  BarcodeScanningResult,
  CameraType,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { ScannedProduct, ScannedResultSheet } from './ScannedResultSheet';
import { ScannerViewfinder } from './ScannerViewfinder';

// ─────────────────────────────────────────────────────────────────────────────
export default function ScannerScreen() {
  const { colors, dark } = useAppTheme();
  const router = useRouter();
  const { shop } = useAuth();
  const { returnTo } = useLocalSearchParams<{
    returnTo?: 'AddProduct' | 'RecordSale';
  }>();

  const { setBarcodeScanData } = useCart();
  const { data: products = [] } = useProducts(shop?.id);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [torchOn, setTorchOn] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<ScannedProduct | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [barcode, setBarcode] = useState('');

  const cooldown = useRef(false);

  // ── Scan handler ────────────────────────────────────────────────────────────
  const handleScan = useCallback(
    async (code: string) => {
      if (cooldown.current) return;
      cooldown.current = true;
      setScanning(false);
      setLoading(true);
      setNotFound(false);
      setProduct(null);
      setBarcode(code);
      Vibration.vibrate(60);

      const result = await lookupBarcode(code, products);
      setLoading(false);
      if (result) {
        setProduct(result);
      } else {
        setNotFound(true);
      }
    },
    [products],
  );

  function onBarcodeScanned(e: BarcodeScanningResult) {
    handleScan(e.data);
  }

  function handleRescan() {
    setProduct(null);
    setNotFound(false);
    setBarcode('');
    setScanning(true);
    cooldown.current = false;
  }

  // ── "Use Details" — pre-fills Add Product form via context ──────────────────
  function handleUseDetails(p: ScannedProduct) {
    setBarcodeScanData({
      barcode: p.barcode,
      name: p.name,
      brand: p.brand,
      category: p.category,
      ...(p.localId ? { productId: p.localId } : {}),
    });
    router.back();
  }

  // ── "Add to Sale" — pre-loads product in Record Sale via context ────────────
  function handleAddToSale(p: ScannedProduct) {
    if (!p.localId) return;
    setBarcodeScanData({ productId: p.localId });
    router.push({
      pathname: '/record-sale',
      params: { productId: p.localId },
    });
  }

  // ── "Add Product" — pre-fills just the barcode ──────────────────────────────
  function handleAddProduct(scannedBarcode: string) {
    setBarcodeScanData({
      barcode: scannedBarcode,
      name: '',
      brand: '',
      category: '',
    });
    router.push('/add-product');
  }

  // ── Permission gate ─────────────────────────────────────────────────────────
  if (!permission?.granted) {
    return (
      <ThemedView
        style={[styles.screen, { backgroundColor: colors.background }]}
      >
        <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
        <View style={styles.permWrap}>
          <View style={[styles.permIcon, { backgroundColor: colors.surface2 }]}>
            <Ionicons name='camera-outline' size={40} color={colors.text3} />
          </View>
          <ThemedText style={[styles.permTitle, { color: colors.text }]}>
            Camera access needed
          </ThemedText>
          <ThemedText style={[styles.permSub, { color: colors.text3 }]}>
            StorePadi needs your camera to scan product barcodes
          </ThemedText>
          <TouchableOpacity
            onPress={requestPermission}
            style={[styles.permBtn, { backgroundColor: colors.primary }]}
          >
            <ThemedText style={styles.permBtnText}>Allow Camera</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()}>
            <ThemedText style={[styles.permBack, { color: colors.text3 }]}>
              Go back
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  const showSheet = loading || product !== null || notFound;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle='light-content' />

      {/* ── Full screen camera ────────────────────────────────────────────── */}
      <CameraView
        style={StyleSheet.absoluteFill}
        facing={facing}
        enableTorch={torchOn}
        barcodeScannerSettings={{
          barcodeTypes: [
            'ean13',
            'ean8',
            'qr',
            'code128',
            'code39',
            'upc_a',
            'upc_e',
          ],
        }}
        onBarcodeScanned={scanning ? onBarcodeScanned : undefined}
      />

      {/* ── Dark vignette around the frame ───────────────────────────────── */}
      <View style={styles.vigTop} pointerEvents='none' />
      <View style={styles.vigBottom} pointerEvents='none' />
      <View style={styles.vigLeft} pointerEvents='none' />
      <View style={styles.vigRight} pointerEvents='none' />

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name='close' size={20} color='#FFF' />
        </TouchableOpacity>

        <ThemedText style={styles.topTitle}>Scan Barcode</ThemedText>

        <TouchableOpacity
          onPress={() => setTorchOn((p) => !p)}
          style={[styles.iconBtn, torchOn && { backgroundColor: '#FAB41E' }]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons
            name={torchOn ? 'flash' : 'flash-outline'}
            size={20}
            color={torchOn ? '#000' : '#FFF'}
          />
        </TouchableOpacity>
      </View>

      {/* ── Centre — viewfinder ──────────────────────────────────────────── */}
      <View style={styles.centre}>
        <ScannerViewfinder color={colors.primary} scanning={scanning} />
        <ThemedText style={styles.hint}>
          {scanning ? 'Point camera at a barcode' : 'Hold still...'}
        </ThemedText>
      </View>

      {/* ── Flip camera ─────────────────────────────────────────────────── */}
      {!showSheet && (
        <TouchableOpacity
          onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
          style={[styles.flipBtn, { backgroundColor: 'rgba(0,0,0,0.45)' }]}
        >
          <Ionicons name='camera-reverse-outline' size={22} color='#FFF' />
        </TouchableOpacity>
      )}

      {/* ── Bottom result sheet ──────────────────────────────────────────── */}
      {showSheet && (
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <View
            style={[styles.sheetHandle, { backgroundColor: colors.border }]}
          />
          <ScannedResultSheet
            barcode={barcode}
            loading={loading}
            product={product}
            notFound={notFound}
            returnTo={returnTo}
            onUseDetails={handleUseDetails}
            onAddToSale={handleAddToSale}
            onRescan={handleRescan}
            onAddProduct={handleAddProduct}
          />
        </View>
      )}
    </View>
  );
}

const OVERLAY = 'rgba(0,0,0,0.60)';
const FRAME = 240;
const TOP_PAD = 130;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  vigTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: TOP_PAD,
    backgroundColor: OVERLAY,
  },
  vigBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: OVERLAY,
  },
  vigLeft: {
    position: 'absolute',
    top: TOP_PAD,
    left: 0,
    width: '50%',
    marginRight: FRAME / 2,
    height: FRAME,
    backgroundColor: OVERLAY,
  },
  vigRight: {
    position: 'absolute',
    top: TOP_PAD,
    right: 0,
    width: '50%',
    marginLeft: FRAME / 2,
    height: FRAME,
    backgroundColor: OVERLAY,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.40)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  hint: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.70)',
  },
  flipBtn: {
    alignSelf: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  sheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 8,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  permWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  permIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  permTitle: {
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
  },
  permSub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  permBtn: {
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 8,
  },
  permBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  permBack: {
    fontSize: 13,
    marginTop: 4,
  },
});
