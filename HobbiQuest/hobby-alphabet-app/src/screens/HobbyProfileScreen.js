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
import * as ImagePicker from 'expo-image-picker';
import { colors, radius, spacing, typography } from '../theme/colors';
import { getHobby, addPhotoToHobby, deleteHobby } from '../utils/storage';
import { formatLongDate, formatRelativeDate } from '../utils/dates';

const PHOTO_SIZE = 90;

export default function HobbyProfileScreen({ route, navigation }) {
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

  const handleAddPhoto = async (fromCamera) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Enable access in settings to add a photo.');
      return;
    }
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true, aspect: [4, 3] })
      : await ImagePicker.launchImageLibraryAsync({
          quality: 0.7,
          allowsEditing: true,
          aspect: [4, 3],
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
    if (!result.canceled) {
      await addPhotoToHobby(letter, hobbyId, result.assets[0].uri);
      load();
    }
  };

  const confirmAddPhoto = () => {
    Alert.alert('Add photo', undefined, [
      { text: 'Camera', onPress: () => handleAddPhoto(true) },
      { text: 'Choose Existing', onPress: () => handleAddPhoto(false) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  if (!hobby) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading…</Text>
      </SafeAreaView>
    );
  }

  const photos = hobby.photos || [];
  const sessions = hobby.sessions || [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.name}>{hobby.name}</Text>
        {hobby.rating > 0 && <Text style={styles.rating}>{'★'.repeat(hobby.rating)}</Text>}

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{sessions.length}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{photos.length}</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{hobby.category}</Text>
            <Text style={styles.statLabel}>Category</Text>
          </View>
        </View>

        <Text style={styles.startedText}>
          Started {formatLongDate(hobby.createdAt)}
          {hobby.tracking ? ' · Tracking' : ''}
        </Text>

        {hobby.notes ? (
          <>
            <Text style={styles.sectionLabel}>NOTES</Text>
            <Text style={styles.notesText}>{hobby.notes}</Text>
          </>
        ) : null}

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>PHOTOS</Text>
          <TouchableOpacity onPress={confirmAddPhoto}>
            <Text style={styles.addLink}>+ Add Photo</Text>
          </TouchableOpacity>
        </View>

        {photos.length === 0 ? (
          <Text style={styles.emptyText}>No photos yet.</Text>
        ) : (
          <FlatList
            data={photos}
            horizontal
            keyExtractor={(p) => p.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.photoWrap}>
                <Image source={{ uri: item.uri }} style={styles.photoThumb} />
                <Text style={styles.photoDate}>{formatRelativeDate(item.date)}</Text>
              </View>
            )}
          />
        )}

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>ACTIVITY</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('LogSession', { letter, hobbyId })}
          >
            <Text style={styles.addLink}>+ Log Activity</Text>
          </TouchableOpacity>
        </View>

        {sessions.length === 0 ? (
          <Text style={styles.emptyText}>No sessions logged yet.</Text>
        ) : (
          sessions.map((session) => (
            <View key={session.id} style={styles.sessionRow}>
              {session.photos && session.photos.length > 0 ? (
                <Image source={{ uri: session.photos[0].uri }} style={styles.sessionPhoto} />
              ) : (
                <View style={styles.sessionMoodBox}>
                  <Text style={styles.sessionMoodText}>{session.mood || '📝'}</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.sessionDate}>{formatRelativeDate(session.date)}</Text>
                {session.note ? (
                  <Text style={styles.sessionNote} numberOfLines={2}>
                    {session.note}
                  </Text>
                ) : null}
              </View>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.logButton}
          onPress={() => navigation.navigate('LogSession', { letter, hobbyId })}
        >
          <Text style={styles.logButtonText}>+ Log Activity</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  loading: { ...typography.body, color: colors.textSecondary, padding: spacing.lg },
  name: { ...typography.h1, color: colors.textPrimary },
  rating: { color: colors.warning, fontSize: 18, marginTop: 4 },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  statValue: { ...typography.bodyBold, color: colors.accent },
  statLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  startedText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  addLink: { ...typography.bodyBold, color: colors.accent },
  notesText: { ...typography.body, color: colors.textPrimary, marginTop: spacing.xs },
  emptyText: { ...typography.body, color: colors.textMuted },
  photoWrap: { marginRight: spacing.sm, alignItems: 'center' },
  photoThumb: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  photoDate: { ...typography.caption, color: colors.textMuted, marginTop: 4 },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  sessionPhoto: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
  },
  sessionMoodBox: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  sessionMoodText: { fontSize: 22 },
  sessionDate: { ...typography.bodyBold, color: colors.textPrimary },
  sessionNote: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  logButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  logButtonText: { ...typography.bodyBold, color: colors.white },
  headerAction: { color: colors.warning, ...typography.bodyBold },
});
