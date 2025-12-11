import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CategorySelector = ({ categories, selectedCategory, onSelect, onAddPress, isActive }) => {
  return (
    <View style={styles.categoryContainer}>
      <Text style={styles.sectionTitle}>Kategori Seç:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat} 
            style={[
              styles.categoryButton, 
              selectedCategory === cat && styles.categoryButtonSelected
            ]}
            onPress={() => !isActive && onSelect(cat)}
          >
            <Text style={[
              styles.categoryText, 
              selectedCategory === cat && styles.categoryTextSelected
            ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={[styles.categoryButton, styles.addButton]}
          onPress={onAddPress}
        >
            <Text style={styles.addButtonText}> + </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    width: '100%',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#555',
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryButtonSelected: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  categoryText: {
    color: '#555',
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    borderColor: '#4A90E2',
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default CategorySelector;