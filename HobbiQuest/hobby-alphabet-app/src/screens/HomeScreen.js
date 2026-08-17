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
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius, typography } from '../theme/colors';
import StatTile from '../components/StatTile';
import QuickActionCard from '../components/QuickActionCard';
import { getStats, getRecentActivity } from '../utils/storage';

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

  useFocusEffect(
    useCallback(() => {
      let active = true;
      Promise.all([getStats(), getRecentActivity(3)]).then(([s, activity]) => {
        if (active) {
          setStats(s);
          setRecentActivity(activity);
        }
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const mostRecent = recentActivity[0];

  const comingSoon = (feature) =>
    Alert.alert('Coming soon', `${feature} is planned for a future update.`);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.greeting}>{getGreeting()}!</Text>
        <Text style={styles.subheading}>What are you exploring today?</Text>

        <Text style={styles.sectionLabel}>YOUR PROGRESS</Text>
        <View style={styles.statsRow}>
          <StatTile value={`${stats.lettersCompleted}/26`} label="Letters" />
          <StatTile value={stats.hobbiesAdded} label="Hobbies" />
          <StatTile value={stats.hobbiesTracked} label="Tracked" />
        </View>
        <View style={styles.statsRow}>
          <StatTile value={stats.totalSessions} label="Sessions logged" />
          <StatTile value={stats.avgRating ?? '—'} label="Avg rating" />
        </View>

        {mostRecent ? (
          <>
            <Text style={styles.sectionLabel}>CONTINUE WHERE YOU LEFT OFF</Text>
            <TouchableOpacity
              style={styles.continueCard}
              onPress={() =>
                navigation.navigate('LetterDetail', { letter: mostRecent.letter })
              }
              activeOpacity={0.8}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.continueHobby}>{mostRecent.hobbyName}</Text>
                <Text style={styles.continueMeta}>
                  Letter {mostRecent.letter} · {formatRelativeDate(mostRecent.date)}
                </Text>
              </View>
              <Text style={styles.continueArrow}>›</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.sectionLabel}>GET STARTED</Text>
            <TouchableOpacity
              style={styles.continueCard}
              onPress={() => navigation.navigate('Alphabet')}
              activeOpacity={0.8}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.continueHobby}>Add your first hobby</Text>
                <Text style={styles.continueMeta}>Start anywhere on the alphabet</Text>
              </View>
              <Text style={styles.continueArrow}>›</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
        <View style={styles.actionsGrid}>
          <QuickActionCard
            emoji="🔤"
            label="Hobby Alphabet"
            onPress={() => navigation.navigate('Alphabet')}
          />
          <QuickActionCard
            emoji="📅"
            label="Calendar"
            onPress={() => navigation.navigate('Calendar')}
          />
          <QuickActionCard
            emoji="📖"
            label="Hobby Tracker"
            onPress={() => navigation.navigate('HobbyTracker')}
          />
          <QuickActionCard
            emoji="➕"
            label="Add Hobby"
            onPress={() => navigation.navigate('Alphabet')}
          />
          <QuickActionCard
            emoji="🎲"
            label="Random Letter"
            onPress={() => {
              const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
              const letter = letters[Math.floor(Math.random() * letters.length)];
              navigation.navigate('LetterDetail', { letter });
            }}
          />
          <QuickActionCard
            emoji="📊"
            label="Stats"
            onPress={() => navigation.navigate('Stats')}
          />
          <QuickActionCard
            emoji="✨"
            label="Discover"
            onPress={() => navigation.navigate('RandomHobby')}
          />
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
  greeting: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subheading: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  continueHobby: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  continueMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  continueArrow: {
    fontSize: 26,
    color: colors.accent,
    marginLeft: spacing.sm,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
