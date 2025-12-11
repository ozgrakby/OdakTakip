import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from './src/screens/HomeScreen';
import ReportScreen from './src/screens/ReportScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
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