import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Alert 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';


const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phoneNumber: '',
    sex: '',
    address: '',
    image: null
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData(prev => ({
        ...prev,
        image: result.assets[0].uri
      }));
    }
  };

  const handleSaveProfile = () => {
    // Basic validation
    if (!formData.name || !formData.age || !formData.phoneNumber) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    setProfile(formData);
    setIsEditing(false);
  };

  const handleDeleteProfile = () => {
    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete your profile?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setProfile(null);
            setIsEditing(true);
            setFormData({
              name: '',
              age: '',
              phoneNumber: '',
              sex: '',
              address: '',
              image: null
            });
          },
        },
      ]
    );
  };

  const renderProfileForm = () => (
    <View className="p-4 bg-slate-400 ">
      <Text className="text-2xl font-bold text-center mb-6">Create Profile</Text>
      
      {formData.image ? (
        <TouchableOpacity onPress={pickImage}>
          <Image 
            source={{ uri: formData.image }} 
            className="w-32 h-32 rounded-full self-center mb-4"
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          onPress={pickImage} 
          className="w-32 h-32 bg-white rounded-full self-center mb-4 items-center justify-center"
        >
          <Text className="text-gray-500">Add Photo</Text>
        </TouchableOpacity>
      )}

      <TextInput
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => setFormData(prev => ({...prev, name: text}))}
        className="border border-gray-300 p-2 rounded mb-4"
      />
      <TextInput
        placeholder="Age"
        value={formData.age}
        onChangeText={(text) => setFormData(prev => ({...prev, age: text}))}
        keyboardType="numeric"
        className="border border-gray-300 p-2 rounded mb-4"
      />
      <TextInput
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChangeText={(text) => setFormData(prev => ({...prev, phoneNumber: text}))}
        keyboardType="phone-pad"
        className="border border-gray-300 p-2 rounded mb-4"
      />
      <TextInput
        placeholder="Sex"
        value={formData.sex}
        onChangeText={(text) => setFormData(prev => ({...prev, sex: text}))}
        className="border border-gray-300 p-2 rounded mb-4"
      />
      <TextInput
        placeholder="Address"
        value={formData.address}
        onChangeText={(text) => setFormData(prev => ({...prev, address: text}))}
        className="border border-gray-300 p-2 rounded mb-4"
      />

      <TouchableOpacity 
        onPress={handleSaveProfile}
        className="bg-blue-500 p-3 rounded"
      >
        <Text className="text-white text-center font-bold">Save Profile</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProfile = () => (
    <View className="p-4">
      <Text className="text-2xl font-bold text-center mb-6">Your Profile</Text>
      
      {profile.image && (
        <Image 
          source={{ uri: profile.image }} 
          className="w-32 h-32 rounded-full self-center mb-4"
        />
      )}
      
      <View className="bg-gray-100 p-4 rounded">
        <Text className="text-lg font-semibold">Name: {profile.name}</Text>
        <Text className="text-lg">Age: {profile.age}</Text>
        <Text className="text-lg">Phone: {profile.phoneNumber}</Text>
        <Text className="text-lg">Sex: {profile.sex}</Text>
        <Text className="text-lg">Address: {profile.address}</Text>
      </View>

      <View className="flex-row justify-between mt-4">
        <TouchableOpacity 
          onPress={() => setIsEditing(true)}
          className="bg-blue-500 p-3 rounded w-[45%]"
        >
          <Text className="text-white text-center font-bold">Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleDeleteProfile}
          className="bg-red-500 p-3 rounded w-[45%]"
        >
          <Text className="text-white text-center font-bold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white">
      {profile && !isEditing ? renderProfile() : renderProfileForm()}
    </ScrollView>
  );
};

export default ProfilePage;