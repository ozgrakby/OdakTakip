import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TimerDisplay = ({ formattedTime, isActive, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formattedTime}</Text>
        <Text style={styles.statusText}>
          {isActive ? 'Odaklanılıyor...' : 'Süreyi Değiştirmek İçin Dokun'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    backgroundColor: '#1E1E1E',
    width: 250,
    height: 250,
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#4A90E2',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  timerText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  statusText: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 10,
  },
});

export default TimerDisplay;