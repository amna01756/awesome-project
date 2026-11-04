import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@task_list_key';

interface Task {
  id: string;
  title: string;
  done: boolean;
}

function HomeScreen({ navigation }: { navigation: any }) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Buy milk', done: true },
    { id: '2', title: 'Read docs', done: false },
    { id: '3', title: 'Call mentor', done: false },
  ]);

  // 1. Load tasks from AsyncStorage when app opens
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch {
        Alert.alert('Error', 'Failed to load tasks');
      }
    };

    loadTasks();
  }, []);

  // 2. Save tasks to AsyncStorage whenever the task list updates
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch {
        Alert.alert('Error', 'Failed to save tasks');
      }
    };

    saveTasks();
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const addTask = (title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      done: false,
    };
    setTasks([newTask, ...tasks]);
  };

  const deleteTask = (id: string) => {
    Alert.alert('Delete task', 'Delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setTasks(tasks.filter((task) => task.id !== id));
        },
      },
    ]);
  };

  const editTask = (id: string, newTitle: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
  };

  const completedCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>My tasks</Text>
        <Text style={styles.counter}>
          Completed {completedCount} of {totalCount}
        </Text>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks yet</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <TouchableOpacity
                style={styles.taskInfo}
                onPress={() => toggleTask(item.id)}
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
                    navigation.navigate('EditTask', {
                      id: item.id,
                      title: item.title,
                      updateTask: editTask,
                    })
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
        onPress={() => navigation.navigate('AddTask', { addTask })}
      >
        <Text style={styles.buttonText}>Add task</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function AddScreen({ navigation, route }: { navigation: any; route: any }) {
  const { addTask } = route.params;
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    addTask(title.trim());
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>New task</Text>

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

function EditScreen({ navigation, route }: { navigation: any; route: any }) {
  const { id, title: initialTitle, updateTask } = route.params;
  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    updateTask(id, title.trim());
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

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddTask"
          component={AddScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditTask"
          component={EditScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  counter: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    paddingBottom: 16,
  },
  taskCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskInfo: {
    flex: 1,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  smallEditButton: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 6,
  },
  smallDeleteButton: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  smallButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  taskTitle: {
    fontSize: 16,
    color: '#333',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  doneText: {
    color: '#2e7d32',
  },
  pendingText: {
    color: '#c62828',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    marginTop: 6,
    marginLeft: 4,
  },
  primaryButton: {
    backgroundColor: '#1976d2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});