import React, { useState, useEffect } from 'react';
import { FaRegPlayCircle } from "react-icons/fa";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Platform ,
  Alert
} from 'react-native';
import { Audio } from 'expo-av';
//this is more like we are exporting Audio from so that we can be able to have some asses

export default function AudioRecordingApp() {console.log('Requesting microphone permissions');

  const [recordings, setRecordings] = useState([]);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  // Request microphone permissions
  useEffect(() => {
    //async allows the code to excute at any momemnt you want
    (async () => {
      if (Platform.OS !== 'web') {
        //Problem makes sure that the application runs on specific  software and adding of OS willl allow the system to run on  the mobile ...but not on the web
        const { status } = await Audio.requestPermissionsAsync();
        //here we are requesting permisson for the audio to  record
        if (status !== 'granted') {
          alert('Sorry, we need microphone permissions to make this work!');
        }
      }
    })();
  }, []);
  //empty array means or shows that the code must runs once when the application firsr mount

 

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
      id: Date.now().toString(),66
      uri,
      timestamp: new Date(),
      duration: null,
      name:`Recording${recordings.length + 1}`
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

   //Deleting function

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
            setRecordings(prevRecordings => 
              prevRecordings.filter(recording => recording.id !== id)
            );
          },
        },
      ]
    );
  }
  // Render individual recording item
  const renderRecordingItem = ({ item, index }) => (
    <View style={styles.recordingItem}>
      <Text style={styles.recordingText}>
        Recording {index + 1} - {item.timestamp.toLocaleString()}
      </Text>
      <TouchableOpacity 
        style={styles.playButton} 
        onPress={() => playRecording(item.uri)}
      >
        <Text  className='text-center border border-green-400 
        p-3 rounded-full'>
          ▶️
        </Text>
      </TouchableOpacity>
      <TouchableOpacity  
      onPress={()=>deleteRecording(item.id)}
      
      >
        <Text 
        className='text-center border-red-500 border
        p-3 rounded-full'>🗑️</Text>
      </TouchableOpacity>
      <TouchableOpacity   >
        <Text 
        className='text-center border-orange-500 border
        p-3 rounded-full'>⏯️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Recorder😊</Text>
      
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
        data={recordings}
        renderItem={renderRecordingItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  recordButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  recordButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  recordingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  recordingText: {
    flex: 1,
    marginRight: 10,
  },

  playButtonText: {
    color: 'white',
  },
  deleteButton:{
    backgroundColor: 'red',
    padding:10,
    borderRadius:10
  }
});

