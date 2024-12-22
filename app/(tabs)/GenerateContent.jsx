import React, { useState } from 'react';
import { Button, View, Text, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';

const GenerateContent = ({ imageUrl }) => {
  const [generatedContent, setGeneratedContent] = useState(""); // To store the response from backend

  // Convert image URI to Base64
 

  return (
    <View className="h-100">
      <TouchableOpacity className="flex items-center justify-center w-48 h-12 mt-3 rounded-sm bg-slate-400" onPress={sendToBackend}> <Text>Read with AI</Text> </TouchableOpacity>
      {generatedContent ? (
        <Text className="text-foreground" style={{ marginTop: 20 }}>{generatedContent}</Text>
      ) : (
        <Text style={{ marginTop: 20 }}>No content generated yet</Text>
      )}
    </View>
  );
};

export default GenerateContent;
