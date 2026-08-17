import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

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
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.textPrimary,
  headerTitleStyle: { fontWeight: '600' },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.background },
};

// Home Stack
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Calendar" component={CalendarScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Stats" component={StatsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// Alphabet Stack
function AlphabetStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="AlphabetScreen" component={AlphabetScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LetterDetail" component={LetterDetailScreen} options={{ title: 'Letter' }} />
      <Stack.Screen name="AddHobby" component={AddHobbyScreen} options={{ title: 'Add Hobby' }} />
      <Stack.Screen name="HobbyProfile" component={HobbyProfileScreen} options={{ title: 'Hobby' }} />
    </Stack.Navigator>
  );
}

// Tracker Stack
function TrackerStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="HobbyTrackerScreen" component={HobbyTrackerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HobbyTrackerDetail" component={HobbyTrackerDetailScreen} options={{ title: 'Hobby' }} />
      <Stack.Screen name="LogSession" component={LogSessionScreen} options={{ title: 'Log Activity' }} />
    </Stack.Navigator>
  );
}

// Profile/More Stack
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RandomHobby" component={RandomHobbyScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CompletionCelebration" component={CompletionCelebrationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Collage" component={CollageScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            paddingBottom: 10,
            paddingTop: 8,
            height: 72,
            shadowColor: 'transparent',
            elevation: 0,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: -4,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={21} color={focused ? colors.accent : color} />
            ),
          }}
        />
        <Tab.Screen
          name="Alphabet"
          component={AlphabetStack}
          options={{
            tabBarLabel: 'Alphabet',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'library' : 'library-outline'} size={21} color={focused ? colors.accent : color} />
            ),
          }}
        />
        <Tab.Screen
          name="Tracker"
          component={TrackerStack}
          options={{
            tabBarLabel: 'Tracker',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'book' : 'book-outline'} size={21} color={focused ? colors.accent : color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            tabBarLabel: 'More',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} size={21} color={focused ? colors.accent : color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
