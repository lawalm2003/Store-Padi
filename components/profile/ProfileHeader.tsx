import useAppTheme from '@/hooks/useAppTheme';
import { useAuth } from '@/Providers/AuthContext';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';

type Props = {
  onEditPress: () => void;
};

export function ProfileHeader({ onEditPress }: Props) {
  const { colors } = useAppTheme();
  const { profile, shop } = useAuth();

  // Initials from owner name
  const initials =
    profile?.full_name ||
    ''
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('');

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
        <ThemedText style={styles.initials}>{initials}</ThemedText>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <ThemedText style={[styles.shopName, { color: colors.text }]}>
          {shop?.name}
        </ThemedText>
        {/* <ThemedText style={[styles.ownerName, { color: colors.text3 }]}>
          {shop.ownerName}
        </ThemedText> */}
        <ThemedText style={[styles.email, { color: colors.text3 }]}>
          {shop?.email}
        </ThemedText>
      </View>

      {/* Edit button */}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  initials: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '700',
  },
  ownerName: {
    fontSize: 13,
  },
  email: {
    fontSize: 12,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  devicesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  devicesText: {
    fontSize: 11,
    fontWeight: '500',
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
