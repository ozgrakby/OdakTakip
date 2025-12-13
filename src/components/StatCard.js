import { StyleSheet, Text, View } from 'react-native';

const StatCard = ({ title, value, color, backgroundColor, isFullWidth }) => {
  return (
    <View 
      style={[
        styles.card, 
        { backgroundColor: backgroundColor },
        isFullWidth && { width: '100%' }
      ]}
    >
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={[styles.cardValue, { color: color }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#333', // İnce çerçeve
    // Shadow ayarları koyu temada çok görünmez ama durabilir
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: '#B0B0B0', // Açık Gri Başlık
    marginBottom: 5,
    fontWeight: '600',
    textAlign: 'center'
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default StatCard;