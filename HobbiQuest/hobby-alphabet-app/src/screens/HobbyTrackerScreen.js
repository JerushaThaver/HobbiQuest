import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, radius, spacing, typography } from '../theme/colors';
import { getAllHobbiesFlat, updateHobby, getSessionStats } from '../utils/storage';
import { formatLongDate, formatRelativeDate } from '../utils/dates';

const THUMBNAIL_SIZE = 80;

export default function HobbyTrackerScreen({ navigation }) {
  const [allHobbies, setAllHobbies] = useState([]);
  const [filteredHobbies, setFilteredHobbies] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'tracked', 'untracked'
  const [stats, setStats] = useState({});

  const loadHobbies = useCallback(async () => {
    const hobbies = await getAllHobbiesFlat();
    setAllHobbies(hobbies);

    // Load stats for each hobby
    const newStats = {};
    for (const hobby of hobbies) {
      const stat = await getSessionStats(hobby.letter, hobby.id);
      newStats[hobby.id] = stat;
    }
    setStats(newStats);

    applyFilters(hobbies, searchText, selectedFilter);
  }, [selectedFilter, searchText]);

  const applyFilters = (hobbies, search, filter) => {
    let filtered = hobbies;

    // Apply tracking filter
    if (filter === 'tracked') {
      filtered = filtered.filter((h) => h.tracking);
    } else if (filter === 'untracked') {
      filtered = filtered.filter((h) => !h.tracking);
    }

    // Apply search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(query) ||
          h.category.toLowerCase().includes(query)
      );
    }

    setFilteredHobbies(filtered);
  };

  useFocusEffect(
    useCallback(() => {
      loadHobbies();
    }, [loadHobbies])
  );

  const handleSearchChange = (text) => {
    setSearchText(text);
    applyFilters(allHobbies, text, selectedFilter);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    applyFilters(allHobbies, searchText, filter);
  };

  const handleToggleTracking = async (hobby) => {
    const updated = await updateHobby(hobby.letter, hobby.id, {
      tracking: !hobby.tracking,
    });
    if (updated) {
      const newAllHobbies = allHobbies.map((h) =>
        h.id === hobby.id ? { ...h, tracking: !h.tracking } : h
      );
      setAllHobbies(newAllHobbies);
      applyFilters(newAllHobbies, searchText, selectedFilter);
    }
  };

  const handleTapHobby = (hobby) => {
    navigation.navigate('HobbyTrackerDetail', { letter: hobby.letter, hobbyId: hobby.id });
  };

  const renderHobbyCard = ({ item: hobby }) => {
    const stat = stats[hobby.id];
    const lastActivityText = stat?.lastSessionDate
      ? formatRelativeDate(stat.lastSessionDate)
      : 'No activity';

    return (
      <TouchableOpacity
        style={styles.hobbyCard}
        onPress={() => handleTapHobby(hobby)}
        activeOpacity={0.7}
      >
        {/* Left: Thumbnail */}
        <View style={styles.thumbnailContainer}>
          {hobby.photos && hobby.photos[0] ? (
            <Image
              source={{ uri: hobby.photos[0].uri }}
              style={styles.thumbnail}
            />
          ) : (
            <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
              <Text style={styles.placeholderText}>📸</Text>
            </View>
          )}
        </View>

        {/* Center: Info */}
        <View style={styles.hobbyInfo}>
          <Text style={styles.hobbyName}>{hobby.name}</Text>
          <Text style={styles.hobbyCategory}>{hobby.category}</Text>
          <Text style={styles.hobbyMeta}>
            {stat?.sessionCount || 0} sessions • {lastActivityText}
          </Text>
        </View>

        {/* Right: Toggle */}
        <TouchableOpacity
          style={[
            styles.trackButton,
            hobby.tracking && styles.trackButtonActive,
          ]}
          onPress={() => handleToggleTracking(hobby)}
          activeOpacity={0.6}
        >
          <Text style={styles.trackButtonText}>
            {hobby.tracking ? '✓' : '○'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Hobby Tracker</Text>
        <Text style={styles.subtitle}>Choose which hobbies you want to track.</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search hobbies..."
          placeholderTextColor={colors.textMuted}
          value={searchText}
          onChangeText={handleSearchChange}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {['all', 'tracked', 'untracked'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              selectedFilter === filter && styles.filterTabActive,
            ]}
            onPress={() => handleFilterChange(filter)}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === filter && styles.filterTabTextActive,
              ]}
            >
              {filter === 'all' ? 'All' : filter === 'tracked' ? 'Tracked' : 'Not Tracked'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Hobbies List */}
      <FlatList
        data={filteredHobbies}
        keyExtractor={(item) => item.id}
        renderItem={renderHobbyCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {allHobbies.length === 0
                ? 'No hobbies yet. Add one from the Alphabet!'
                : 'No hobbies match your search.'}
            </Text>
          </View>
        }
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
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 14,
    color: colors.textPrimary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterTabActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  filterTabTextActive: {
    color: colors.surface,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  hobbyCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  thumbnailContainer: {
    marginRight: spacing.md,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  thumbnailPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
  },
  hobbyInfo: {
    flex: 1,
  },
  hobbyName: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  hobbyCategory: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  hobbyMeta: {
    fontSize: 12,
    color: colors.textMuted,
  },
  trackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  trackButtonActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  trackButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
