import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTasks } from '../TaskContext';
import { SafeAreaView } from 'react-native-safe-area-context';

type FilterType = 'All' | 'Pending' | 'Done';                          
function HomeScreen({ navigation }: { navigation: any }) {
  const { tasks, deleteTask } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  // Counts based on total list, irrespective of current search or filter
  const completedCount = tasks.filter((t: { done: boolean }) => t.done).length;
  const totalCount = tasks.length;

  // Filter and search logic combined
  const filteredTasks = tasks.filter((task: { title: string; done: boolean }) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase().trim());

    if (activeFilter === 'Pending') {
      return matchesSearch && !task.done;
    }
    if (activeFilter === 'Done') {
      return matchesSearch && task.done;
    }
    return matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>My tasks</Text>
        <Text style={styles.counter}>
          Completed {completedCount} of {totalCount}
        </Text>

        {/* Search Bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search tasks..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {(['All', 'Pending', 'Done'] as FilterType[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === filter && styles.filterButtonTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {filteredTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {tasks.length === 0 ? 'No tasks yet' : 'No tasks found'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <TouchableOpacity
                style={styles.taskInfo}
                onPress={() => navigation.navigate('DetailTask', { id: item.id })}
                activeOpacity={0.7}
              >
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text
                  style={[
                    styles.statusText,
                    item.done ? styles.doneText : styles.pendingText,
                  ]}
                >
                  {item.done ? 'Done' : 'Pending'}
                </Text>
              </TouchableOpacity>

              <View style={styles.rowActions}>
                <TouchableOpacity
                  style={styles.smallEditButton}
                  onPress={() =>
                    // Only pass primitive string id in params (no functions!)
                    navigation.navigate('EditTask', { id: item.id })
                  }
                >
                  <Text style={styles.smallButtonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.smallDeleteButton}
                  onPress={() => deleteTask(item.id)}
                >
                  <Text style={styles.smallButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.buttonText}>Add task</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerContainer: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  counter: { fontSize: 16, color: '#555', marginBottom: 12 },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
    color: '#000',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  taskCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
  },
  doneText: {
    color: 'green',
  },
  pendingText: {
    color: '#d90606',
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallEditButton: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  smallDeleteButton: {
    backgroundColor: '#f0c3c3',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  smallButtonText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen;  
  