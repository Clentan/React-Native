import React, { useState, useEffect } from 'react';
import { FaRegPlayCircle } from "react-icons/fa";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Platform,
  Alert,
  TextInput
} from 'react-native';
import { Audio } from 'expo-av';

export default function AudioRecordingApp() {
  const [recordings, setRecordings] = useState([]);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecordings, setFilteredRecordings] = useState([]);

  // Request microphone permissions
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need microphone permissions to make this work!');
        }
      }
    })();
  }, []);

  // Search function
  function searchRecordings(query) {
    setSearchQuery(query);
    
    if (!query) {
      // If query is empty, show all recordings
      setFilteredRecordings(recordings);
      return;
    }

    // Filter recordings based on name or timestamp
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
  }

  // Update filtered recordings whenever recordings change
  useEffect(() => {
    setFilteredRecordings(recordings);
  }, [recordings]);

  // Start recording
  async function startRecording() {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
      }

      // Set audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create a new recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Recording error','Failed to start recording');
    }
  }

  // Stop recording
  async function stopRecording() {
    if (!recording) return;

    setIsRecording(false);
    await recording.stopAndUnloadAsync();

    // Get the URI of the recorded audio
    const uri = recording.getURI();
    
    // Create a new recording object with additional metadata
    const newRecording = {
      id: Date.now().toString(),
      uri,
      timestamp: new Date(),
      duration: null,
      name: `Recording ${recordings.length + 1}`
    };

    // Get duration of the recording
    const soundObject = new Audio.Sound();
    await soundObject.loadAsync({ uri });
    const status = await soundObject.getStatusAsync();
    newRecording.duration = status.durationMillis;

    // Add to recordings list
    setRecordings(prevRecordings => [...prevRecordings, newRecording]);

    // Reset recording state
    setRecording(null);
  }

  // Play a recording
  async function playRecording(uri) {
    try {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync({ uri });
      await soundObject.playAsync();
    } catch (err) {
      console.error('Failed to play recording', err);
    }
  }

  // Deleting function
  function deleteRecording(id) {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Remove the recording from the list
            const updatedRecordings = recordings.filter(recording => recording.id !== id);
            setRecordings(updatedRecordings);
            
            // Update filtered recordings as well
            const updatedFilteredRecordings = filteredRecordings.filter(recording => recording.id !== id);
            setFilteredRecordings(updatedFilteredRecordings);
          },
        },
      ]
    );
  }

  // Render individual recording item
  const renderRecordingItem = ({ item, index }) => (
    <View style={styles.recordingItem}>
      <Text style={styles.recordingText}>
        {item.name} - {item.timestamp.toLocaleString()}
      </Text>
      <TouchableOpacity 
        style={styles.playButton} 
        onPress={() => playRecording(item.uri)}
      >
        <Text className='text-center border border-green-400 p-3 rounded-full'>
          ▶️
        </Text>
      </TouchableOpacity>
      <TouchableOpacity  
        onPress={() => deleteRecording(item.id)}
      >
        <Text 
          className='text-center border-red-500 border p-3 rounded-full'>
          🗑️
        </Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text 
          className='text-center border-orange-500 border p-3 rounded-full'>
          ⏯️
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Recorder😊</Text>
      
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search recordings..."
        value={searchQuery}
        onChangeText={searchRecordings}
      />
      
      {/* Recording Control */}
      <TouchableOpacity 
        style={[
          styles.recordButton, 
          { backgroundColor: isRecording ? 'red' : 'green' }
        ]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.recordButtonText}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>

      {/* Recordings List */}
      <FlatList
        className='flex-1'
        data={filteredRecordings}
        renderItem={renderRecordingItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            {recordings.length === 0 
              ? 'No recordings yet' 
              : 'No recordings match your search'}
          </Text>
        }
      />
    </View>
  );
}

// Styles (you may want to define these in a separate styles file)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  recordButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  recordButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  recordingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  recordingText: {
    flex: 1,
    marginRight: 10,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: 'gray',
  },
});