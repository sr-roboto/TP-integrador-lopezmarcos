import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, Image, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useNotes } from '../../hooks/useNotes';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams();
  const noteId = Array.isArray(id) ? id[0] : id;

  const { getNoteById, updateNote, isLoading } = useNotes();
  const existingNote = getNoteById(noteId);

  const cameraRef = useRef(null);
  const [facing, setFacing] = useState('back');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setDescription(existingNote.description);
      setImageUri(existingNote.imageUri);
    }
  }, [existingNote]);

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
      Alert.alert("Campos Incompletos", "Debes ingresar un título, una descripción y tener una imagen.");
      return;
    }

    if (!existingNote || !noteId) {
      Alert.alert("Error", "Nota no cargada para edición.");
      return;
    }

    const updatedData = {
      title: title.trim(),
      description: description.trim(),
      imageUri,
    };

    await updateNote(noteId, updatedData);

    router.replace('/');
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!existingNote) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-lg mb-4">Nota de edición no encontrada.</Text>
        <Button title="Volver a la Lista" onPress={() => router.replace('/')} />
      </View>
    );
  }

  if (isCameraActive) {
    if (!permission) return <View />;

    if (!permission.granted) {
      return (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="mb-4">Necesitamos permiso para usar la cámara.</Text>
          <Button title="Dar permiso" onPress={requestPermission} />
        </View>
      );
    }

    return (
      <View className="flex-1">
        <CameraView
          style={{ flex: 1 }}
          facing={facing}
          ref={cameraRef}
        />
        <View className="absolute bottom-10 w-full flex-row justify-around items-center">
          <TouchableOpacity className="w-16 h-16 rounded-full bg-white justify-center items-center" onPress={handleCapturePhoto}>
            <View className="w-14 h-14 rounded-full border-4 border-red-500" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setFacing(facing === "back" ? "front" : "back")}>
            <Text className="text-white text-lg">Flip</Text>
          </TouchableOpacity>

          <Button title="Cancelar" onPress={() => setIsCameraActive(false)} color="#fff" />
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100 p-5">
      <Text className="text-2xl font-bold mb-4">Modificar Nota Fotográfica</Text>

      <View className="mb-4 bg-slate-300 p-4 rounded-lg">
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
          <Text className="text-center text-gray-400 bg-gray-200 p-4 rounded-lg mb-4">No hay imagen seleccionada.</Text>
        )}

        <View className="flex-row justify-between mb-4">
          <TouchableOpacity className="bg-blue-400 p-3 flex-1 justify-center mx-1 rounded-lg items-center" onPress={() => setIsCameraActive(true)}>
            <Text className="text-white font-semibold">Tomar Nueva Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-blue-400 p-3 flex-1 justify-center mx-1 rounded-lg items-center" onPress={handlePickImage}>
            <Text className="text-white font-semibold">Elegir Nueva de Galería</Text>
          </TouchableOpacity>
        </View>

        <View className='flex items-center'>
          <TouchableOpacity
            className={`p-2 w-1/2 rounded-lg items-center ${(!title || !description || !imageUri) ? 'bg-green-400 opacity-60' : 'bg-green-600'}`}
            onPress={handleSave}
            disabled={!title || !description || !imageUri}
          >
            <FontAwesome5 name="save" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  );
}
