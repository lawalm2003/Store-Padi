import CustomTabBar from '@/components/CustomTab';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

type TabConfig = {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
};

export const TABS: TabConfig[] = [
  {
    name: 'index',
    label: 'Home',
    icon: 'home-outline',
    iconActive: 'home',
  },
  {
    name: 'product',
    label: 'Products',
    icon: 'cube-outline',
    iconActive: 'cube',
  },
  {
    name: 'sale',
    label: 'Sales',
    icon: 'cart-outline',
    iconActive: 'cart',
  },
  // {
  //   name: 'report',
  //   label: 'Reports',
  //   icon: 'bar-chart-outline',
  //   iconActive: 'bar-chart',
  // },
  {
    name: 'profile',
    label: 'Profile',
    icon: 'person-outline',
    iconActive: 'person',
  },
];

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name='index' />
      <Tabs.Screen name='product' />
      <Tabs.Screen name='sale' />
      {/* <Tabs.Screen name='report' /> */}
      <Tabs.Screen name='profile' />
    </Tabs>
  );
}
