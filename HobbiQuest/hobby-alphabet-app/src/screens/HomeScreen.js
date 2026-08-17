import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius, typography } from '../theme/colors';
import StatTile from '../components/StatTile';
import QuickActionCard from '../components/QuickActionCard';
import { getStats, getRecentActivity, getCurrentStreak } from '../utils/storage';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatRelativeDate(iso) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export default function HomeScreen({ navigation }) {
  const [stats, setStats] = useState({
    hobbiesAdded: 0,
    hobbiesTracked: 0,
    lettersCompleted: 0,
    totalSessions: 0,
    avgRating: null,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [streak, setStreak] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      Promise.all([getStats(), getRecentActivity(3), getCurrentStreak()]).then(
        ([s, activity, currentStreak]) => {
          if (active) {
            setStats(s);
            setRecentActivity(activity);
            setStreak(currentStreak);
          }
        }
      );
      return () => {
        active = false;
      };
    }, [])
  );

  const mostRecent = recentActivity[0];

  const randomLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const randomLetter = randomLetters[Math.floor(Math.random() * randomLetters.length)];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <Text style={styles.brandName}>HobbiQuest</Text>
          <Text style={styles.brandTagline}>Discover. Explore. Track.</Text>
        </View>

        {/* Greeting */}
        <Text style={styles.greeting}>{getGreeting()}! </Text>
        <Text style={styles.subheading}>What are you exploring today?</Text>

        {/* Streak & Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.streakContainer}>
            <View style={styles.iconBadge}>
              <Ionicons name="flame" size={22} color={colors.accent} />
            </View>
            <View>
              <Text style={styles.streakLabel}>Current Streak</Text>
              <Text style={styles.streakValue}>{streak} days</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>
              {stats.lettersCompleted} / 26
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(stats.lettersCompleted / 26) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>Letters completed</Text>
          </View>
        </View>

        {/* Today's Prompt */}
        <View style={styles.promptCard}>
          <View style={styles.promptIconWrap}>
            <Ionicons name="sparkles" size={24} color={colors.accent} />
          </View>
          <View style={styles.promptContent}>
            <Text style={styles.promptLabel}>Today's Prompt</Text>
            <Text style={styles.promptText}>
              Try something new that starts with {randomLetter}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.promptButton}
            onPress={() => navigation.navigate('Alphabet')}
            activeOpacity={0.7}
          >
            <Text style={styles.promptButtonText}>Go</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Where You Left Off */}
        {mostRecent && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Continue Where You Left Off</Text>
            <TouchableOpacity
              style={styles.continueCard}
              onPress={() =>
                navigation.navigate('Alphabet', {
                  screen: 'LetterDetail',
                  params: { letter: mostRecent.letter },
                })
              }
              activeOpacity={0.8}
            >
              <View style={styles.continueContent}>
                <Text style={styles.continueHobby}>{mostRecent.hobbyName}</Text>
                <Text style={styles.continueMeta}>
                  Letter {mostRecent.letter} · {formatRelativeDate(mostRecent.date)}
                </Text>
              </View>
              <Text style={styles.continueArrow}>›</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Stats Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsRow}>
            <StatTile value={stats.hobbiesAdded} label="Hobbies" />
            <StatTile value={stats.hobbiesTracked} label="Tracked" />
            <StatTile value={stats.totalSessions} label="Sessions" />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <QuickActionCard
              iconName="library-outline"
              label="Alphabet"
              onPress={() => navigation.navigate('Alphabet', { screen: 'AlphabetScreen' })}
            />
            <QuickActionCard
              iconName="book-outline"
              label="Tracker"
              onPress={() => navigation.navigate('Tracker', { screen: 'HobbyTrackerScreen' })}
            />
            <QuickActionCard
              iconName="calendar-outline"
              label="Calendar"
              onPress={() => navigation.navigate('Home', { screen: 'Calendar' })}
            />
            <QuickActionCard
              iconName="stats-chart-outline"
              label="Stats"
              onPress={() => navigation.navigate('Home', { screen: 'Stats' })}
            />
            <QuickActionCard
              iconName="sparkles-outline"
              label="Discover"
              onPress={() => navigation.navigate('Profile', { screen: 'RandomHobby' })}
            />
            <QuickActionCard
              iconName="trophy-outline"
              label="Achievements"
              onPress={() => navigation.navigate('Profile', { screen: 'Achievements' })}
            />
          </View>
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
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  brandHeader: {
    marginBottom: spacing.lg,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  brandTagline: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  greeting: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subheading: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  streakLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  streakValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.accent,
  },
  progressContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  progressText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  promptCard: {
    backgroundColor: colors.accentMuted,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  promptIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  promptContent: {
    flex: 1,
  },
  promptLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  promptText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  promptButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  promptButtonText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  continueContent: {
    flex: 1,
  },
  continueHobby: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  continueMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  continueArrow: {
    fontSize: 20,
    color: colors.accent,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
