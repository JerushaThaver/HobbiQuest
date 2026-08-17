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
import { addSession } from '../utils/storage';
import { MOODS, formatLongDate } from '../utils/dates';

export default function LogSessionScreen({ route, navigation }) {
  const { letter, hobbyId } = route.params;

  const [mood, setMood] = useState(null);
  const [note, setNote] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: 'Log Activity' });
  }, []);

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
    setSaving(true);
    try {
      await addSession(letter, hobbyId, {
        date: new Date().toISOString(),
        mood,
        note: note.trim(),
        photoUri,
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Something went wrong', 'Could not save this session. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.dateText}>{formatLongDate(new Date().toISOString())}</Text>

          <Text style={styles.fieldLabel}>HOW WAS YOUR SESSION?</Text>
          <View style={styles.moodRow}>
            {MOODS.map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.moodButton, mood === m && styles.moodButtonActive]}
                onPress={() => setMood(m)}
              >
                <Text style={styles.moodEmoji}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>NOTES</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="What did you do this session?"
            placeholderTextColor={colors.textMuted}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.fieldLabel}>ADD PHOTO</Text>
          {photoUri ? (
            <TouchableOpacity onPress={takePhoto} activeOpacity={0.8}>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            </TouchableOpacity>
          ) : (
            <View style={styles.photoActionsRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={takePhoto}>
                <Text style={styles.secondaryButtonText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={pickFromLibrary}>
                <Text style={styles.secondaryButtonText}>Choose Existing</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.primaryButton} onPress={handleSave} disabled={saving}>
            <Text style={styles.primaryButtonText}>{saving ? 'Saving...' : 'Save Session'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  dateText: { ...typography.h3, color: colors.textPrimary },
  fieldLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodButton: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodButtonActive: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.accent,
  },
  moodEmoji: { fontSize: 24 },
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
  photoActionsRow: { flexDirection: 'row', gap: spacing.sm },
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
  photoPreview: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  primaryButtonText: { ...typography.bodyBold, color: colors.white },
});
