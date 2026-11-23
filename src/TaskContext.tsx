import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';   

const STORAGE_KEY = '@task_list_key';

interface Task {
  id: string;
  title: string;
  done: boolean;
  note?: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, newTitle: string) => void;
  updateNote: (id: string, newNote: string) => void;
}
const TaskContext = createContext<TaskContextType | undefined>(undefined);

const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Buy milk', done: true },
    { id: '2', title: 'Read docs', done: false },
    { id: '3', title: 'Call mentor', done: false },
  ]);

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

  const addTask = (title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      done: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    Alert.alert('Delete task', 'Delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setTasks((prev) => prev.filter((task) => task.id !== id));
        },
      },
    ]);
  };

  const editTask = (id: string, newTitle: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
  };

  const updateNote = (id: string, newNote: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, note: newNote } : task
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, toggleTask, deleteTask, editTask, updateNote }}
    >
      {children}
    </TaskContext.Provider>
  );
}

type FilterType = 'All' | 'Pending' | 'Done';
const useFilteredTasks = (filter: FilterType, searchQuery: string) => {
  const { tasks } = useTasks();

  return tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase().trim());

    if (filter === 'Pending') {
      return matchesSearch && !task.done;
    }
    if (filter === 'Done') {
      return matchesSearch && task.done;
    }
    return matchesSearch;
  });
};

export { TaskProvider, useTasks, useFilteredTasks };

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  formContainer: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});