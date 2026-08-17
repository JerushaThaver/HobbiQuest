import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme/colors';
import { getAllHobbiesFlat } from '../utils/storage';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function CollageScreen({ navigation }) {
  const [hobbies, setHobbies] = useState({});

  const loadHobbies = useCallback(async () => {
    const flat = await getAllHobbiesFlat();
    const hobbyMap = {};
    flat.forEach((h) => {
      hobbyMap[h.letter] = h;
    });
    setHobbies(hobbyMap);
  }, []);

  React.useEffect(() => {
    loadHobbies();
  }, [loadHobbies]);

  const handleSave = () => {
    Alert.alert(
      'Save Collage',
      'Your hobby alphabet collage has been saved!',
      [{ text: 'Great!', style: 'default' }]
    );
  };

  const handleShare = () => {
    Alert.alert(
      'Share Alphabet',
      'Your hobby alphabet collage is ready to share!',
      [{ text: 'Close', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Hobby Alphabet</Text>
          <Text style={styles.subtitle}>26 hobbies • 26 letters</Text>
        </View>

        {/* Collage Grid */}
        <View style={styles.collageContainer}>
          <View style={styles.lettersGrid}>
            {LETTERS.map((letter, idx) => {
              const hobby = hobbies[letter];
              const isLastRow = idx >= 24; // Last 2 items

              return (
                <View
                  key={letter}
                  style={[
                    styles.collageItem,
                    isLastRow && styles.collageItemWide,
                  ]}
                >
                  {/* Photo Background */}
                  {hobby && hobby.photos && hobby.photos[0] ? (
                    <Image
                      source={{ uri: hobby.photos[0].uri }}
                      style={styles.collagePhoto}
                    />
                  ) : (
                    <View style={styles.collagePhotoPlaceholder}>
                      <Ionicons name="images-outline" size={22} color={colors.accent} />
                    </View>
                  )}

                  {/* Letter & Name Overlay */}
                  <View style={styles.collageOverlay}>
                    <Text style={styles.collageLetter}>{letter}</Text>
                    {hobby && (
                      <Text style={styles.collageHobbyName} numberOfLines={1}>
                        {hobby.name}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            A collection of all the hobbies you've discovered,
            one letter at a time.
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Save Collage</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Share My Alphabet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tertiaryButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.tertiaryButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  collageContainer: {
    marginBottom: spacing.xl,
  },
  lettersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  collageItem: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  collageItemWide: {
    width: '28%',
  },
  collagePhoto: {
    width: '100%',
    height: '100%',
  },
  collagePhotoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 20,
  },
  collageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(62, 48, 40, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xs,
  },
  collageLetter: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.surface,
    marginBottom: spacing.xs,
  },
  collageHobbyName: {
    fontSize: 8,
    color: colors.surface,
    textAlign: 'center',
    lineHeight: 10,
  },
  messageContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
  tertiaryButton: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tertiaryButtonText: {
    color: colors.accent,
    fontWeight: '600',
    fontSize: 14,
  },
});
