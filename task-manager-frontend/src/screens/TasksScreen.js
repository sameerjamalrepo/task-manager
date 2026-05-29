import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTask, deleteTask } from '../redux/slices/tasksSlice';

const TasksScreen = ({ route, navigation }) => {
  const { projectId, projectTitle } = route.params;
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { items: tasks, loading } = useSelector((state) => state.tasks);
  const [refreshing, setRefreshing] = React.useState(false);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({ title: projectTitle });
      if (token) {
        dispatch(fetchTasks({ projectId, token }));
      }
    }, [token, dispatch, projectId, projectTitle, navigation])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (token) {
      await dispatch(fetchTasks({ projectId, token }));
    }
    setRefreshing(false);
  }, [token, dispatch, projectId]);

  const handleToggleTask = (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    dispatch(updateTask({ id: task.id, data: { status: newStatus }, token }));
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask({ id, token }));
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <TouchableOpacity
        style={styles.checkBox}
        onPress={() => handleToggleTask(item)}
      >
        {item.status === 'completed' && <Text style={styles.checkMark}>✓</Text>}
      </TouchableOpacity>
      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskTitle,
            item.status === 'completed' && styles.completedText,
          ]}
        >
          {item.title}
        </Text>
        {item.due_date && (
          <Text style={styles.dueDate}>
            Due: {new Date(item.due_date).toLocaleDateString()}
          </Text>
        )}
        <Text style={styles.status}>{item.status}</Text>
      </View>
      <TouchableOpacity
        onPress={(event) => {
          event.stopPropagation?.();
          handleDeleteTask(item.id);
        }}
        style={styles.deleteIcon}
      >
        <Text style={styles.deleteButton}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateTask', { projectId })}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {loading && tasks.length === 0 ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : tasks.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No tasks yet</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateTask', { projectId })}
          >
            <Text style={styles.createButtonText}>Create First Task</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  checkBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkMark: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  dueDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  status: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  deleteIcon: {
    marginLeft: 8,
  },
  deleteButton: {
    fontSize: 20,
    color: '#ff3b30',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TasksScreen;
