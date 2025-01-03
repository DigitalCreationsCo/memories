import { create } from 'zustand'
import { MediaType } from '@/types/media.types'
import { useProjectMedia } from './use-project-media'
import { useEffect } from 'react'

interface MediaStore {
    // UI State
    selectedItems: string[]
    selectItem: (id: string) => void
    unselectItem: (id: string) => void
    clearSelection: () => void
    
    // Media Items State
    items: MediaType[]
    setItems: (items: MediaType[]) => void
    addItems: (items: MediaType[]) => void
    removeItem: (id: string) => void
    
    // Error handling
    error: Error | null;
    isLoading: boolean;
    setError: (error: Error | null) => void;
    setLoading: (isLoading: boolean) => void;
}

const useMediaStoreBase = create<MediaStore>((set) => ({
    // UI Selection State
    selectedItems: [],
    selectItem: (id) => set((state) => ({
        selectedItems: [...state.selectedItems, id]
    })),
    unselectItem: (id) => set((state) => ({
        selectedItems: state.selectedItems.filter(item => item !== id)
    })),
    clearSelection: () => set({ selectedItems: [] }),
    
    // Media Items State
    items: [],
    setItems: (items) => set({ items }),
    addItems: (newItems) => set((state) => ({
        items: [...state.items, ...newItems]
    })),
    removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
    })),
    
    // Error handling
    error: null,
    isLoading: false,
    setError: (error: Error | null) => set({ error }),
    setLoading: (isLoading: boolean) => set({ isLoading }),
}));

// Wrapper hook that handles syncing
export function useMediaStore(projectId?: string) {
    const store = useMediaStoreBase();
    
    // Only sync if projectId is provided
    if (projectId) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { mediaItems, isLoading, error } = useProjectMedia(projectId);
        
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (!isLoading) {
                store.setItems(mediaItems || []);
            }
            store.setError(error);
            store.setLoading(isLoading);
        }, [mediaItems, isLoading, error]);
    }
    
    return store;
}