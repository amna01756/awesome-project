import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Screen } from '../ui/Screen';
import { AppText } from '../ui/AppText';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  city: string;
  about: string;
  skills: string[];
}

const INITIAL_PROFILE: ProfileData = {
  name: 'Amna Mushtaq',
  email: 'amna.mushtaq@example.com',
  phone: '+92 300 0000000',
  city: 'Lahore',
  about:
    'Building clean mobile screens and navigation flows with React Native.\nPracticing layouts, styling, and component structure every day.',
  skills: ['JavaScript', 'React Native', 'Git'],
};

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'AM';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function ProfileScreen({ navigation, route }: { navigation: any; route: any }) {
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);

  useEffect(() => {
    if (route?.params?.updatedProfile) {
      setProfile(route.params.updatedProfile);
    }
  }, [route?.params?.updatedProfile]);

  return (
    <Screen style={styles.screenOverride}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarCircle}>
            <AppText variant="title" style={styles.avatarText}>
              {getInitials(profile.name)}
            </AppText>
          </View>
          <View style={styles.headerTextGroup}>
            <AppText variant="title" style={styles.headerName}>
              {profile.name}
            </AppText>
            <AppText variant="caption" style={styles.headerRole}>
              Mobile intern
            </AppText>
          </View>
        </View>

        <View style={styles.bodyContent}>
          <Card style={styles.overlapCard}>
            <View style={styles.infoRow}>
              <AppText variant="caption" style={styles.infoLabel}>
                Email
              </AppText>
              <AppText variant="body" style={styles.infoValue}>
                {profile.email}
              </AppText>
            </View>

            <View style={styles.infoRow}>
              <AppText variant="caption" style={styles.infoLabel}>
                Phone
              </AppText>
              <AppText variant="body" style={styles.infoValue}>
                {profile.phone}
              </AppText>
            </View>

            <View style={[styles.infoRow, styles.lastInfoRow]}>
              <AppText variant="caption" style={styles.infoLabel}>
                City
              </AppText>
              <AppText variant="body" style={styles.infoValue}>
                {profile.city}
              </AppText>
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <AppText variant="body" style={styles.sectionTitle}>
              About
            </AppText>
            <AppText variant="body" style={styles.aboutText}>
              {profile.about}
            </AppText>
          </Card>

          <Card style={styles.sectionCard}>
            <AppText variant="body" style={styles.sectionTitle}>
              Skills
            </AppText>
            <View style={styles.pillsContainer}>
              {profile.skills.map((skill) => (
                <View key={skill} style={styles.skillPill}>
                  <AppText variant="caption" style={styles.skillPillText}>
                    {skill}
                  </AppText>
                </View>
              ))}
            </View>
          </Card>

          <View style={styles.actionsContainer}>
            <Button
              title="Edit profile"
              variant="primary"
              onPress={() => navigation.navigate('EditProfile', { profile })}
            />
            <Button
              title="Back"
              variant="secondary"
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenOverride: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  header: {
    height: 140,
    backgroundColor: '#1976d2',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#1976d2',
    fontSize: 20,
  },
  headerTextGroup: {
    flex: 1,
  },
  headerName: {
    color: '#ffffff',
  },
  headerRole: {
    color: '#e3f2fd',
    marginTop: 4,
  },
  bodyContent: {
    paddingHorizontal: 16,
  },
  overlapCard: {
    marginTop: -24,
  },
  sectionCard: {
    marginTop: 16,
  },
  infoRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  lastInfoRow: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  infoLabel: {
    color: '#6b7280',
  },
  infoValue: {
    color: '#111827',
    marginTop: 2,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 8,
  },
  aboutText: {
    lineHeight: 22,
    color: '#374151',
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillPill: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  skillPillText: {
    color: '#1f2937',
    fontWeight: '500',
  },
  actionsContainer: {
    marginTop: 16,
  },
  backButton: {
    marginTop: 16,
  },
});