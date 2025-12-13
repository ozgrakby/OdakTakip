import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ControlButtons = ({ isActive, onStartStop, onReset }) => {
  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity style={styles.mainButton} onPress={onStartStop}>
        <Text style={styles.mainButtonText}>
          {isActive ? 'DURAKLAT' : 'BAŞLAT'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={onReset}>
        <Text style={styles.resetButtonText}>SIFIRLA</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  mainButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    minWidth: 150,
    alignItems: 'center',
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  resetButtonText: {
    color: '#EF5350',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ControlButtons;