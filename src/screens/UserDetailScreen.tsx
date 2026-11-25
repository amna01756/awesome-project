import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
  SafeAreaView,
} from 'react-native';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
  address: {
    city: string;
  };
}

interface Post {
  id: number;
  title: string;
  body: string;
}

export function UserDetailScreen({ route }: { route: any; navigation?: any }) {
  const { userId } = route.params;

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [postsLoading, setPostsLoading] = useState<boolean>(true);
  
  const [userError, setUserError] = useState<boolean>(false);
  const [postsError, setPostsError] = useState<boolean>(false);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchUserDetails = useCallback(async () => {
    try {
      setUserError(false);
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      setUser(data);
    } catch {
      setUserError(true);
    } finally {
      setUserLoading(false);
    }
  }, [userId]);

  const fetchUserPosts = useCallback(async () => {
    try {
      setPostsError(false);
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
    } catch {
      setPostsError(true);
    } finally {
      setPostsLoading(false);
    }
  }, [userId]);

  const loadAllData = async () => {
    setRefreshing(true);
    await Promise.all([fetchUserDetails(), fetchUserPosts()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUserDetails();
    fetchUserPosts();
  }, [fetchUserDetails, fetchUserPosts]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (userLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Loading user...</Text>
      </SafeAreaView>
    );
  }

  if (userError) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>Could not load user</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserDetails}>
          <Text style={styles.retryButtonText}>Try again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* User Details Card */}
      {user && (
        <View style={styles.card}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.detailText}>@{user.username}</Text>
          <Text style={styles.detailText}>Email: {user.email}</Text>
          <Text style={styles.detailText}>Phone: {user.phone}</Text>
          <Text style={styles.detailText}>Website: {user.website}</Text>
          <Text style={styles.detailText}>Company: {user.company?.name}</Text>
          <Text style={styles.detailText}>City: {user.address?.city}</Text>
        </View>
      )}

      {/* Posts Section Header & Search */}
      <View style={styles.postsHeaderRow}>
        <Text style={styles.sectionTitle}>Posts {posts.length}</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search posts"
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Posts Loading State */}
      {postsLoading && !refreshing && (
        <View style={styles.inlineLoader}>
          <ActivityIndicator size="small" color="#1976d2" />
          <Text style={styles.loadingText}>Loading posts...</Text>
        </View>
      )}

      {/* Posts Error State */}
      {postsError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTextSmall}>Could not load posts</Text>
          <TouchableOpacity style={styles.retryButtonSmall} onPress={fetchUserPosts}>
            <Text style={styles.retryButtonText}>Try again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={postsError || postsLoading ? [] : filteredPosts}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <Text style={styles.postTitle}>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={() => {
          if (postsLoading || postsError) {
            return null;
          }

          return (
            <Text style={styles.emptyText}>
              {posts.length === 0 ? 'No posts.' : 'No posts found.'}
            </Text>
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadAllData} colors={['#1976d2']} />
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
container: { flex: 1,
backgroundColor: '#f5f5f5' 
},
centerContainer: { flex: 1,
justifyContent: 'center', 
alignItems: 'center', 
backgroundColor: '#f5f5f5', 
padding: 16 },
  listContent: { padding: 16 },
  headerContainer: { marginBottom: 8 },
  card: { backgroundColor: '#ffffff', padding: 16, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  detailText: { fontSize: 14, color: '#555', marginTop: 3 },
  postsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  searchBar: { backgroundColor: '#ffffff', padding: 12, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#ddd', marginBottom: 16 },
  postCard: { backgroundColor: '#ffffff', padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#e0e0e0' },
  postTitle: { fontSize: 15, color: '#333', fontWeight: '500' },
  loadingText: { marginTop: 8, fontSize: 14, color: '#555', textAlign: 'center' },
  inlineLoader: { paddingVertical: 20, alignItems: 'center' },
  errorContainer: { padding: 16, alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ffcdd2', marginBottom: 16 },
  errorText: { fontSize: 18, fontWeight: 'bold', color: '#c62828', marginBottom: 12 },
  errorTextSmall: { fontSize: 14, fontWeight: 'bold', color: '#c62828', marginBottom: 8 },
  retryButton: { backgroundColor: '#1976d2', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  retryButtonSmall: { backgroundColor: '#1976d2', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  retryButtonText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 15, color: '#888' },
});