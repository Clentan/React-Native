import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ScrollView,
  Platform 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const BirthdayCardApp = () => {
  // Card content state
  const [cardText, setCardText] = useState('');
  
  // Text styling state
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState('black');
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontStyle, setFontStyle] = useState('normal');

  // Background state
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [backgroundImage, setBackgroundImage] = useState(null);

  // Color options
  const colorOptions = [
    'black', 'red', 'blue', 
    'green', 'white', 'yellow'
  ];

  // Font weight options
  const fontWeightOptions = ['normal', 'bold'];

  // Font style options
  const fontStyleOptions = ['normal', 'italic'];

  // Image upload handler
  const pickBackgroundImage = async () => {
    // Request permission to access media library
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Set background image if not cancelled
    if (!result.canceled) {
      setBackgroundImage(result.assets[0].uri);
      // Reset background color when image is selected
      setBackgroundColor('transparent');
    }
  };

  // Remove background image
  const removeBackgroundImage = () => {
    setBackgroundImage(null);
    setBackgroundColor('#ffffff');
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      className='bg-slate-400'
    >
      <Text style={styles.title}>Create Your Birthday Card</Text>
      
      {/* Card Text Input */}
      <TextInput
        style={styles.textInput}
        placeholder="Enter your birthday message"
        value={cardText}
        onChangeText={setCardText}
        multiline={true}
        numberOfLines={4}
      />

      {/* Text Styling Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Text Styling</Text>
        
        {/* Font Size */}
        <View style={styles.controlRow}>
          <Text>Font Size:</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={styles.sizeButton}
              onPress={() => setFontSize(Math.max(10, fontSize - 2))}
            >
              <Text>-</Text>
            </TouchableOpacity>
            <Text>{fontSize}</Text>
            <TouchableOpacity 
              style={styles.sizeButton}
              onPress={() => setFontSize(fontSize + 2)}
            >
              <Text>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Text Color */}
        <View style={styles.controlRow}>
          <Text>Text Color:</Text>
          <View style={styles.colorContainer}>
            {colorOptions.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorButton, 
                  { backgroundColor: color },
                  textColor === color && styles.selectedColor
                ]}
                onPress={() => setTextColor(color)}
              />
            ))}
          </View>
        </View>

        {/* Font Weight */}
        <View style={styles.controlRow}>
          <Text>Font Weight:</Text>
          <View style={styles.buttonGroup}>
            {fontWeightOptions.map((weight) => (
              <TouchableOpacity
                key={weight}
                style={[
                  styles.optionButton,
                  fontWeight === weight && styles.selectedOption
                ]}
                onPress={() => setFontWeight(weight)}
              >
                <Text>{weight}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Font Style */}
        <View style={styles.controlRow}>
          <Text>Font Style:</Text>
          <View style={styles.buttonGroup}>
            {fontStyleOptions.map((style) => (
              <TouchableOpacity
                key={style}
                style={[
                  styles.optionButton,
                  fontStyle === style && styles.selectedOption
                ]}
                onPress={() => setFontStyle(style)}
              >
                <Text>{style}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Background Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Background</Text>
        
        {/* Background Color */}
        <View style={styles.controlRow}>
          <Text>Background Color:</Text>
          <View style={styles.colorContainer}>
            {colorOptions.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorButton, 
                  { backgroundColor: color },
                  backgroundColor === color && styles.selectedColor
                ]}
                onPress={() => {
                  setBackgroundColor(color);
                  setBackgroundImage(null);
                }}
              />
            ))}
          </View>
        </View>

        {/* Image Upload */}
        <View style={styles.controlRow}>
          <Text>Background Image:</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={pickBackgroundImage}
            >
              <Text>Select Image</Text>
            </TouchableOpacity>
            {backgroundImage && (
              <TouchableOpacity 
                style={styles.optionButton}
                onPress={removeBackgroundImage}
              >
                <Text>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Card Preview */}
      <View 
        style={[
          styles.cardPreview,
          { 
            backgroundColor: backgroundImage ? 'transparent' : backgroundColor 
          }
        ]}
      >
        {backgroundImage && (
          <Image
            source={{ uri: backgroundImage }}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
        )}
        <View style={styles.cardTextContainer}>
          <Text 
            style={[
              styles.cardText,
              {
                fontSize,
                color: textColor,
                fontWeight,
                fontStyle,
              }
            ]}
          >
            {cardText || "Your Birthday Message"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    minHeight: 100,
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sizeButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  optionButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
  },
  colorContainer: {
    flexDirection: 'row',
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: 'white',
  },
  cardPreview: {
    marginVertical: 20,
    borderRadius: 10,
    overflow: 'hidden',
    minHeight: 300,
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  cardText: {
    textAlign: 'center',
  },
});

export default BirthdayCardApp;