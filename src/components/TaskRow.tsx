import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function TaskRow({
  task,
  onToggle,
  onDelete,
  onEdit,
  onPressDetail,
}: {
  task: { id: string; title: string; done: boolean; note?: string };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: { id: string; title: string }) => void;
  onPressDetail: (id: string) => void;
}) {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.titleContainer} onPress={() => onPressDetail(task.id)}>
        <Text style={[styles.title, task.done && styles.doneTitle]}>{task.title}</Text>
        {task.note ? <Text style={styles.noteSnippet} numberOfLines={1}>Note: {task.note}</Text> : null}
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onToggle(task.id)} style={styles.actionButton}>
          <Text>{task.done ? '✅' : '⬜️'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onEdit(task)} style={styles.actionButton}>
          <Text>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.actionButton}>
          <Text>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
  },
  titleContainer: { flex: 1, marginRight: 8 },
  title: { fontSize: 16, color: '#333' },
  doneTitle: { textDecorationLine: 'line-through', color: '#888' },
  noteSnippet: { fontSize: 12, color: '#666', marginTop: 2 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  actionButton: { padding: 6, marginLeft: 4 },
});