import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthFromStorage } from './redux/slices/authSlice';
import { getStoredItem } from './utils/storage';

// Screens
import LoginScreen from './screens/LoginScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import CreateProjectScreen from './screens/CreateProjectScreen';
import TasksScreen from './screens/TasksScreen';
import CreateTaskScreen from './screens/CreateTaskScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ProjectsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerTintColor: '#007AFF',
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}
  >
    <Stack.Screen
      name="ProjectsList"
      component={ProjectsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="CreateProject"
      component={CreateProjectScreen}
      options={{ title: 'Create Project' }}
    />
    <Stack.Screen
      name="Tasks"
      component={TasksScreen}
      options={{ title: 'Tasks' }}
    />
    <Stack.Screen
      name="CreateTask"
      component={CreateTaskScreen}
      options={{ title: 'Create Task' }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerTintColor: '#007AFF',
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}
  >
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
  </Stack.Navigator>
);

const HomeNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#999',
      tabBarLabelStyle: {
        fontSize: 12,
      },
    })}
  >
    <Tab.Screen
      name="Home"
      component={ProjectsStack}
      options={{
        title: 'Projects',
        tabBarLabel: 'Projects',
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileStack}
      options={{
        title: 'Profile',
        tabBarLabel: 'Profile',
      }}
    />
  </Tab.Navigator>
);

const RootNavigator = ({ isAuthenticated, isLoading }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="Home" component={HomeNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await getStoredItem('authToken');
        const email = await getStoredItem('userEmail');
        
        if (token && email) {
          dispatch(setAuthFromStorage({ 
            token, 
            user: { email } 
          }));
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  if (isLoading) {
    return null; // Expo will show the splash screen while loading
  }

  return (
    <NavigationContainer>
      <RootNavigator isAuthenticated={isAuthenticated} isLoading={isLoading} />
    </NavigationContainer>
  );
}
