import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Alert, AppState, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [categories, setCategories] = useState(['Kodlama', 'Ders', 'Kitap']);
  const [selectedCategory, setSelectedCategory] = useState('Kodlama');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const [initialMinutes, setInitialMinutes] = useState(25); 
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [tempDuration, setTempDuration] = useState(25);

  const [isActive, setIsActive] = useState(false);
  const [distractionCount, setDistractionCount] = useState(0);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const savedCats = await AsyncStorage.getItem('custom_categories');
      if (savedCats) {
        setCategories(JSON.parse(savedCats));
      }
    } catch (e) {
      console.log("Kategori yükleme hatası", e);
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
    
    // Hafızaya kaydet
    await AsyncStorage.setItem('custom_categories', JSON.stringify(updatedCategories));
    
    // Temizlik
    setNewCategoryName('');
    setCategoryModalVisible(false);
  };

  const openTimeModal = () => {
    if (!isActive) {
      setTempDuration(initialMinutes);
      setTimeModalVisible(true);
    }
  };

  const increaseTime = () => setTempDuration(prev => prev + 1);
  const decreaseTime = () => { if (tempDuration > 1) setTempDuration(prev => prev - 1); };

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
      
      Alert.alert("Harika!", `${initialMinutes} dakikalık ${selectedCategory} seansı kaydedildi.`);

    } catch (error) {
      console.log("Kayıt Hatası:", error);
    }
  };
  
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      saveSession();
      setTimeLeft(initialMinutes * 60);
      setDistractionCount(0);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState.match(/inactive|background/)) {
        if (isActive) {
          setIsActive(false);
          setDistractionCount(prev => prev + 1);
          Alert.alert("Dikkat!", "Odaktan koptunuz. Sayaç duraklatıldı.");
        }
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, [isActive]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleStartStop = () => setIsActive(!isActive);
  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(initialMinutes * 60);
    setDistractionCount(0);
  };

  return (
    <View style={styles.container}>
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={timeModalVisible}
        onRequestClose={() => setTimeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Süre Ayarla</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity style={styles.stepperButton} onPress={decreaseTime}>
                <Text style={styles.stepperButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{tempDuration} dk</Text>
              <TouchableOpacity style={styles.stepperButton} onPress={increaseTime}>
                <Text style={styles.stepperButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalActionButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setTimeModalVisible(false)}>
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={applyTimeChange}>
                <Text style={styles.confirmButtonText}>Tamam</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Yeni Kategori Ekle</Text>
            
            <TextInput 
              style={styles.input}
              placeholder="Örn: Yabancı Dil"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />

            <View style={styles.modalActionButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setCategoryModalVisible(false)}>
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={addNewCategory}>
                <Text style={styles.confirmButtonText}>Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Odaklanma Zamanı</Text>

      <TouchableOpacity onPress={openTimeModal}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          <Text style={styles.statusText}>
            {isActive ? 'Odaklanılıyor...' : 'Süreyi Değiştirmek İçin Dokun'}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Dikkat Dağınıklığı:</Text>
        <Text style={styles.statsCount}>{distractionCount}</Text>
      </View>

      <View style={styles.categoryContainer}>
        <Text style={styles.sectionTitle}>Kategori Seç:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[
                styles.categoryButton, 
                selectedCategory === cat && styles.categoryButtonSelected
              ]}
              onPress={() => !isActive && setSelectedCategory(cat)}
            >
              <Text style={[
                styles.categoryText, 
                selectedCategory === cat && styles.categoryTextSelected
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity 
            style={[styles.categoryButton, { borderColor: '#4A90E2', borderStyle: 'dashed' }]}
            onPress={() => setCategoryModalVisible(true)}
          >
             <Text style={{ color: '#4A90E2', fontWeight: 'bold', fontSize: 16 }}> + </Text>
          </TouchableOpacity>

        </ScrollView>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.mainButton} onPress={handleStartStop}>
          <Text style={styles.mainButtonText}>
            {isActive ? 'DURAKLAT' : 'BAŞLAT'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>SIFIRLA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  timerContainer: { backgroundColor: '#fff', width: 250, height: 250, borderRadius: 125, justifyContent: 'center', alignItems: 'center', borderWidth: 5, borderColor: '#4A90E2', marginBottom: 20, elevation: 5 },
  timerText: { fontSize: 60, fontWeight: 'bold', color: '#4A90E2' },
  statusText: { fontSize: 12, color: '#888', marginTop: 10 },
  statsContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, backgroundColor: '#FFE0B2', padding: 10, borderRadius: 10 },
  statsTitle: { fontSize: 16, color: '#E65100', marginRight: 10 },
  statsCount: { fontSize: 18, fontWeight: 'bold', color: '#E65100' },
  categoryContainer: { width: '100%', marginBottom: 30 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#555' },
  scrollContainer: { flexDirection: 'row' },
  categoryButton: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#fff', borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#ddd' },
  categoryButtonSelected: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  categoryText: { color: '#555' },
  categoryTextSelected: { color: '#fff', fontWeight: 'bold' },
  controlsContainer: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignItems: 'center' },
  mainButton: { backgroundColor: '#4A90E2', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, minWidth: 150, alignItems: 'center' },
  mainButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  resetButton: { paddingVertical: 15, paddingHorizontal: 20 },
  resetButtonText: { color: '#E74C3C', fontSize: 16, fontWeight: 'bold' },

  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { width: '80%', backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  
  stepperContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  stepperButton: { width: 50, height: 50, backgroundColor: '#E3F2FD', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  stepperButtonText: { fontSize: 24, fontWeight: 'bold', color: '#1E88E5' },
  stepperValue: { fontSize: 32, fontWeight: 'bold', color: '#333', marginHorizontal: 20 },

  input: { width: '100%', borderBottomWidth: 1, borderBottomColor: '#ccc', fontSize: 18, padding: 10, marginBottom: 20 },

  modalActionButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  cancelButton: { flex: 1, padding: 15, alignItems: 'center', marginRight: 10 },
  cancelButtonText: { color: '#E74C3C', fontWeight: 'bold', fontSize: 16 },
  confirmButton: { flex: 1, backgroundColor: '#4A90E2', padding: 15, borderRadius: 10, alignItems: 'center', marginLeft: 10 },
  confirmButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});