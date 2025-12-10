import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function ReportScreen() {
  const [stats, setStats] = useState({
    todayTime: 0,
    totalTime: 0,
    totalDistractions: 0,
    sessionCount: 0
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

    setStats({
      todayTime: todayTotal,
      totalTime: allTimeTotal,
      totalDistractions: totalDistractions,
      sessionCount: sessions.length
    });
  };

  const processCharts = (sessions) => {
    const categoryMap = {};
    sessions.forEach(s => {
      if (categoryMap[s.category]) {
        categoryMap[s.category] += s.duration;
      } else {
        categoryMap[s.category] = s.duration;
      }
    });

    const colors = ['#E57373', '#64B5F6', '#81C784', '#FFD54F', '#BA68C8'];
    
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
    useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>İstatistikler & Raporlar</Text>

      <View style={styles.statsGrid}>
        <View style={[styles.card, { backgroundColor: '#E3F2FD' }]}>
          <Text style={styles.cardTitle}>Bugün</Text>
          <Text style={[styles.cardValue, { color: '#1E88E5' }]}>{stats.todayTime} dk</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#E8F5E9' }]}>
          <Text style={styles.cardTitle}>Toplam</Text>
          <Text style={[styles.cardValue, { color: '#43A047' }]}>{stats.totalTime} dk</Text>
        </View>
      </View>

      <Text style={styles.chartTitle}>Kategori Dağılımı</Text>
      {pieData.length > 0 ? (
        <PieChart
          data={pieData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />
      ) : (
        <Text style={styles.noDataText}>Henüz veri yok.</Text>
      )}

      <Text style={styles.chartTitle}>Son 7 Gün (Dakika)</Text>
      <BarChart
        data={barData}
        width={screenWidth - 40}
        height={220}
        yAxisLabel=""
        yAxisSuffix=" dk"
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        style={styles.chartStyle}
      />
      
      <View style={{ height: 50 }} /> 
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
  strokeWidth: 2, 
  barPercentage: 0.5,
  useShadowColorFromDataset: false 
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  card: { width: '48%', padding: 20, borderRadius: 15, alignItems: 'center', elevation: 3 },
  cardTitle: { fontSize: 14, color: '#555', marginBottom: 5 },
  cardValue: { fontSize: 24, fontWeight: 'bold' },
  chartTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 10, marginBottom: 10 },
  chartStyle: { borderRadius: 16, marginVertical: 8 },
  noDataText: { textAlign: 'center', color: '#999', marginVertical: 20 }
});