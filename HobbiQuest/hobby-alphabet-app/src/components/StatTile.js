import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/colors';

export default function StatTile({ value, label }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.xs / 2,
  },
  value: {
    ...typography.h2,
    color: colors.accent,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
});
