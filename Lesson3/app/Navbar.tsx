import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const navigation = useNavigation();

  const menuItems = [
    { id: 1, title: 'Home', icon: '🏠', path: '/Record' },
    { id: 2, title: 'Search', icon: '🔍', path: '' },
    { id: 4, title: 'Settings', icon: '⚙️', path: '/' },
    { id: 3, title: 'Profile', icon: '👤', path: '/ProfilePage' },
  ];

  const handlePress = (item) => {
    setActiveTab(item.title);
    if (item.path) {
      // Remove the leading slash for navigation
      const screenName = item.path.replace('/', '');
      if (screenName) {
        navigation.navigate(screenName);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.navItem,
              activeTab === item.title && styles.activeNavItem,
            ]}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text
              style={[
                styles.navText,
                activeTab === item.title && styles.activeNavText,
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
    borderTopWidth: 2,
    borderTopColor: '#007AFF',
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#666666',
  },
  activeNavText: {
    color: '#007AFF',
  },
});

export default Navbar;