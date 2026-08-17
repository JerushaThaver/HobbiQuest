import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, radius, spacing, typography } from '../theme/colors';
import { loadEntries, saveEntry, deleteEntry } from '../utils/storage';
import { hobbySuggestions } from '../data/hobbySuggestions';

const STAR_VALUES = [1, 2, 3, 4, 5];

export default function HobbyDetailScreen({ route, navigation }) {
  const { letter } = route.params;

  const [hobbyName, setHobbyName] = useState('');
  const [note, setNote] = useState('');
  const [rating, setRating] = useState(0);
  const [photoUri, setPhotoUri] = useState(null);
  const [dateCompleted, setDateCompleted] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: `Letter ${letter}` });
    loadEntries().then((entries) => {
      const existing = entries[letter];
      if (existing) {
        setHobbyName(existing.hobbyName || '');
        setNote(existing.note || '');
        setRating(existing.rating || 0);
        setPhotoUri(existing.photoUri || null);
        setDateCompleted(existing.dateCompleted || null);
      }
    });
  }, [letter]);

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera permission needed', 'Enable camera access in settings to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const pickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Photo access needed', 'Enable photo library access in settings.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!hobbyName.trim()) {
      Alert.alert('Add a hobby name', 'Give this letter a hobby before saving.');
      return;
    }
    setSaving(true);
    try {
      await saveEntry(letter, {
        hobbyName: hobbyName.trim(),
        note: note.trim(),
        rating,
        photoUri,
        dateCompleted: dateCompleted || new Date().toISOString(),
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Something went wrong', 'Could not save this entry. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Remove entry?', `This clears the hobby you logged for ${letter}.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await deleteEntry(letter);
          navigation.goBack();
        },
      },
    ]);
  };

  const suggestions = hobbySuggestions[letter] || [];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.letterBadge}>{letter}</Text>

          <TouchableOpacity style={styles.photoBox} onPress={takePhoto} activeOpacity={0.8}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>Tap to take a photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.photoActionsRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={takePhoto}>
              <Text style={styles.secondaryButtonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={pickFromLibrary}>
              <Text style={styles.secondaryButtonText}>Choose Existing</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldLabel}>HOBBY NAME</Text>
          <TextInput
            style={styles.input}
            placeholder={`e.g. ${suggestions[0] || 'Your hobby'}`}
            placeholderTextColor={colors.textMuted}
            value={hobbyName}
            onChangeText={setHobbyName}
          />

          {suggestions.length > 0 && (
            <View style={styles.suggestionsRow}>
              {suggestions.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={styles.suggestionChip}
                  onPress={() => setHobbyName(s)}
                >
                  <Text style={styles.suggestionChipText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.fieldLabel}>RATING</Text>
          <View style={styles.starsRow}>
            {STAR_VALUES.map((value) => (
              <TouchableOpacity key={value} onPress={() => setRating(value)}>
                <Text style={[styles.star, value <= rating && styles.starActive]}>★</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>NOTES</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="What did you try? Would you do it again?"
            placeholderTextColor={colors.textMuted}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleSave} disabled={saving}>
            <Text style={styles.primaryButtonText}>{saving ? 'Saving...' : 'Save Entry'}</Text>
          </TouchableOpacity>

          {dateCompleted && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>Remove Entry</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    marginBottom: spacing.md,
  },
  photoBox: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    ...typography.body,
    color: colors.textMuted,
  },
  photoActionsRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  secondaryButtonText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 100,
    paddingTop: spacing.sm,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  suggestionChip: {
    backgroundColor: colors.accentMuted,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  suggestionChipText: {
    ...typography.caption,
    color: colors.accentDark,
  },
  starsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  star: {
    fontSize: 32,
    color: colors.borderStrong,
  },
  starActive: {
    color: colors.warning,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  primaryButtonText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  deleteButton: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  deleteButtonText: {
    ...typography.body,
    color: colors.warning,
  },
});
