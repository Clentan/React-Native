import React, { useState, useEffect,useContext } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Platform,
  Alert,
  TextInput,
  Modal,
  SafeAreaView
} from 'react-native';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import { MessageContext, SignContext } from './Context';
import Navbar from './Navbar'

export default function AudioRecordingApp() {
  const [recordings, setRecordings] = useState([]);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecordings, setFilteredRecordings] = useState([]);
  const [supportModalVisible, setSupportModalVisible] = useState(false);

  const { message } = useContext(MessageContext)

  // Request microphone permissions
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Please grant microphone permissions to use the recorder.');
        }
      }
    })();
  }, []);

  // Search function
  const searchRecordings = (query) => {
    setSearchQuery(query);
    
    if (!query) {
      setFilteredRecordings(recordings);
      return;
    }

    const filtered = recordings.filter(recording => {
      const lowercaseQuery = query.toLowerCase();
      const recordingName = recording.name.toLowerCase();
      const formattedTimestamp = recording.timestamp.toLocaleString().toLowerCase();
      
      return (
        recordingName.includes(lowercaseQuery) || 
        formattedTimestamp.includes(lowercaseQuery)
      );
    });

    setFilteredRecordings(filtered);
  };

  useEffect(() => {
    setFilteredRecordings(recordings);
  }, [recordings]);

  const startRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    
    const newRecording = {
      id: Date.now().toString(),
      uri,
      timestamp: new Date(),
      duration: null,
      name: `Recording ${recordings.length + 1}`
    };

    const soundObject = new Audio.Sound();
    await soundObject.loadAsync({ uri });
    const status = await soundObject.getStatusAsync();
    newRecording.duration = status.durationMillis;

    setRecordings(prevRecordings => [...prevRecordings, newRecording]);
    setRecording(null);
  };

  const playRecording = async (uri) => {
    try {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync({ uri });
      await soundObject.playAsync();
    } catch (err) {
      Alert.alert('Error', 'Failed to play recording');
    }
  };

  const deleteRecording = (id) => {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setRecordings(prev => prev.filter(recording => recording.id !== id));
            setFilteredRecordings(prev => prev.filter(recording => recording.id !== id));
          },
        },
      ]
    );
  };

  const SupportModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={supportModalVisible}
      onRequestClose={() => setSupportModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Need Help?</Text>
          <Text style={styles.modalText}>
            Contact support at support@audioapp.com
          </Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setSupportModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderRecordingItem = ({ item }) => (
    <View style={styles.recordingItem}>
      <View style={styles.recordingInfo}>
        <Text style={styles.recordingName}>{item.name}</Text>
        <Text style={styles.recordingTimestamp}>
          {item.timestamp.toLocaleString()}
        </Text>
      </View>
      <View style={styles.recordingControls}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => playRecording(item.uri)}
        >
          <MaterialIcons name="play-circle-outline" size={24} color="green" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => deleteRecording(item.id)}
        >
          <MaterialIcons name="delete-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Navbar/>
      <Text style={styles.title}>Voice Recorder 🎙️</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search recordings..."
        value={searchQuery}
        onChangeText={searchRecordings}
        placeholderTextColor="#666"
      />
      
      <TouchableOpacity 
        style={[styles.recordButton, isRecording && styles.recordingActive]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.recordButtonText}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>

      <FlatList
        style={styles.list}
        data={filteredRecordings}
        renderItem={renderRecordingItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            {recordings.length === 0 
              ? 'No recordings yet' 
              : 'No recordings match your search'}
          </Text>
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => Alert.alert('Feedback', 'Thank you for your feedback!')}
        >
          <Text style={styles.footerButtonText}>Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => setSupportModalVisible(true)}
        >
          <MaterialIcons name="support-agent" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <SupportModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recordButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recordingActive: {
    backgroundColor: '#f44336',
  },
  recordButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  recordingItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recordingInfo: {
    flex: 1,
  },
  recordingName: {
    fontSize: 16,
    fontWeight: '500',
  },
  recordingTimestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
    marginLeft: 10,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerButton: {
    padding: 10,
  },
  footerButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});