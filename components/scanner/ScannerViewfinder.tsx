import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const FRAME = 240;
const CORNER = 20;
const THICK = 3;

type Props = {
  color: string;
  scanning: boolean;
};

export function ScannerViewfinder({ color, scanning }: Props) {
  const laser = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!scanning) {
      laser.stopAnimation();
      laser.setValue(0);
      return;
    }
    Animated.loop(
      Animated.sequence([
        Animated.timing(laser, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(laser, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [scanning]);

  const laserY = laser.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FRAME - 2],
  });

  const c = color;
  const corners: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    horizontal: boolean;
  }[] = [
    { top: 0, left: 0, horizontal: true },
    { top: 0, left: 0, horizontal: false },
    { top: 0, right: 0, horizontal: true },
    { top: 0, right: 0, horizontal: false },
    { bottom: 0, left: 0, horizontal: true },
    { bottom: 0, left: 0, horizontal: false },
    { bottom: 0, right: 0, horizontal: true },
    { bottom: 0, right: 0, horizontal: false },
  ];

  return (
    <View style={[styles.frame, { width: FRAME, height: FRAME }]}>
      {/* Corner brackets */}
      {corners.map((corner, i) => (
        <View
          key={i}
          style={[
            styles.corner,
            {
              top: corner.top,
              bottom: corner.bottom,
              left: corner.left,
              right: corner.right,
              width: corner.horizontal ? CORNER : THICK,
              height: corner.horizontal ? THICK : CORNER,
              backgroundColor: c,
            },
          ]}
        />
      ))}

      {/* Laser */}
      {scanning && (
        <Animated.View
          style={[
            styles.laser,
            {
              backgroundColor: c,
              transform: [{ translateY: laserY }],
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    borderRadius: 2,
  },
  laser: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
    opacity: 0.85,
  },
});
