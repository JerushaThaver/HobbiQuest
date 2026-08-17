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
import { colors, radius, spacing, typography } from '../theme/colors';
import { hobbySuggestions } from '../data/hobbySuggestions';

const ALL_HOBBIES = [];
Object.values(hobbySuggestions).forEach((list) => {
  ALL_HOBBIES.push(...list);
});

export default function RandomHobbyScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('letter'); // 'letter' or 'hobby'
  const [randomLetter, setRandomLetter] = useState(null);
  const [randomHobby, setRandomHobby] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const generateRandomLetter = useCallback(() => {
    const letters = Object.keys(hobbySuggestions);
    const letter = letters[Math.floor(Math.random() * letters.length)];
    setRandomLetter(letter);
    setSuggestions(hobbySuggestions[letter] || []);
  }, []);

  const generateRandomHobby = useCallback(() => {
    const hobby = ALL_HOBBIES[Math.floor(Math.random() * ALL_HOBBIES.length)];
    setRandomHobby(hobby);
  }, []);

  useFocusEffect(
    useCallback(() => {
      generateRandomLetter();
      generateRandomHobby();
    }, [generateRandomLetter, generateRandomHobby])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>What should I try next?</Text>
        <Text style={styles.subtitle}>Let us help you discover.</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'letter' && styles.tabActive,
          ]}
          onPress={() => setActiveTab('letter')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'letter' && styles.tabTextActive,
            ]}
          >
            🎲 Random Letter
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'hobby' && styles.tabActive,
          ]}
          onPress={() => setActiveTab('hobby')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'hobby' && styles.tabTextActive,
            ]}
          >
            ✨ Random Hobby
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Random Letter Tab */}
        {activeTab === 'letter' && randomLetter && (
          <View style={styles.section}>
            {/* Large Letter Display */}
            <View style={styles.letterDisplay}>
              <Text style={styles.largeLetterText}>{randomLetter}</Text>
              <Text style={styles.letterSubtitle}>
                Try a hobby starting with {randomLetter}!
              </Text>
            </View>

            {/* Suggestions */}
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Suggestions</Text>
              {suggestions.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  style={styles.suggestionItem}
                  onPress={() => {
                    Alert.alert(
                      'Add hobby?',
                      `Would you like to add "${suggestion}" to your hobbies?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Add',
                          onPress: () => {
                            navigation.navigate('AddHobby', {
                              suggestedName: suggestion,
                              suggestedLetter: randomLetter,
                            });
                          },
                        },
                      ]
                    );
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                  <Text style={styles.suggestionArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Buttons */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('LetterDetail', { letter: randomLetter })}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Try This Letter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={generateRandomLetter}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Give Me Another</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Random Hobby Tab */}
        {activeTab === 'hobby' && randomHobby && (
          <View style={styles.section}>
            {/* Hobby Card */}
            <View style={styles.hobbyCard}>
              <Text style={styles.hobbyEmoji}>🎯</Text>
              <Text style={styles.hobbyName}>{randomHobby}</Text>
              <Text style={styles.hobbyDescription}>
                A hobby that might spark your interest!
              </Text>
            </View>

            {/* Buttons */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                Alert.alert(
                  'Add hobby?',
                  `Would you like to add "${randomHobby}" to your hobbies?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Add',
                      onPress: () => {
                        navigation.navigate('AddHobby', {
                          suggestedName: randomHobby,
                        });
                      },
                    },
                  ]
                );
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Add to My Hobbies</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={generateRandomHobby}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Try Another</Text>
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  tabText: {
    fontWeight: '600',
    color: colors.textSecondary,
    fontSize: 13,
  },
  tabTextActive: {
    color: colors.surface,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
  },
  section: {
    alignItems: 'stretch',
  },
  letterDisplay: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  largeLetterText: {
    fontSize: 100,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: spacing.md,
  },
  letterSubtitle: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  suggestionsContainer: {
    marginBottom: spacing.lg,
  },
  suggestionsTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  suggestionItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionText: {
    flex: 1,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  suggestionArrow: {
    fontSize: 18,
    color: colors.accent,
  },
  hobbyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  hobbyEmoji: {
    fontSize: 60,
    marginBottom: spacing.md,
  },
  hobbyName: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  hobbyDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  primaryButtonText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
});
