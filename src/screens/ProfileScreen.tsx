import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Screen } from '../ui/Screen';
import { Card } from '../ui/Card';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';

export interface ProfileData {
  name: string;
  role: string;
  email: string;
  phone: string;
  city: string;
  about: string;
  skills: string[];
}

const INITIAL_PROFILE: ProfileData = {
  name: 'Amna Mushtaq',
  role: 'App Developer Intern & Data Science Grad Student',
  email: 'amna@example.com',
  phone: '+92 300 0000000',
  city: 'Lahore',
  about:
    'Building clean React Native interfaces and exploring data science and machine learning workflows.',
  skills: ['React Native', 'TypeScript', 'JavaScript', 'Python', 'Git'],
};

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return 'AM';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function ProfileScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);

  useEffect(() => {
    if (route?.params?.updatedProfile) {
      setProfile(route.params.updatedProfile);
    }
  }, [route?.params?.updatedProfile]);

  return (
    <Screen style={styles.screenOverride}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatarCircle}>
            <AppText variant="title" style={styles.avatarText}>
              {getInitials(profile.name)}
            </AppText>
          </View>
          <View style={styles.headerInfo}>
            <AppText variant="title" style={styles.headerName}>
              {profile.name}
            </AppText>
            <AppText variant="caption" style={styles.headerRole}>
              {profile.role}
            </AppText>
          </View>
        </View>

        <Card style={styles.overlapCard}>
          <View style={styles.infoRow}>
            <AppText variant="caption" style={styles.label}>
              Email
            </AppText>
            <AppText variant="body">{profile.email}</AppText>
          </View>
          <View style={styles.infoRow}>
            <AppText variant="caption" style={styles.label}>
              Phone
            </AppText>
            <AppText variant="body">{profile.phone}</AppText>
          </View>
          <View style={styles.infoRowLast}>
            <AppText variant="caption" style={styles.label}>
              City
            </AppText>
            <AppText variant="body">{profile.city}</AppText>
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
          <View style={styles.skillsContainer}>
            {profile.skills.map((skill) => (
              <View key={skill} style={styles.skillPill}>
                <AppText variant="caption" style={styles.skillText}>
                  {skill}
                </AppText>
              </View>
            ))}
          </View>
        </Card>

        <View style={styles.buttonGroup}>
          <Button
            title="Edit profile"
            variant="primary"
            onPress={() => navigation.navigate('EditProfile', { profile })}
          />
          <Button
            title="Settings"
            variant="secondary"
            onPress={() => navigation.navigate('Settings')}
            style={styles.settingsButton}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenOverride: {
    padding: 0,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#1976d2',
    height: 140,
    paddingHorizontal: 16,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#1976d2',
    fontSize: 22,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    color: '#ffffff',
    fontSize: 20,
  },
  headerRole: {
    color: '#dbeafe',
    marginTop: 2,
  },
  overlapCard: {
    marginHorizontal: 16,
    marginTop: -24,
  },
  infoRow: {
    marginBottom: 10,
  },
  infoRowLast: {
    marginBottom: 0,
  },
  label: {
    marginBottom: 2,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  aboutText: {
    lineHeight: 22,
    color: '#374151',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillPill: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    color: '#1976d2',
    fontWeight: '600',
  },
  buttonGroup: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  settingsButton: {
    marginTop: 16,
  },
});