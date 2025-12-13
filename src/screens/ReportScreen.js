import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import ChartsSection from '../components/ChartsSection';
import StatCard from '../components/StatCard';

export default function ReportScreen() {
  const [stats, setStats] = useState({
    todayTime: 0,
    totalTime: 0,
    totalDistractions: 0,
    sessionCount: 0,
    averageTime: 0
  });

  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [{ data: [0] }]
  });

  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('focus_sessions');
      const sessions = jsonValue != null ? JSON.parse(jsonValue) : [];
      processStats(sessions);
      processCharts(sessions);
    } catch (e) {
      console.error("Veri okuma hatası:", e);
    }
  };

  const processStats = (sessions) => {
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

    const avgTime = sessions.length > 0 ? Math.round(allTimeTotal / sessions.length) : 0;

    setStats({
      todayTime: todayTotal,
      totalTime: allTimeTotal,
      totalDistractions: totalDistractions,
      sessionCount: sessions.length,
      averageTime: avgTime
    });
  };

  const processCharts = (sessions) => {
    const categoryMap = {};
    sessions.forEach(s => {
      if (categoryMap[s.category]) categoryMap[s.category] += s.duration;
      else categoryMap[s.category] = s.duration;
    });

    const colors = ['#E57373', '#64B5F6', '#81C784', '#FFD54F', '#BA68C8', '#90A4AE'];
    const pData = Object.keys(categoryMap).map((cat, index) => ({
      name: cat,
      population: categoryMap[cat],
      color: colors[index % colors.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }));
    setPieData(pData);

    const last7Days = [];
    const last7DaysData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split('T')[0];
      const dayLabel = `${d.getDate()}/${d.getMonth() + 1}`;
      
      last7Days.push(dayLabel);
      const totalForDay = sessions
        .filter(s => s.date.startsWith(dayStr))
        .reduce((sum, current) => sum + current.duration, 0);
      last7DaysData.push(totalForDay);
    }

    setBarData({
      labels: last7Days,
      datasets: [{ data: last7DaysData }]
    });
  };

  useFocusEffect(
    useCallback(() => { loadData(); }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsGrid}>
        <StatCard title="Bugün" value={`${stats.todayTime} dk`} color="#64B5F6" backgroundColor="#1E1E1E" />
        <StatCard title="Toplam" value={`${stats.totalTime} dk`} color="#81C784" backgroundColor="#1E1E1E" />
        <StatCard title="Seans Sayısı" value={stats.sessionCount} color="#FFB74D" backgroundColor="#1E1E1E" />
        <StatCard title="Dikkat Dağılması" value={stats.totalDistractions} color="#EF5350" backgroundColor="#1E1E1E" />
        <StatCard title="Ortalama Süre" value={`${stats.averageTime} dk`} color="#BA68C8" backgroundColor="#1E1E1E" isFullWidth={true} />
      </View>

      <ChartsSection pieData={pieData} barData={barData} />
      
      <View style={{ height: 50 }} /> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212',
    padding: 20, 
    paddingTop: 50 
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#FFFFFF',
    marginBottom: 20 
  },
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
});