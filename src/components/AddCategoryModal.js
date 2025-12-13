import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const AddCategoryModal = ({ visible, value, onChangeText, onAdd, onCancel }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Yeni Kategori Ekle</Text>
          
          <TextInput 
            style={styles.input}
            placeholder="Örn: Yabancı Dil"
            value={value}
            onChangeText={onChangeText}
          />

          <View style={styles.modalActionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onAdd}>
              <Text style={styles.confirmButtonText}>Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.7)' 
  },
  modalView: { 
    width: '80%', 
    backgroundColor: '#1E1E1E',
    borderRadius: 20, 
    padding: 25, 
    alignItems: 'center', 
    elevation: 5,
    borderWidth: 1,
    borderColor: '#333'
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#FFF' 
  },
  input: { 
    width: '100%', 
    borderBottomWidth: 1, 
    borderBottomColor: '#666', 
    fontSize: 18, 
    padding: 10, 
    marginBottom: 20,
    color: '#FFF'
  },
  modalActionButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%' 
  },
  cancelButton: { 
    flex: 1, 
    padding: 15, 
    alignItems: 'center', 
    marginRight: 10 
  },
  cancelButtonText: { 
    color: '#EF5350', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  confirmButton: { 
    flex: 1, 
    backgroundColor: '#4A90E2', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginLeft: 10 
  },
  confirmButtonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
});

export default AddCategoryModal;