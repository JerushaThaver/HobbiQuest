import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, radius, spacing, typography } from '../theme/colors';
import {
  getDatesWithActivities,
  getActivitiesForDate,
  formatMonthYear,
  getMonthsDays,
  formatDayWithName,
  toDateString,
} from '../utils/dates';
import { formatRelativeDate } from '../utils/dates';

const CALENDAR_COLS = 7; // Sun-Sat
const ACTIVITY_DOT_SIZE = 6;

export default function CalendarScreen({ navigation }) {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [datesWithActivity, setDatesWithActivity] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const loadCalendarData = useCallback(async () => {
    const dates = await getDatesWithActivities(currentYear, currentMonth);
    setDatesWithActivity(dates);

    if (selectedDate === null) {
      const fallbackDate =
        new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
      const monthStartDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
      const activitiesForMonthStart = await getActivitiesForDate(monthStartDate);

      const firstAvailableDate = dates.length
        ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dates[0]).padStart(2, '0')}`
        : null;

      const dateToSelect = firstAvailableDate || fallbackDate;
      const activities = dateToSelect ? await getActivitiesForDate(dateToSelect) : [];

      if (activities.length > 0) {
        setSelectedDate(dateToSelect);
        setSelectedActivities(activities);
      } else if (activitiesForMonthStart.length > 0) {
        const firstDate = activitiesForMonthStart[0].date.split('T')[0];
        setSelectedDate(firstDate);
        setSelectedActivities(activitiesForMonthStart);
      } else {
        setSelectedDate(dateToSelect);
        setSelectedActivities([]);
      }
    }
  }, [currentYear, currentMonth, selectedDate]);

  useFocusEffect(
    useCallback(() => {
      loadCalendarData();
    }, [loadCalendarData])
  );

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  const isSelectedDay = (day) => {
    if (!day || !selectedDate) return false;
    const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return date === selectedDate;
  };

  const handleDayPress = async (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;
    const activities = await getActivitiesForDate(dateStr);
    setSelectedDate(dateStr);
    setSelectedActivities(activities);
  };

  const monthDays = getMonthsDays(currentYear, currentMonth);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Calendar</Text>
          <Text style={styles.subtitle}>Track your hobby activity over time.</Text>
        </View>

        {/* Month Navigation */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={handlePreviousMonth} activeOpacity={0.6}>
            <Text style={styles.navButton}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthYear}>{formatMonthYear(currentYear, currentMonth)}</Text>
          <TouchableOpacity onPress={handleNextMonth} activeOpacity={0.6}>
            <Text style={styles.navButton}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarContainer}>
          {/* Day headers (Sun-Sat) */}
          <View style={styles.dayHeaderRow}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <View key={day} style={styles.dayHeaderCell}>
                <Text style={styles.dayHeaderText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar days grid */}
          <View style={styles.daysGrid}>
            {monthDays.map((day, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.dayCell,
                  isSelectedDay(day) ? styles.dayCellSelected : null,
                ]}
                onPress={() => day && handleDayPress(day)}
                disabled={!day}
                activeOpacity={0.6}
              >
                {day ? (
                  <View style={styles.dayCellContent}>
                    <Text
                      style={[
                        styles.dayText,
                        isSelectedDay(day) ? styles.dayTextSelected : null,
                      ]}
                    >
                      {day}
                    </Text>
                    {datesWithActivity.includes(day) && (
                      <View style={styles.activityDot} />
                    )}
                  </View>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Day Detail Section */}
        {selectedDate && (
          <View style={styles.dayDetailContainer}>
            <Text style={styles.dayDetailTitle}>
              {formatDayWithName(
                currentYear,
                currentMonth,
                parseInt(selectedDate.split('-')[2])
              )}
            </Text>

            {selectedActivities.length > 0 ? (
              <>
                <Text style={styles.activityCount}>
                  {selectedActivities.length} activit{selectedActivities.length === 1 ? 'y' : 'ies'}
                </Text>
                <FlatList
                  data={selectedActivities}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item: activity }) => (
                    <TouchableOpacity
                      style={styles.activityCard}
                      onPress={() =>
                        navigation.navigate('Tracker', {
                          screen: 'HobbyTrackerDetail',
                          params: {
                            letter: activity.letter,
                            hobbyId: activity.hobbyId,
                          },
                        })
                      }
                      activeOpacity={0.7}
                    >
                      {/* Hobby thumbnail */}
                      {activity.photos && activity.photos[0] ? (
                        <Image
                          source={{ uri: activity.photos[0].uri }}
                          style={styles.activityThumbnail}
                        />
                      ) : (
                        <View style={[styles.activityThumbnail, styles.thumbnailPlaceholder]}>
                          <Text style={styles.placeholderText}>📸</Text>
                        </View>
                      )}

                      {/* Activity info */}
                      <View style={styles.activityInfo}>
                        <Text style={styles.activityName}>{activity.hobbyName}</Text>
                        <Text style={styles.activityCategory}>{activity.category}</Text>
                        <View style={styles.activityMetaRow}>
                          <Text style={styles.activityMeta}>
                            {activity.photos?.length || 0} photo{activity.photos?.length === 1 ? '' : 's'}
                          </Text>
                          {activity.rating > 0 && (
                            <Text style={styles.activityRating}>
                              {' '}
                              • {'⭐'.repeat(activity.rating)}
                            </Text>
                          )}
                        </View>
                        {activity.note && (
                          <Text style={styles.activityNote} numberOfLines={2}>
                            "{activity.note}"
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                  scrollEnabled={false}
                />
              </>
            ) : (
              <Text style={styles.noActivities}>No activities on this day.</Text>
            )}

            {/* Log Activity button */}
            <TouchableOpacity style={styles.logButton}>
              <Text style={styles.logButtonText}>+ Log Another Activity</Text>
            </TouchableOpacity>
          </View>
        )}
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
    paddingBottom: spacing.lg,
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
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  navButton: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.accent,
  },
  monthYear: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  calendarContainer: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / CALENDAR_COLS}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xs,
  },
  dayCellSelected: {
    backgroundColor: colors.accentMuted,
    borderRadius: radius.md,
  },
  dayCellContent: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  dayTextSelected: {
    fontWeight: '700',
    color: colors.accent,
  },
  activityDot: {
    width: ACTIVITY_DOT_SIZE,
    height: ACTIVITY_DOT_SIZE,
    borderRadius: ACTIVITY_DOT_SIZE / 2,
    backgroundColor: colors.accent,
  },
  dayDetailContainer: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  dayDetailTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  activityCount: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityThumbnail: {
    width: 80,
    height: 80,
    backgroundColor: colors.surfaceMuted,
  },
  thumbnailPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
  },
  activityInfo: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  activityName: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  activityCategory: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  activityMetaRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  activityMeta: {
    fontSize: 12,
    color: colors.textMuted,
  },
  activityRating: {
    fontSize: 12,
    color: colors.textMuted,
  },
  activityNote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  noActivities: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  logButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  logButtonText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 14,
  },
});
