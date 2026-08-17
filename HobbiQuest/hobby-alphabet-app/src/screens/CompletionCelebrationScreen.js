import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme/colors';
import { getAllHobbiesFlat } from '../utils/storage';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function CompletionCelebrationScreen({ navigation }) {
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

  const handleViewCollage = () => {
    navigation.navigate('Profile', { screen: 'Collage' });
  };

  const handleShare = () => {
    Alert.alert(
      'Share Achievement',
      'You have completed your Hobby Alphabet!\n\n26 hobbies • 26 letters\nA whole collection of experiences.',
      [
        { text: 'Copy Text', style: 'default' },
        { text: 'Close', style: 'cancel' },
      ]
    );
  };

  const handleContinue = () => {
    navigation.navigate('Home', { screen: 'HomeScreen' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Celebration Header */}
        <View style={styles.celebrationContainer}>
          <View style={styles.celebrationBadge}>
            <Ionicons name="trophy" size={44} color={colors.accent} />
          </View>
          <Text style={styles.title}>You Did It!</Text>
          <Text style={styles.subtitle}>
            You've completed your Hobby Alphabet!
          </Text>
          <Text style={styles.progress}>26 / 26 Letters</Text>
        </View>

        {/* Achievement Badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.badge}><Ionicons name="medal" size={32} color={colors.accent} /></View>
          <Text style={styles.badgeText}>Alphabet Master</Text>
        </View>

        {/* Hobby Grid */}
        <View style={styles.gridContainer}>
          <Text style={styles.gridTitle}>Your 26 Hobbies</Text>
          <View style={styles.hobbiesGrid}>
            {LETTERS.map((letter) => {
              const hobby = hobbies[letter];
              return (
                <View key={letter} style={styles.gridItem}>
                  <View style={styles.letterBadge}>
                    <Text style={styles.letterText}>{letter}</Text>
                  </View>
                  {hobby && (
                    <Text style={styles.hobbyName} numberOfLines={1}>
                      {hobby.name}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            26 hobbies. 26 letters.{'\n'}A whole collection of experiences.
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleViewCollage}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>View My Collage</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Share Achievement</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tertiaryButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.tertiaryButtonText}>Continue Exploring</Text>
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
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  celebrationText: {
    fontSize: 60,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.h3,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  progress: {
    ...typography.h2,
    color: colors.accent,
    textAlign: 'center',
  },
  badgeContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  badgeText: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  gridContainer: {
    marginBottom: spacing.xl,
  },
  gridTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  hobbiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  gridItem: {
    width: '18%',
    alignItems: 'center',
  },
  letterBadge: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  letterText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.surface,
  },
  hobbyName: {
    fontSize: 9,
    color: colors.textSecondary,
    textAlign: 'center',
    width: '100%',
  },
  messageContainer: {
    backgroundColor: colors.successMuted,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.success,
  },
  messageText: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 28,
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
