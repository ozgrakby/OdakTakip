import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Alert, AppState, StyleSheet, Text, View } from 'react-native';

import AddCategoryModal from '../components/AddCategoryModal';
import CategorySelector from '../components/CategorySelector';
import ControlButtons from '../components/ControlButtons';
import DistractionBadge from '../components/DistractionBadge';
import TimePickerModal from '../components/TimePickerModal';
import TimerDisplay from '../components/TimerDisplay';

export default function HomeScreen() {
  const [categories, setCategories] = useState(['Kodlama', 'Ders', 'Kitap']);
  const [selectedCategory, setSelectedCategory] = useState('Kodlama');
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const [initialMinutes, setInitialMinutes] = useState(25); 
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [tempDuration, setTempDuration] = useState(25);
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  const [isActive, setIsActive] = useState(false);
  const [distractionCount, setDistractionCount] = useState(0);
  
  const appState = useRef(AppState.currentState);

  
  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try {
      const savedCats = await AsyncStorage.getItem('custom_categories');
      if (savedCats) setCategories(JSON.parse(savedCats));
    } catch (e) { 
      // console.log(e);
    }
  };

  const addNewCategory = async () => {
    if (newCategoryName.trim().length === 0) {
      Alert.alert("Hata", "Lütfen bir kategori ismi girin.");
      return;
    }
    const updatedCategories = [...categories, newCategoryName];
    setCategories(updatedCategories);
    setSelectedCategory(newCategoryName);
    await AsyncStorage.setItem('custom_categories', JSON.stringify(updatedCategories));
    setNewCategoryName('');
    setCategoryModalVisible(false);
  };

  const openTimeModal = () => {
    if (!isActive) {
      setTempDuration(initialMinutes);
      setTimeModalVisible(true);
    }
  };

  const applyTimeChange = () => {
    setInitialMinutes(tempDuration);
    setTimeLeft(tempDuration * 60);
    setTimeModalVisible(false);
    setIsActive(false);
    setDistractionCount(0);
  };

  const saveSession = async () => {
    try {
      const newSession = {
        id: Date.now(),
        date: new Date().toISOString(),
        category: selectedCategory,
        duration: initialMinutes,
        distractions: distractionCount,
      };
      const existingData = await AsyncStorage.getItem('focus_sessions');
      let sessions = existingData ? JSON.parse(existingData) : [];
      sessions.push(newSession);
      await AsyncStorage.setItem('focus_sessions', JSON.stringify(sessions));
      Alert.alert("Harika!", "Seans kaydedildi.");
    } catch (error) { 
      // console.log(error);
    }
  };
  
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => { setTimeLeft((p) => p - 1); }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      saveSession();
      setTimeLeft(initialMinutes * 60);
      setDistractionCount(0);
    } else { clearInterval(interval); }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState.match(/inactive|background/)) {
        if (isActive) {
          setIsActive(false);
          setDistractionCount(prev => prev + 1);
          Alert.alert("Dikkat!", "Odaktan koptunuz.");
        }
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, [isActive]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remSeconds < 10 ? '0' : ''}${remSeconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Odaklanma Zamanı</Text>

      <TimerDisplay 
        formattedTime={formatTime(timeLeft)} 
        isActive={isActive} 
        onPress={openTimeModal} 
      />

      <DistractionBadge count={distractionCount} />

      <CategorySelector 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
        onAddPress={() => setCategoryModalVisible(true)}
        isActive={isActive}
      />

      <ControlButtons 
        isActive={isActive}
        onStartStop={() => setIsActive(!isActive)}
        onReset={() => {
          setIsActive(false);
          setTimeLeft(initialMinutes * 60);
          setDistractionCount(0);
        }}
      />

      <TimePickerModal 
        visible={timeModalVisible}
        tempDuration={tempDuration}
        onIncrease={() => setTempDuration(p => p + 1)}
        onDecrease={() => tempDuration > 1 && setTempDuration(p => p - 1)}
        onConfirm={applyTimeChange}
        onCancel={() => setTimeModalVisible(false)}
      />

      <AddCategoryModal 
        visible={categoryModalVisible}
        value={newCategoryName}
        onChangeText={setNewCategoryName}
        onAdd={addNewCategory}
        onCancel={() => setCategoryModalVisible(false)}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
});