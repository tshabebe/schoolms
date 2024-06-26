import { create } from "zustand";

type State = {
  id: number | null;
  loading: boolean;
};

type Action = {
  updateId: (id: State["id"]) => void;
  setLoading: (loading: State["loading"]) => void;
};

// Create your store, which includes both state and (optionally) actions
export const usePersonStore = create<State & Action>((set) => ({
  id: null,
  loading: false,
  updateData: {},
  updateId: (test) => set(() => ({ id: test })),
  setLoading: (loading) => set(() => ({ loading: loading })),
}));
