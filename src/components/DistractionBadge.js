import { StyleSheet, Text, View } from 'react-native';

const DistractionBadge = ({ count }) => {
  return (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>Dikkat Dağınıklığı:</Text>
      <Text style={styles.statsCount}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#3E2723',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E65100',
  },
  statsTitle: {
    fontSize: 16,
    color: '#FFCC80',
    marginRight: 10,
  },
  statsCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFB74D',
  },
});

export default DistractionBadge;