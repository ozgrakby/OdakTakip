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
    backgroundColor: '#FFE0B2',
    padding: 10,
    borderRadius: 10,
  },
  statsTitle: {
    fontSize: 16,
    color: '#E65100',
    marginRight: 10,
  },
  statsCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
  },
});

export default DistractionBadge;