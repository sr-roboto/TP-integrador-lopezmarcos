import { View, Text, Image, ScrollView, Button, Alert, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNotes } from '../../hooks/useNotes';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const noteId = Array.isArray(id) ? id[0] : id;

  const { getNoteById, deleteNote, isLoading } = useNotes();
  const note = getNoteById(noteId);

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar esta nota fotográfica?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            if (noteId) {
              await deleteNote(noteId);
              router.replace('/');
            }
          },
          style: 'destructive',
        }
      ]
    );
  };

  const handleEdit = () => {
    router.push(`/edit/${noteId}`);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!note) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg">Nota no encontrada.</Text>
      </View>
    );
  }

  const formattedDate = new Date(note.date).toLocaleDateString();

  return (
    <ScrollView className="flex-1 bg-white m-2">
      <Image
        source={{ uri: note.imageUri }}
        className="w-full h-72 object-cover rounded-lg shadow-md"
      />

      <View className="m-4">
        <View className="">
          <View className="bg-slate-300  p-4 rounded-lg shadow-md">
            <Text className="text-3xl font-bold mb-1">{note.title}</Text>
            <Text className="text-base mb-4">{note.description}</Text>
            <Text className="text-black text-sm mb-5">
              Última modificación: {formattedDate}
            </Text>
          </View>
        </View>


        <View className="flex-row justify-between mt-5">
          <View className="flex-1 mr-2 flex items-center">
            <Pressable className="bg-blue-400 w-1/2 p-4 flex items-center rounded-lg" onPress={handleEdit}>
              <AntDesign name="edit" size={24} color="white" />
            </Pressable>
          </View>
          <View className="flex-1 ml-2 flex items-center">
            <Pressable className="bg-red-400 w-1/2 p-4 flex items-center rounded-lg" onPress={handleDelete}>
              <AntDesign name="delete" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
