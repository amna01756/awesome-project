import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Screen } from '../ui/Screen';
import { Card } from '../ui/Card';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { useTasks } from '../TaskContext';

type FilterType = 'All' | 'Pending' | 'Done';

export function HomeScreen({ navigation }: { navigation: any }) {
  const { tasks, toggleTask, deleteTask } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const filteredTasks = tasks.filter((task: any) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase().trim());

    if (activeFilter === 'Pending') {
      return matchesSearch && !task.completed;
    }
    if (activeFilter === 'Done') {
      return matchesSearch && task.completed;
    }
    return matchesSearch;
  });

  const handleAddTask = () => {
    const trimmed = newTaskTitle.trim();
    if (!trimmed) {
      return;
    }
    navigation.navigate('AddTask', { initialTitle: trimmed });
    setNewTaskTitle('');
  };

  return (
    <Screen>
      <AppText variant="title" style={styles.title}>
        Tasks
      </AppText>

      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search tasks..."
        placeholderTextColor="#9ca3af"
        style={styles.searchInput}
      />

      <View style={styles.filterRow}>
        {(['All', 'Pending', 'Done'] as FilterType[]).map((filter) => {
          const isSelected = activeFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterChip,
                isSelected && styles.filterChipActive,
              ]}
            >
              <AppText
                variant="caption"
                style={[
                  styles.filterText,
                  isSelected && styles.filterTextActive,
                ]}
              >
                {filter}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.addRow}>
        <TextInput
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          placeholder="New task title..."
          placeholderTextColor="#9ca3af"
          style={styles.taskInput}
        />
        <Button
          title="Add"
          variant="primary"
          onPress={handleAddTask}
          style={styles.addButton}
        />
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item: any) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <AppText variant="body" style={styles.emptyText}>
              No tasks found.
            </AppText>
          </Card>
        }
        renderItem={({ item }: { item: any }) => (
          <Card style={styles.taskCard}>
            <View style={styles.taskRow}>
              <TouchableOpacity
                style={styles.taskInfo}
                onPress={() =>
                  navigation.navigate('TaskDetail', { taskId: item.id })
                }
              >
                <AppText
                  variant="body"
                  style={[
                    styles.taskTitle,
                    item.completed && styles.completedTask,
                  ]}
                >
                  {item.title}
                </AppText>
                <AppText variant="caption">
                  {item.completed ? 'Done' : 'Pending'}
                </AppText>
              </TouchableOpacity>

              <View style={styles.taskActions}>
                <TouchableOpacity
                  onPress={() => toggleTask(item.id)}
                  style={styles.actionPill}
                >
                  <AppText variant="caption" style={styles.actionText}>
                    {item.completed ? 'Undo' : 'Done'}
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => deleteTask(item.id)}
                  style={[styles.actionPill, styles.deletePill]}
                >
                  <AppText variant="caption" style={styles.deleteText}>
                    Delete
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: '#1976d2',
  },
  filterText: {
    color: '#374151',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  taskInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  addButton: {
    paddingHorizontal: 18,
  },
  listContent: {
    paddingBottom: 16,
  },
  taskCard: {
    marginBottom: 10,
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
    paddingRight: 12,
  },
  taskTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionPill: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionText: {
    color: '#1976d2',
    fontWeight: '600',
  },
  deletePill: {
    backgroundColor: '#fef2f2',
  },
  deleteText: {
    color: '#dc2626',
    fontWeight: '600',
  },
  emptyCard: {
    alignItems: 'center',
    marginTop: 12,
  },
  emptyText: {
    color: '#6b7280',
  },
});