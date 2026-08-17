import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import { colors, radius, typography, spacing } from '../theme/colors';

export default function LetterTile({ letter, entry, onPress }) {
  const isComplete = !!entry;

  return (
    <TouchableOpacity
      style={[styles.tile, isComplete ? styles.tileComplete : styles.tileEmpty]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {isComplete && entry.photoUri ? (
        <Image source={{ uri: entry.photoUri }} style={styles.thumb} />
      ) : (
        <Text style={[styles.letter, isComplete ? styles.letterComplete : styles.letterEmpty]}>
          {letter}
        </Text>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerLetter}>{letter}</Text>
        {isComplete && (
          <Text numberOfLines={1} style={styles.footerName}>
            {entry.hobbyName}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const TILE_SIZE = 100;

const styles = StyleSheet.create({
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: radius.md,
    margin: spacing.xs,
    overflow: 'hidden',
    borderWidth: 1,
    justifyContent: 'flex-end',
  },
  tileEmpty: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
  },
  tileComplete: {
    backgroundColor: colors.successMuted,
    borderColor: colors.success,
  },
  thumb: {
    ...StyleSheet.absoluteFillObject,
  },
  letter: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  letterEmpty: {
    color: colors.textMuted,
  },
  letterComplete: {
    color: colors.success,
  },
  footer: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
  },
  footerLetter: {
    ...typography.label,
    color: colors.textSecondary,
  },
  footerName: {
    ...typography.caption,
    color: colors.textPrimary,
  },
});
