import React, { useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme/colors';
import LetterTile from '../components/LetterTile';
import ProgressBar from '../components/ProgressBar';
import { loadData } from '../utils/storage';

const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

export default function AlphabetScreen({ navigation }) {
  const [data, setData] = useState({});

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadData().then((d) => {
        if (active) setData(d);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const completedCount = Object.keys(data).filter(
    (letter) => (data[letter].hobbies || []).length > 0
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hobby Alphabet</Text>
        <Text style={styles.subtitle}>Explore a hobby for every letter, A to Z.</Text>
        <ProgressBar completed={completedCount} total={26} />
      </View>

      <FlatList
        data={LETTERS}
        keyExtractor={(item) => item}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <LetterTile
            letter={item}
            hobbies={data[item]?.hobbies || []}
            onPress={() => navigation.navigate('LetterDetail', { letter: item })}
          />
        )}
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
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  grid: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xl,
  },
  row: {
    justifyContent: 'flex-start',
  },
});
