import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function UpgradeToHost() {
  const router = useRouter();
  const [agreed, setAgreed] = React.useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.header}>Become a Host</Text>
      </TouchableOpacity>

      <Text style={styles.subheader}>Share your experiences with others</Text>
      <Text style={styles.description}>
        Join our community of hosts and share your unique skills and experiences with people around the world.
      </Text>

      <Text style={styles.sectionHeader}>Basic Information</Text>
      <TouchableOpacity style={styles.uploadPhoto}>
        <Ionicons name="person-circle-outline" size={40} color="gray" />
        <Text>Upload Photo</Text>
      </TouchableOpacity>
      <TextInput style={styles.input} placeholder="Your full name" />
      <TextInput style={styles.input} placeholder="your@email.com" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="+1 (555) 000-0000" keyboardType="phone-pad" />

      <Text style={styles.sectionHeader}>Experience Details</Text>
      <TextInput style={styles.input} placeholder="e.g. Tokyo Street Photography Tour" />
      <TextInput style={styles.input} placeholder="Category" />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Describe your experience in detail..."
        multiline
      />
      <TextInput style={styles.input} placeholder="Duration (hours)" keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Price per person (USD)" keyboardType="numeric" />

      <Text style={styles.sectionHeader}>Skills & Languages</Text>
      <TextInput style={styles.input} placeholder="Skills (e.g. Photography, Cooking)" />
      <TextInput style={styles.input} placeholder="Languages Spoken" />

      <Text style={styles.sectionHeader}>Verification</Text>
      <Text style={styles.verificationItem}>• Government ID</Text>
      <Text style={styles.verificationItem}>• Proof of Address</Text>
      <Text style={styles.verificationItem}>• Professional Certifications (if applicable)</Text>
      <TouchableOpacity style={styles.uploadDocuments}>
        <Text style={styles.uploadText}>Upload Documents</Text>
      </TouchableOpacity>

      <View style={styles.agreementRow}>
        <Switch value={agreed} onValueChange={setAgreed} />
        <Text style={styles.agreementText}>
          I agree to Ohana's Terms of Service, Community Guidelines, and Privacy Policy
        </Text>
      </View>

      <TouchableOpacity style={styles.submitButton} disabled={!agreed}>
        <Text style={styles.submitText}>Submit Application</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  subheader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  uploadPhoto: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
  },
  verificationItem: {
    fontSize: 14,
    marginBottom: 4,
  },
  uploadDocuments: {
    marginTop: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  agreementText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#555',
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});