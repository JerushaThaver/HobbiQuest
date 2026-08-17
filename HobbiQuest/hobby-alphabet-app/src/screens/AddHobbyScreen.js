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
import { addHobby } from '../utils/storage';
import { hobbySuggestions, CATEGORIES } from '../data/hobbySuggestions';

const STAR_VALUES = [1, 2, 3, 4, 5];

export default function AddHobbyScreen({ route, navigation }) {
  const { letter } = route.params;

  const [hobbyName, setHobbyName] = useState('');
  const [category, setCategory] = useState('Other');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [photoUri, setPhotoUri] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: `Add Hobby · ${letter}` });
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
      Alert.alert('Add a hobby name', 'Give this hobby a name before saving.');
      return;
    }
    setSaving(true);
    try {
      await addHobby(letter, {
        name: hobbyName.trim(),
        category,
        notes: notes.trim(),
        rating,
        photoUri,
        tracking,
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Something went wrong', 'Could not save this hobby. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const suggestions = hobbySuggestions[letter] || [];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
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
            <View style={styles.chipsRow}>
              {suggestions.map((s) => (
                <TouchableOpacity key={s} style={styles.chip} onPress={() => setHobbyName(s)}>
                  <Text style={styles.chipText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.fieldLabel}>CATEGORY</Text>
          <View style={styles.chipsRow}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.chip, category === c && styles.chipActive]}
                onPress={() => setCategory(c)}
              >
                <Text style={[styles.chipText, category === c && styles.chipTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

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
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={styles.trackingRow}
            onPress={() => setTracking((prev) => !prev)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, tracking && styles.checkboxActive]}>
              {tracking && <Text style={styles.checkboxMark}>✓</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.trackingTitle}>Track this hobby</Text>
              <Text style={styles.trackingSubtitle}>
                Log sessions and photos over time in the Hobby Tracker.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={handleSave} disabled={saving}>
            <Text style={styles.primaryButtonText}>{saving ? 'Saving...' : 'Save Hobby'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  photoBox: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photo: { width: '100%', height: '100%' },
  photoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  photoPlaceholderText: { ...typography.body, color: colors.textMuted },
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
  secondaryButtonText: { ...typography.bodyBold, color: colors.textPrimary },
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
  textArea: { minHeight: 100, paddingTop: spacing.sm },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: { ...typography.caption, color: colors.textPrimary },
  chipTextActive: { color: colors.white },
  starsRow: { flexDirection: 'row', gap: spacing.xs },
  star: { fontSize: 32, color: colors.borderStrong },
  starActive: { color: colors.warning },
  trackingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkboxMark: { color: colors.white, fontSize: 14, fontWeight: '700' },
  trackingTitle: { ...typography.bodyBold, color: colors.textPrimary },
  trackingSubtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  primaryButtonText: { ...typography.bodyBold, color: colors.white },
});
