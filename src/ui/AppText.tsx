import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';

type TextVariant = 'title' | 'body' | 'caption';

interface AppTextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

export function AppText({ children, variant = 'body', style, numberOfLines }: AppTextProps) {
  return (
    <Text style={[styles.base, styles[variant], style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: '#111827',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6b7280',
  },
});