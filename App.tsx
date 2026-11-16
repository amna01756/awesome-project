import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskProvider } from './src/TaskContext';
import HomeScreen from './src/screens/HomeScreen';
import  AddScreen  from './src/screens/AddScreen';
import EditScreen  from './src/screens/EditScreen';
import { DetailScreen } from './src/screens/DetailScreen';
import { UsersScreen } from './src/screens/UsersScreen';
// In App.tsx inside your Stack.Navigator

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TaskProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="AddTask"
            component={AddScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditTask"
            component={EditScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DetailTask"
            component={DetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Users"
            component={UsersScreen} 
            options={{ title: 'Users Directory' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TaskProvider>
  );
}