import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ReportScreen() {
  const [stats, setStats] = useState({
    todayTime: 0,
    totalTime: 0,
    totalDistractions: 0,
    sessionCount: 0
  });

  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('focus_sessions');
      const sessions = jsonValue != null ? JSON.parse(jsonValue) : [];

      let todayTotal = 0;
      let allTimeTotal = 0;
      let totalDistractions = 0;

      const todayStr = new Date().toISOString().split('T')[0];

      sessions.forEach(session => {
        allTimeTotal += session.duration;
        totalDistractions += session.distractions;

        const sessionDateStr = session.date.split('T')[0];

        if (sessionDateStr === todayStr) {
          todayTotal += session.duration;
        }
      });
      setStats({
        todayTime: todayTotal,
        totalTime: allTimeTotal,
        totalDistractions: totalDistractions,
        sessionCount: sessions.length
      });

    } catch (e) {
      console.error("Veri okuma hatası:", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>İstatistikler</Text>

      <View style={styles.statsGrid}>
        
        <View style={[styles.card, { backgroundColor: '#E3F2FD' }]}>
          <Text style={styles.cardTitle}>Bugün Odaklanma</Text>
          <Text style={[styles.cardValue, { color: '#1E88E5' }]}>
            {stats.todayTime} dk
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#E8F5E9' }]}>
          <Text style={styles.cardTitle}>Toplam Odaklanma</Text>
          <Text style={[styles.cardValue, { color: '#43A047' }]}>
            {stats.totalTime} dk
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#FFF3E0' }]}>
          <Text style={styles.cardTitle}>Toplam Seans</Text>
          <Text style={[styles.cardValue, { color: '#FB8C00' }]}>
            {stats.sessionCount} adet
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#FFEBEE' }]}>
          <Text style={styles.cardTitle}>Dikkat Dağılması</Text>
          <Text style={[styles.cardValue, { color: '#E53935' }]}>
            {stats.totalDistractions} kez
          </Text>
        </View>

      </View>
      
      <Text style={styles.infoText}>
        Veriler tamamlanan seanslardan otomatik çekilmektedir.
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600'
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    fontSize: 12
  }
});