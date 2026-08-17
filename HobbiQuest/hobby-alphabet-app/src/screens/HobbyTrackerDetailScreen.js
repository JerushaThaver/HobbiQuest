import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, radius, spacing, typography } from '../theme/colors';
import { getHobby, deleteHobby } from '../utils/storage';
import { formatLongDate, formatRelativeDate, formatShortDate } from '../utils/dates';

const PHOTO_THUMB_SIZE = 80;

export default function HobbyTrackerDetailScreen({ route, navigation }) {
  const { letter, hobbyId } = route.params;
  const [hobby, setHobby] = useState(null);

  const load = useCallback(() => {
    getHobby(letter, hobbyId).then(setHobby);
  }, [letter, hobbyId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  useEffect(() => {
    navigation.setOptions({
      title: hobby ? hobby.name : 'Hobby',
      headerRight: () => (
        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.headerAction}>Delete</Text>
        </TouchableOpacity>
      ),
    });
  }, [hobby]);

  const handleDelete = () => {
    if (!hobby) return;
    Alert.alert('Remove hobby?', `This deletes "${hobby.name}" and its history.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await deleteHobby(letter, hobby.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleLogActivity = () => {
    navigation.navigate('Tracker', { screen: 'LogSession', params: { letter, hobbyId } });
  };

  if (!hobby) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading…</Text>
      </SafeAreaView>
    );
  }

  const sessions = hobby.sessions || [];
  const photos = hobby.photos || [];
  const lastSession = sessions.length > 0 ? sessions[0] : null;
  const totalPhotos = sessions.reduce((sum, s) => sum + (s.photos?.length || 0), 0);

  // Calculate streak (consecutive days with activity)
  const calculateStreak = () => {
    if (sessions.length === 0) return 0;

    let streak = 1;
    let currentDate = new Date(sessions[0].date);
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 1; i < sessions.length; i++) {
      const previousDate = new Date(sessions[i].date);
      previousDate.setHours(0, 0, 0, 0);

      const dayDiff = Math.floor((currentDate - previousDate) / (1000 * 60 * 60 * 24));
      if (dayDiff === 1) {
        streak++;
        currentDate = previousDate;
      } else {
        break;
      }
    }

    return streak;
  };

  const streak = calculateStreak();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hobby Header Card */}
        <View style={styles.headerCard}>
          <View>
            <Text style={styles.hobbyName}>{hobby.name}</Text>
            <Text style={styles.hobbyCategory}>{hobby.category}</Text>
          </View>
          <View style={styles.ratingContainer}>
            {hobby.rating > 0 ? (
              <Text style={styles.ratingStars}>{'⭐'.repeat(hobby.rating)}</Text>
            ) : (
              <Text style={styles.noRating}>No rating</Text>
            )}
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{sessions.length}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalPhotos}</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>

        {/* Last Activity */}
        {lastSession && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Last Activity</Text>
            <View style={styles.lastActivityCard}>
              <View>
                <Text style={styles.lastActivityDate}>
                  {formatLongDate(lastSession.date)}
                </Text>
                {lastSession.note && (
                  <Text style={styles.lastActivityNote} numberOfLines={2}>
                    {lastSession.note}
                  </Text>
                )}
              </View>
              <View style={styles.lastActivityMeta}>
                <Text style={styles.lastActivityPhotos}>
                  {lastSession.photos?.length || 0} photo{lastSession.photos?.length === 1 ? '' : 's'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Activity History */}
        {sessions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity History</Text>
            <FlatList
              data={sessions}
              keyExtractor={(item) => item.id}
              renderItem={({ item: session }) => (
                <View style={styles.sessionItem}>
                  <View style={styles.sessionDate}>
                    <Text style={styles.sessionDateText}>
                      {formatShortDate(session.date)}
                    </Text>
                  </View>
                  <View style={styles.sessionContent}>
                    <View style={styles.sessionHeader}>
                      <Text style={styles.sessionNote} numberOfLines={1}>
                        {session.note || 'Activity logged'}
                      </Text>
                      <Text style={styles.sessionPhotoCount}>
                        {session.photos?.length || 0} photo{session.photos?.length === 1 ? '' : 's'}
                      </Text>
                    </View>
                    {session.photos && session.photos.length > 0 && (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.photoScroll}
                      >
                        {session.photos.map((photo) => (
                          <Image
                            key={photo.id}
                            source={{ uri: photo.uri }}
                            style={styles.sessionPhoto}
                          />
                        ))}
                      </ScrollView>
                    )}
                  </View>
                </View>
              )}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Log Activity Button */}
        <TouchableOpacity
          style={styles.logButton}
          onPress={handleLogActivity}
          activeOpacity={0.8}
        >
          <Text style={styles.logButtonText}>+ Log Activity</Text>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerAction: {
    color: colors.accent,
    fontWeight: '600',
    fontSize: 14,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  hobbyName: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  hobbyCategory: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  ratingStars: {
    fontSize: 16,
  },
  noRating: {
    fontSize: 12,
    color: colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    ...typography.h1,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  lastActivityCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastActivityDate: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  lastActivityNote: {
    fontSize: 13,
    color: colors.textSecondary,
    maxWidth: 200,
  },
  lastActivityMeta: {
    alignItems: 'flex-end',
  },
  lastActivityPhotos: {
    fontSize: 12,
    color: colors.textMuted,
  },
  sessionItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  sessionDate: {
    backgroundColor: colors.accentMuted,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
  },
  sessionDateText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
    textAlign: 'center',
  },
  sessionContent: {
    flex: 1,
    padding: spacing.md,
  },
  sessionHeader: {
    marginBottom: spacing.sm,
  },
  sessionNote: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  sessionPhotoCount: {
    fontSize: 12,
    color: colors.textMuted,
  },
  photoScroll: {
    marginTop: spacing.sm,
  },
  sessionPhoto: {
    width: 60,
    height: 60,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
  },
  logButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  logButtonText: {
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
