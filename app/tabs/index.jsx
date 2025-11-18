import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNotes } from '../../hooks/useNotes';
import { router, Stack } from 'expo-router';

const NoteListItem = ({ note }) => {
  const navigateToDetail = () => {
    router.push(`/note/${note.id}`);
  };

  return (
    <TouchableOpacity
      className="flex-row items-center bg-slate-100 p-2 mb-2 rounded-lg shadow-md"
      onPress={navigateToDetail}
    >
      <Image
        source={{ uri: note.imageUri }}
        className="w-16 h-16 rounded-md mr-4 bg-gray-200"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold truncate">{note.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function IndexScreen() {
  const { notes, isLoading } = useNotes();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-2">Cargando notas...</Text>
      </View>
    );
  }

  return (
    <>
      <View className="flex-1 bg-gray-100 p-5">
        <Text className="text-3xl font-bold mb-4">Mis Notas</Text>

        <View className="bg-slate-400 m-2 p-4 rounded-lg shadow-lg max-h-[500px] overflow-auto">
          {notes.length === 0 ? (
            <Text className="text-center text-lg">
              Aún no tienes notas guardadas.
            </Text>
          ) : (
            <FlatList
              data={notes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <NoteListItem note={item} />}
              contentContainerStyle={{ paddingBottom: 10 }}
            />
          )}
        </View>

        <TouchableOpacity
          className="bg-green-500 p-3 rounded-lg items-center"
          onPress={() => router.push('/create')}
        >
          <Text className="text-white font-bold text-base">+ Crear Nueva Nota</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
