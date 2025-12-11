import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const ChartsSection = ({ pieData, barData }) => {
  
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
    strokeWidth: 2, 
    barPercentage: 0.5,
    useShadowColorFromDataset: false 
  };

  return (
    <View style={styles.container}>
      
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  chartStyle: {
    borderRadius: 16,
    marginVertical: 8,
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
    fontStyle: 'italic',
  }
});

export default ChartsSection;