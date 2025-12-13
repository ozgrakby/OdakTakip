import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';

import HomeScreen from './src/screens/HomeScreen';
import ReportScreen from './src/screens/ReportScreen';

const Tab = createBottomTabNavigator();

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#121212', 
    card: '#1E1E1E',
    text: '#ffffff',
    border: '#333333',
    notification: '#ff453a',
  },
};

export default function App() {
  return (
    <NavigationContainer theme={MyDarkTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          
          tabBarStyle: {
            backgroundColor: '#1E1E1E',
            borderTopColor: '#333333',
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: '#4A90E2',
          tabBarInactiveTintColor: '#888888',
          
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Ana Sayfa') {
              iconName = focused ? 'timer' : 'timer-outline';
            } else if (route.name === 'Raporlar') {
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen 
          name="Ana Sayfa" 
          component={HomeScreen} 
        />
        <Tab.Screen 
          name="Raporlar" 
          component={ReportScreen} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}