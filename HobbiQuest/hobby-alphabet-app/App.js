import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import AlphabetScreen from './src/screens/AlphabetScreen';
import LetterDetailScreen from './src/screens/LetterDetailScreen';
import AddHobbyScreen from './src/screens/AddHobbyScreen';
import HobbyProfileScreen from './src/screens/HobbyProfileScreen';
import LogSessionScreen from './src/screens/LogSessionScreen';
import HobbyTrackerScreen from './src/screens/HobbyTrackerScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import HobbyTrackerDetailScreen from './src/screens/HobbyTrackerDetailScreen';
import StatsScreen from './src/screens/StatsScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import RandomHobbyScreen from './src/screens/RandomHobbyScreen';
import CompletionCelebrationScreen from './src/screens/CompletionCelebrationScreen';
import CollageScreen from './src/screens/CollageScreen';
import { colors } from './src/theme/colors';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Alphabet" component={AlphabetScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LetterDetail" component={LetterDetailScreen} options={{ title: 'Letter' }} />
        <Stack.Screen name="AddHobby" component={AddHobbyScreen} options={{ title: 'Add Hobby' }} />
        <Stack.Screen name="HobbyProfile" component={HobbyProfileScreen} options={{ title: 'Hobby' }} />
        <Stack.Screen name="LogSession" component={LogSessionScreen} options={{ title: 'Log Activity' }} />
        <Stack.Screen name="HobbyTracker" component={HobbyTrackerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HobbyTrackerDetail" component={HobbyTrackerDetailScreen} options={{ title: 'Hobby' }} />
        <Stack.Screen name="Calendar" component={CalendarScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Stats" component={StatsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RandomHobby" component={RandomHobbyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CompletionCelebration" component={CompletionCelebrationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Collage" component={CollageScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
