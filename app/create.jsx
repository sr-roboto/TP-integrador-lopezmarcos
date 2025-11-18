import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useNotes } from '../hooks/useNotes';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CreateNoteScreen() {
  const { createNote } = useNotes();

  const cameraRef = useRef(null);
  const [facing, setFacing] = useState('back');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();

  const handleCapturePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      setImageUri(photo.uri);
      setIsCameraActive(false);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !imageUri) {
      alert("Debes ingresar título, descripción y una foto.");
      return;
    }

    await createNote({ title: title.trim(), description: description.trim(), imageUri });
    router.replace('/');
  };

  // --- Pantalla de cámara ---
  if (isCameraActive) {
    if (!permission) return <View />;
    if (!permission.granted) {
      return (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="mb-4 text-center">Necesitamos permiso para usar la cámara.</Text>
          <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-lg" onPress={requestPermission}>
            <Text className="text-white font-semibold">Dar Permiso</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View className="flex-1 relative">
        <CameraView ref={cameraRef} facing={facing} style={{ flex: 1 }} />

        {/* Botones cámara */}
        <View className="absolute w-full flex-row justify-center items-center" style={{ bottom: 60 }}>
          <TouchableOpacity
            className="bg-white w-16 h-16 rounded-full justify-center items-center mx-4"
            onPress={handleCapturePhoto}
          >
            <View className="w-14 h-14 rounded-full border-4 border-red-500" />
          </TouchableOpacity>

          <TouchableOpacity
            className="absolute right-8 bg-black bg-opacity-50 p-3 rounded-full"
            onPress={() => setFacing(facing === "back" ? "front" : "back")}
          >
            <Ionicons name="camera-reverse-outline" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            className="absolute left-8 bg-black bg-opacity-50 p-3 rounded-full"
            onPress={() => setIsCameraActive(false)}
          >
            <Ionicons name="close-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- Pantalla de creación de nota ---
  return (
    <ScrollView className="flex-1 bg-gray-100 p-5">
      <Text className="text-2xl font-bold mb-4">Nueva Nota Fotográfica</Text>

      <TextInput
        className="border border-gray-300 bg-white p-3 mb-4 rounded-lg"
        placeholder="Título de la Nota"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        className="border border-gray-300 bg-white p-3 mb-4 rounded-lg h-24 text-top"
        placeholder="Descripción de la Nota"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {imageUri ? (
        <Image source={{ uri: imageUri }} className="w-full h-52 rounded-lg mb-4" />
      ) : (
        <Text className="text-center text-gray-400 bg-gray-200 p-4 rounded-lg mb-4">
          No hay imagen seleccionada.
        </Text>
      )}

      <View className="flex-row justify-between mb-4">
        <TouchableOpacity
          className="bg-blue-500 p-3 flex-1 mx-1 rounded-lg items-center"
          onPress={() => setIsCameraActive(true)}
        >
          <Text className="text-white font-semibold">Abrir Cámara</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-500 p-3 flex-1 mx-1 rounded-lg items-center"
          onPress={handlePickImage}
        >
          <Text className="text-white font-semibold">Galería</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className={`p-4 rounded-lg items-center ${(!title || !description || !imageUri) ? 'bg-green-400 opacity-60' : 'bg-green-600'}`}
        onPress={handleSave}
        disabled={!title || !description || !imageUri}
      >
        <Text className="text-white font-bold text-lg">Guardar Nota</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
