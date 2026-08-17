import React, { useCallback, useEffect, useState } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { colors, radius, spacing, typography } from '../theme/colors';
import { getHobbiesForLetter, deleteHobby } from '../utils/storage';

export default function LetterDetailScreen({ route, navigation }) {
  const { letter } = route.params;
  const [hobbies, setHobbies] = useState([]);

  useEffect(() => {
    navigation.setOptions({ title: `Letter ${letter}` });
  }, [letter]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getHobbiesForLetter(letter).then((h) => {
        if (active) setHobbies(h);
      });
      return () => {
        active = false;
      };
    }, [letter])
  );

  const handleDelete = (hobby) => {
    Alert.alert('Remove hobby?', `This deletes "${hobby.name}" and its history.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await deleteHobby(letter, hobby.id);
          setHobbies((prev) => prev.filter((h) => h.id !== hobby.id));
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.letterBadge}>{letter}</Text>
        <Text style={styles.count}>
          {hobbies.length === 0
            ? 'No hobbies yet'
            : `${hobbies.length} hobby${hobbies.length > 1 ? 'ies' : ''}`}
        </Text>

        {hobbies.map((hobby) => (
          <TouchableOpacity
            key={hobby.id}
            style={styles.hobbyCard}
            onPress={() => navigation.navigate('HobbyProfile', { letter, hobbyId: hobby.id })}
            onLongPress={() => handleDelete(hobby)}
            activeOpacity={0.8}
          >
            {hobby.photos && hobby.photos.length > 0 ? (
              <Image source={{ uri: hobby.photos[0].uri }} style={styles.hobbyPhoto} />
            ) : (
              <View style={styles.hobbyPhotoPlaceholder}>
                <Text style={styles.hobbyPhotoPlaceholderText}>No photo</Text>
              </View>
            )}
            <View style={styles.hobbyInfo}>
              <Text style={styles.hobbyName}>{hobby.name}</Text>
              <Text style={styles.hobbyMeta}>
                {hobby.category}
                {hobby.tracking ? ' · Tracking' : ''}
              </Text>
              {hobby.rating > 0 && (
                <Text style={styles.hobbyRating}>{'★'.repeat(hobby.rating)}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddHobby', { letter })}
        >
          <Text style={styles.addButtonText}>+ Add Hobby</Text>
        </TouchableOpacity>

        {hobbies.length > 0 && (
          <Text style={styles.hint}>Tap a hobby to open it. Press and hold to remove it.</Text>
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
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  letterBadge: {
    ...typography.h1,
    fontSize: 34,
    color: colors.textPrimary,
  },
  count: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  hobbyCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  hobbyPhoto: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
  },
  hobbyPhotoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hobbyPhotoPlaceholderText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
  },
  hobbyInfo: {
    flex: 1,
  },
  hobbyName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  hobbyMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  hobbyRating: {
    color: colors.warning,
    marginTop: 2,
  },
  addButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  addButtonText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
