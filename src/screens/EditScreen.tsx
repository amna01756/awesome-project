import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTasks } from '../TaskContext.tsx';
import { SafeAreaView } from 'react-native-safe-area-context';


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  formContainer: { flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  errorText: { color: 'red', marginBottom: 12 },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#007AFF', fontSize: 16 },
});

type Task = {
  id: string | number;
  title: string;
};

export default function EditScreen({ navigation, route }: { navigation: any; route: any }) {
  const { id } = route.params;
  const { tasks, editTask } = useTasks();

  const currentTask = tasks.find((t: Task) => t.id === id);
  const [title, setTitle] = useState(currentTask ? currentTask.title : '');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    editTask(id, title.trim());
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Edit task</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter task title..."
          placeholderTextColor="#888"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (error) setError('');
          }}
          autoFocus
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}