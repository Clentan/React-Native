import React, { useState } from 'react'
import { Text, Pressable, Alert, KeyboardAvoidingView, Platform, View, TouchableOpacity, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Registration = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  function HandleSubmit() {
    const FormObject = {
      username, email, password, confirmPassword, form: 'true'
    }
    console.log(FormObject)

    // Validation checks
    if (password !== confirmPassword) {
      Alert.alert("Oops!", "Passwords do not match")
      return
    }

    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all the inputs")
      return
    }

    if (password.length >= 14) {
      Alert.alert("Error", "Password must be less than 14 characters")
      return
    }

    if (username === password) {
      Alert.alert("Error", "Password must not be the same as username")
      return
    }

    // Reset form
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setUsername("")
  }

  return (
    <SafeAreaView className='flex-1 bg-slate-400'>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className='flex-1'
      >
        <View className='flex-1 px-6 justify-center'>
          <Text className='text-center text-4xl font-bold text-gray-800 mb-8'>
            Create an Account
          </Text>

          <View className='mb-4'>
            <TextInput
              className='border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-900'
              placeholder='Enter Username'
              placeholderTextColor='#6b7280'
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View className='mb-4'>
            <TextInput
              className='border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-900'
              placeholder='Enter Email'
              placeholderTextColor='#6b7280'
              keyboardType='email-address'
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className='mb-4'>
            <TextInput
              className='border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-900'
              placeholder='Enter Password'
              placeholderTextColor='#6b7280'
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View className='mb-6'>
            <TextInput
              className='border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-900'
              placeholder='Confirm Password'
              placeholderTextColor='#6b7280'
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity 
            className='bg-indigo-600 rounded-lg py-3 items-center'
            onPress={HandleSubmit}
          >
            <Text className='text-white text-lg font-bold'>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Registration