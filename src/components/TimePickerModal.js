import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TimePickerModal = ({ visible, tempDuration, onIncrease, onDecrease, onConfirm, onCancel }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Süre Ayarla</Text>
          
          <View style={styles.stepperContainer}>
            <TouchableOpacity style={styles.stepperButton} onPress={onDecrease}>
              <Text style={styles.stepperButtonText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.stepperValue}>{tempDuration} dk</Text>
            
            <TouchableOpacity style={styles.stepperButton} onPress={onIncrease}>
              <Text style={styles.stepperButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalActionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmButtonText}>Tamam</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { width: '80%', backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  stepperButton: { width: 50, height: 50, backgroundColor: '#E3F2FD', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  stepperButtonText: { fontSize: 24, fontWeight: 'bold', color: '#1E88E5' },
  stepperValue: { fontSize: 32, fontWeight: 'bold', color: '#333', marginHorizontal: 20 },
  modalActionButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  cancelButton: { flex: 1, padding: 15, alignItems: 'center', marginRight: 10 },
  cancelButtonText: { color: '#E74C3C', fontWeight: 'bold', fontSize: 16 },
  confirmButton: { flex: 1, backgroundColor: '#4A90E2', padding: 15, borderRadius: 10, alignItems: 'center', marginLeft: 10 },
  confirmButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default TimePickerModal;