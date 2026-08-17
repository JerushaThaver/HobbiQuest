import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import { colors, radius, typography, spacing } from '../theme/colors';

export default function LetterTile({ letter, hobbies = [], onPress }) {
  const isComplete = hobbies.length > 0;
  const photoHobbies = hobbies.filter((h) => h.photos && h.photos.length > 0);

  return (
    <TouchableOpacity
      style={[styles.tile, isComplete ? styles.tileComplete : styles.tileEmpty]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {isComplete ? (
        photoHobbies.length >= 2 ? (
          <View style={styles.collage}>
            <Image source={{ uri: photoHobbies[0].photos[0].uri }} style={styles.collageHalf} />
            <Image source={{ uri: photoHobbies[1].photos[0].uri }} style={styles.collageHalf} />
          </View>
        ) : photoHobbies.length === 1 ? (
          <Image source={{ uri: photoHobbies[0].photos[0].uri }} style={styles.thumb} />
        ) : (
          <View style={styles.noPhotoFill}>
            <Text style={styles.letterComplete}>{letter}</Text>
          </View>
        )
      ) : (
        <Text style={styles.letterEmpty}>{letter}</Text>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerLetter}>{letter}</Text>
        {isComplete && (
          <Text numberOfLines={1} style={styles.footerName}>
            {hobbies.length === 1 ? hobbies[0].name : `${hobbies.length} hobbies`}
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
  collage: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  collageHalf: {
    flex: 1,
    height: '100%',
  },
  noPhotoFill: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterEmpty: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.lg,
    color: colors.textMuted,
  },
  letterComplete: {
    ...typography.h1,
    color: colors.success,
  },
  footer: {
    backgroundColor: 'rgba(255,253,248,0.9)',
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
