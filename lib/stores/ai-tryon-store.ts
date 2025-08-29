import { create } from 'zustand';

export interface AiGeneration {
  id: string;
  status: 'generating' | 'completed' | 'failed';
  userImageUrl: string;
  clothingImageUrl: string;
  resultImageUrl?: string;
  description?: string;
  confidence?: number;
  model?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
  abortController?: AbortController;
}

interface AiTryonStore {
  generations: AiGeneration[];
  addGeneration: (generation: Omit<AiGeneration, 'id' | 'createdAt'>) => string;
  updateGeneration: (id: string, updates: Partial<AiGeneration>) => void;
  removeGeneration: (id: string) => void;
  cancelGeneration: (id: string) => void;
  clearCompleted: () => void;
}

export const useAiTryonStore = create<AiTryonStore>((set, get) => ({
  generations: [],
  
  addGeneration: (generation) => {
    const id = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newGeneration: AiGeneration = {
      ...generation,
      id,
      createdAt: new Date(),
    };
    
    set((state) => ({
      generations: [...state.generations, newGeneration],
    }));
    
    return id;
  },
  
  updateGeneration: (id, updates) => {
    set((state) => ({
      generations: state.generations.map((gen) =>
        gen.id === id ? { 
          ...gen, 
          ...updates,
          completedAt: updates.status === 'completed' ? new Date() : gen.completedAt
        } : gen
      ),
    }));
  },
  
  removeGeneration: (id) => {
    const generation = get().generations.find(g => g.id === id);
    if (generation?.abortController) {
      generation.abortController.abort();
    }
    
    set((state) => ({
      generations: state.generations.filter((gen) => gen.id !== id),
    }));
  },
  
  cancelGeneration: (id) => {
    const generation = get().generations.find(g => g.id === id);
    if (generation?.abortController) {
      generation.abortController.abort();
    }
    
    get().updateGeneration(id, { 
      status: 'failed', 
      error: 'Cancelled by user',
      abortController: undefined
    });
  },
  
  clearCompleted: () => {
    set((state) => ({
      generations: state.generations.filter((gen) => gen.status === 'generating'),
    }));
  },
}));  