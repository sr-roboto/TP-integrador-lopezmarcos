import { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values'; 
import { v4 as uuidv4 } from 'uuid'; 

const STORAGE_KEY = '@PhotoNotesApp:notes';

const NotesContext = createContext();

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const loadNotes = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setNotes(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error cargando notas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNotes = async (updatedNotes) => {
    try {
      setNotes(updatedNotes); 
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes)); 
    } catch (error) {
      console.error("Error guardando notas:", error);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const createNote = async (newNoteData) => {
    const newNote = {
      id: uuidv4(),
      ...newNoteData,
      date: new Date().toISOString(),
    };
    const updatedNotes = [newNote, ...notes];
    await saveNotes(updatedNotes);
  };

  const getNoteById = (id) => {
    return notes.find(note => note.id === id);
  };
  
  const updateNote = async (id, updatedData) => {
    const updatedNotes = notes.map(note => 
      note.id === id 
        ? { ...note, ...updatedData, date: new Date().toISOString() } 
        : note
    );
    await saveNotes(updatedNotes);
  };

  const deleteNote = async (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    await saveNotes(updatedNotes);
  };

  const contextValue = {
    notes,
    isLoading,
    createNote,
    getNoteById,
    updateNote,
    deleteNote,
  };

  return (
    <NotesContext.Provider value={contextValue}>
      {children}
    </NotesContext.Provider>
  );
};