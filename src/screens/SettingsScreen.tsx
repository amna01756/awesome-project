import React, { useState, useEffect } from 'react';
import { View, Switch, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen } from '../ui/Screen';
import { Card } from '../ui/Card';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';

const STORAGE_KEY = '@app_settings_v1';

interface SettingsState {
  pushNotifications: boolean;
  emailUpdates: boolean;
  darkMode: boolean;
  savePhotos: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  pushNotifications: false,
  emailUpdates: false,
  darkMode: false,
  savePhotos: false,
};

const SETTING_OPTIONS: { key: keyof SettingsState; label: string }[] = [
  { key: 'pushNotifications', label: 'Push notifications' },
  { key: 'emailUpdates', label: 'Email updates' },
  { key: 'darkMode', label: 'Dark mode' },
  { key: 'savePhotos', label: 'Save photos' },
];

export function SettingsScreen({ navigation }: { navigation: any }) {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };
    loadSettings();
  }, []);

  const toggleSetting = (key: keyof SettingsState) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save settings', error);
    }
  };

  const enabledLabels = SETTING_OPTIONS.filter((item) => settings[item.key]).map(
    (item) => item.label
  );

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="title" style={styles.title}>
          Settings
        </AppText>

        <Card>
          {SETTING_OPTIONS.map((item, index) => {
            const isLast = index === SETTING_OPTIONS.length - 1;
            return (
              <View
                key={item.key}
                style={[styles.row, !isLast && styles.rowBorder]}
              >
                <AppText variant="body">{item.label}</AppText>
                <Switch
                  value={settings[item.key]}
                  onValueChange={() => toggleSetting(item.key)}
                  trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                  thumbColor={settings[item.key] ? '#1976d2' : '#f9fafb'}
                />
              </View>
            );
          })}
        </Card>

        <Card style={styles.summaryCard}>
          <AppText variant="body" style={styles.summaryTitle}>
            Summary
          </AppText>
          <AppText variant="body" style={styles.summaryText}>
            {enabledLabels.length > 0
              ? enabledLabels.join(', ')
              : 'Nothing is enabled'}
          </AppText>
        </Card>

        <View style={styles.actions}>
          <Button title="Save" variant="primary" onPress={handleSave} />
          <Button
            title="Back"
            variant="secondary"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 16,
  },
  title: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  summaryCard: {
    marginTop: 16,
  },
  summaryTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryText: {
    color: '#374151',
    lineHeight: 22,
  },
  actions: {
    marginTop: 16,
  },
  backButton: {
    marginTop: 16,
  },
});