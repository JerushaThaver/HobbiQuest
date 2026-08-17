import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, radius, spacing, typography } from '../theme/colors';
import { getAllAchievementsWithProgress } from '../utils/storage';

export default function AchievementsScreen() {
  const [achievements, setAchievements] = useState([]);

  const loadAchievements = useCallback(async () => {
    const ach = await getAllAchievementsWithProgress();
    setAchievements(ach);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAchievements();
    }, [loadAchievements])
  );

  const getAchievementIcon = (id) => {
    const icons = {
      'first-step': 'footsteps-outline',
      'getting-started': 'leaf-outline',
      'hobby-explorer': 'compass-outline',
      'seven-day-streak': 'flame-outline',
      'memory-keeper': 'images-outline',
      committed: 'target-outline',
      'halfway-there': 'diamond-outline',
      'alphabet-master': 'trophy-outline',
    };
    return icons[id] || 'star-outline';
  };

  const renderAchievementCard = ({ item: achievement }) => {
    const { unlocked, progress } = achievement;
    const progressPercent = progress
      ? Math.round((progress.current / progress.target) * 100)
      : 0;

    return (
      <View
        style={[
          styles.achievementCard,
          unlocked && styles.achievementCardUnlocked,
        ]}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name={getAchievementIcon(achievement.id)} size={34} color={unlocked ? colors.accent : colors.textMuted} />
          {!unlocked && <Ionicons name="lock-closed-outline" size={14} color={colors.textMuted} style={styles.lockIcon} />}
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.achievementName}>{achievement.name}</Text>
          <Text style={styles.achievementDescription}>
            {achievement.description}
          </Text>

          {/* Progress Bar */}
          {progress && progress.target > 1 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBarSmall}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${Math.min(progressPercent, 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {progress.current} / {progress.target}
              </Text>
            </View>
          )}
        </View>

        {/* Status Badge */}
        {unlocked && <Text style={styles.unlockedBadge}>✓</Text>}
      </View>
    );
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Achievements</Text>
        <Text style={styles.subtitle}>Keep exploring and unlock rewards.</Text>
      </View>

      {/* Progress Summary */}
      <View style={styles.progressSummary}>
        <Text style={styles.summaryText}>
          {unlockedCount} of {achievements.length} Unlocked
        </Text>
        <View style={styles.summaryBar}>
          <View
            style={[
              styles.summaryBarFill,
              {
                width: `${(unlockedCount / achievements.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Achievements Grid */}
      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id}
        renderItem={renderAchievementCard}
        numColumns={2}
        columnWrapperStyle={styles.gridWrapper}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
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
  progressSummary: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  summaryBar: {
    height: 8,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 4,
    overflow: 'hidden',
  },
  summaryBarFill: {
    height: '100%',
    backgroundColor: colors.success,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  gridWrapper: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  achievementCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    opacity: 0.6,
    minHeight: 180,
  },
  achievementCardUnlocked: {
    backgroundColor: colors.successMuted,
    borderColor: colors.success,
    opacity: 1,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  achievementIcon: {
    fontSize: 40,
  },
  lockIcon: {
    fontSize: 16,
    position: 'absolute',
    bottom: -2,
    right: -2,
  },
  contentContainer: {
    flex: 1,
  },
  achievementName: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontSize: 14,
  },
  achievementDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressBarSmall: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.success,
  },
  progressText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  unlockedBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    fontSize: 18,
    color: colors.success,
  },
});
