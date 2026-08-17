import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, radius, spacing, typography } from '../theme/colors';
import {
  getStats,
  getMostActiveHobbies,
  getCategoryStats,
  getCurrentStreak,
} from '../utils/storage';

export default function StatsScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [mostActive, setMostActive] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);

  const loadStats = useCallback(async () => {
    const [s, active, cats, streak] = await Promise.all([
      getStats(),
      getMostActiveHobbies(3),
      getCategoryStats(),
      getCurrentStreak(),
    ]);
    setStats(s);
    setMostActive(active);
    setCategories(cats);
    setCurrentStreak(streak);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  if (!stats) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading…</Text>
      </SafeAreaView>
    );
  }

  const progressPercentage = (stats.lettersCompleted / 26) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Hobby Journey</Text>
          <Text style={styles.subtitle}>See how far you've come.</Text>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{stats.lettersCompleted}</Text>
            <Text style={styles.metricLabel}>Letters</Text>
            <Text style={styles.metricDetail}>of 26</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{stats.hobbiesAdded}</Text>
            <Text style={styles.metricLabel}>Hobbies</Text>
            <Text style={styles.metricDetail}>Discovered</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{stats.hobbiesTracked}</Text>
            <Text style={styles.metricLabel}>Tracked</Text>
            <Text style={styles.metricDetail}>Active</Text>
          </View>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{stats.totalSessions}</Text>
            <Text style={styles.metricLabel}>Sessions</Text>
            <Text style={styles.metricDetail}>Logged</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{stats.avgRating ?? '—'}</Text>
            <Text style={styles.metricLabel}>Avg Rating</Text>
            <Text style={styles.metricDetail}>Overall</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{currentStreak}</Text>
            <Text style={styles.metricLabel}>Streak</Text>
            <Text style={styles.metricDetail}>Days</Text>
          </View>
        </View>

        {/* Alphabet Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alphabet Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>
                {stats.lettersCompleted} / 26 Letters
              </Text>
              <Text style={styles.progressPercent}>
                {Math.round(progressPercentage)}%
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${progressPercentage}%` },
                ]}
              />
            </View>
            <Text style={styles.progressDetail}>
              {26 - stats.lettersCompleted} letters left to complete
            </Text>
          </View>
        </View>

        {/* Most Active Hobbies */}
        {mostActive.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Most Active Hobbies</Text>
            {mostActive.map((hobby, idx) => (
              <View key={hobby.id} style={styles.rankingItem}>
                <Text style={styles.rankingMedal}>
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                </Text>
                <View style={styles.rankingInfo}>
                  <Text style={styles.rankingName}>{hobby.name}</Text>
                  <Text style={styles.rankingCategory}>{hobby.category}</Text>
                </View>
                <Text style={styles.rankingCount}>
                  {hobby.sessionCount} session{hobby.sessionCount === 1 ? '' : 's'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Favorite Categories */}
        {categories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favorite Categories</Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <View key={cat.category} style={styles.categoryCard}>
                  <Text style={styles.categoryName}>{cat.category}</Text>
                  <Text style={styles.categoryCount}>{cat.count}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Achievements Button */}
        <TouchableOpacity
          style={styles.achievementsButton}
          onPress={() => navigation.navigate('Achievements')}
          activeOpacity={0.8}
        >
          <Text style={styles.achievementsButtonText}>🏅 View Achievements</Text>
        </TouchableOpacity>
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
    paddingBottom: spacing.xl,
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
  metricsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  metricValue: {
    ...typography.h1,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  metricDetail: {
    fontSize: 11,
    color: colors.textMuted,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  progressPercent: {
    fontWeight: '600',
    color: colors.accent,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  progressDetail: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  rankingItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  rankingMedal: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  rankingInfo: {
    flex: 1,
  },
  rankingName: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  rankingCategory: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  rankingCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryName: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  categoryCount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
  },
  achievementsButton: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  achievementsButtonText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 16,
  },
  loading: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
