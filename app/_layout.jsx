import { Stack } from 'expo-router';
import { NotesProvider } from '../hooks/useNotes';
import '../global.css';

export default function RootLayout() {
  return (
    <NotesProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#000',
          headerTitleAlign: 'center',
        }}
      >
        {/* Podés definir títulos específicos de las pantallas */}
        <Stack.Screen name="(tabs)/index" options={{ title: 'Inicio' }} />
        <Stack.Screen name="note/[id]" options={{ title: 'Nota' }} />
        <Stack.Screen name="edit/[id]" options={{ title: 'Editar Nota' }} />
        <Stack.Screen name="create" options={{ title: 'Nueva Nota' }} />
      </Stack>
    </NotesProvider>
  );
}
