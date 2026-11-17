import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../TaskContext';

export function DetailScreen({ navigation, route }: { navigation: any; route: any }) {
  const { id } = route.params;
  const taskContext = useTasks();
  const { tasks, toggleTask } = taskContext;
  const { updateNote } = taskContext as typeof taskContext & {
    updateNote: (taskId: (typeof tasks)[number]['id'], note: string) => void;
  };

  const task = tasks.find((t) => t.id === id) as
    | ((typeof tasks)[number] & { note?: string })
    | undefined;
  const [noteText, setNoteText] = useState(task ? task.note || '' : '');

  useEffect(() => {
    setNoteText(task?.note || '');
  }, [task?.note]);

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Task not found</Text>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleSaveNote = () => {
    updateNote(id, noteText.trim());
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
            <TouchableOpacity onPress={() => toggleTask(task.id)} activeOpacity={0.8}>
        <Text style={[styles.statusText, task.done ? styles.doneText : styles.pendingText]}>
          Status: {task.done ? 'Done' : 'Pending'}
        </Text>
      </TouchableOpacity>

      <View style={styles.noteSection}>
        <Text style={styles.label}>Note:</Text>
        <Text style={styles.noteDisplay}>
          {task.note && task.note.trim().length > 0 ? task.note : 'No note'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter note..."
          placeholderTextColor="#888"
          value={noteText}
          onChangeText={setNoteText}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleSaveNote}>
          <Text style={styles.buttonText}>Save note</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.secondaryButtonText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  statusText: { fontSize: 16, fontWeight: '600', marginTop: 8, paddingVertical: 4 },
  doneText: { color: '#2e7d32' },
  pendingText: { color: '#c62828' },
  noteSection: { marginTop: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  noteDisplay: { fontSize: 15, color: '#555', marginBottom: 12, backgroundColor: '#fff', padding: 10, borderRadius: 6 },
  input: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  primaryButton: {
    backgroundColor: '#1976d2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  secondaryButtonText: { color: '#666', fontSize: 16, fontWeight: '600' },
});