import React, { useState } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Screen } from '../ui/Screen';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { ProfileData } from './ProfileScreen';

export function EditProfileScreen({ navigation, route }: { navigation: any; route: any }) {
  const existingProfile: ProfileData = route?.params?.profile;

  const [name, setName] = useState<string>(existingProfile?.name ?? '');
  const [email, setEmail] = useState<string>(existingProfile?.email ?? '');
  const [phone, setPhone] = useState<string>(existingProfile?.phone ?? '');
  const [city, setCity] = useState<string>(existingProfile?.city ?? '');
  const [about, setAbout] = useState<string>(existingProfile?.about ?? '');

  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');

  const handleSave = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    let isValid = true;

    if (!trimmedName) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!trimmedEmail) {
      setEmailError('Email is required');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!isValid) {
      return;
    }

    const updatedProfile: ProfileData = {
      ...existingProfile,
      name: trimmedName,
      email: trimmedEmail,
      phone: phone.trim(),
      city: city.trim(),
      about: about.trim(),
    };

    navigation.navigate('Profile', { updatedProfile });
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AppText variant="title" style={styles.screenTitle}>
            Edit profile
          </AppText>

          <View style={styles.fieldGroup}>
            <AppText variant="caption" style={styles.label}>
              Name
            </AppText>
            <TextInput
              style={[styles.input, nameError ? styles.inputError : null]}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (nameError) setNameError('');
              }}
              placeholder="Enter name"
              placeholderTextColor="#9ca3af"
            />
            {nameError ? (
              <AppText variant="caption" style={styles.errorText}>
                {nameError}
              </AppText>
            ) : null}
          </View>

          <View style={styles.fieldGroup}>
            <AppText variant="caption" style={styles.label}>
              Email
            </AppText>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              placeholder="Enter email"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError ? (
              <AppText variant="caption" style={styles.errorText}>
                {emailError}
              </AppText>
            ) : null}
          </View>

          <View style={styles.fieldGroup}>
            <AppText variant="caption" style={styles.label}>
              Phone
            </AppText>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.fieldGroup}>
            <AppText variant="caption" style={styles.label}>
              City
            </AppText>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Enter city"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.fieldGroup}>
            <AppText variant="caption" style={styles.label}>
              About
            </AppText>
            <TextInput
              style={[styles.input, styles.aboutInput]}
              value={about}
              onChangeText={setAbout}
              placeholder="Tell something about yourself"
              placeholderTextColor="#9ca3af"
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.actions}>
            <Button title="Save" variant="primary" onPress={handleSave} />
            <Button
              title="Cancel"
              variant="secondary"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  screenTitle: {
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#111827',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  aboutInput: {
    height: 100,
    paddingTop: 12,
  },
  errorText: {
    color: '#dc2626',
    marginTop: 4,
  },
  actions: {
    marginTop: 8,
  },
  cancelButton: {
    marginTop: 16,
  },
});