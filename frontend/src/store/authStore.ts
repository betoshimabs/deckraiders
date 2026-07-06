import { create } from 'zustand';
import { pb } from '../pocketbase';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthState {
  isLoggedIn: boolean;
  isAnonymous: boolean;
  user: User | null;
  error: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string) => Promise<boolean>;
  startAsGuest: () => void;
  clearError: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isAnonymous: false,
  user: null,
  error: null,
  loading: false,

  initAuth: () => {
    // Check if PocketBase has a valid saved token
    if (pb.authStore.isValid && pb.authStore.model) {
      set({
        isLoggedIn: true,
        isAnonymous: false,
        user: {
          id: pb.authStore.model.id,
          email: pb.authStore.model.email || '',
          username: pb.authStore.model.username || '',
        },
        error: null,
      });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      set({
        isLoggedIn: true,
        isAnonymous: false,
        user: {
          id: authData.record.id,
          email: authData.record.email || '',
          username: authData.record.username || '',
        },
        loading: false,
      });
      return true;
    } catch (err: any) {
      const msg = err.message || 'Falha ao autenticar. Verifique suas credenciais.';
      set({ error: msg, loading: false });
      return false;
    }
  },

  register: async (email, password) => {
    set({ loading: true, error: null });
    try {
      // Basic registration
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
        emailVisibility: true,
      });
      // Auto login after registration
      const authData = await pb.collection('users').authWithPassword(email, password);
      set({
        isLoggedIn: true,
        isAnonymous: false,
        user: {
          id: authData.record.id,
          email: authData.record.email || '',
          username: authData.record.username || '',
        },
        loading: false,
      });
      return true;
    } catch (err: any) {
      // Extract specific field errors if available
      let msg = 'Erro ao cadastrar.';
      if (err.data?.data) {
        const errors = err.data.data;
        const keys = Object.keys(errors);
        if (keys.length > 0) {
          msg = `${keys[0]}: ${errors[keys[0]].message}`;
        }
      } else if (err.message) {
        msg = err.message;
      }
      set({ error: msg, loading: false });
      return false;
    }
  },

  startAsGuest: () => {
    // Generate a random guest ID
    const guestId = `guest_${Math.random().toString(36).substring(2, 11)}`;
    set({
      isLoggedIn: false,
      isAnonymous: true,
      user: {
        id: guestId,
        email: 'anonimo@deckraiders.local',
        username: `Ladino_${guestId.substring(6, 11)}`,
      },
      error: null,
    });
  },

  logout: () => {
    pb.authStore.clear();
    set({
      isLoggedIn: false,
      isAnonymous: false,
      user: null,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
