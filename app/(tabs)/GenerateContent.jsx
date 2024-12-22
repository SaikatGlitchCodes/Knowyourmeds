import React, { useState } from 'react';
import { Button, View, Text, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';

const GenerateContent = ({ imageUrl }) => {
  const [generatedContent, setGeneratedContent] = useState(""); // To store the response from backend

  // Convert image URI to Base64
  const getImageBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result.split(',')[1]); // Get the base64 part of the result
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Send image data to backend for content generation
  const sendToBackend = async () => {
    try {
      const base64Image = await getImageBase64(imageUrl);
      
      const response = await axios.post('http://192.168.6.99:3000/generate', {
        imageBase64: base64Image,
      });
      
      console.log('Response:', response.data);
      setGeneratedContent(response.data.response); // Assuming the response has a "response" field
    } catch (error) {
      console.error("Error processing content generation:", error);
      alert('Error generating content.');
    }
  };

  return (
    <View className="h-100">
      <TouchableOpacity className="items-center justify-center flex h-12 w-48 bg-slate-400 mt-3 rounded-sm" onPress={sendToBackend}> <Text>Read with AI</Text> </TouchableOpacity>
      {generatedContent ? (
        <Text className="text-foreground" style={{ marginTop: 20 }}>{generatedContent}</Text>
      ) : (
        <Text style={{ marginTop: 20 }}>No content generated yet</Text>
      )}
    </View>
  );
};

export default GenerateContent;
