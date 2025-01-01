'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { StorageFactory, StorageProvider as StorageType } from '@/lib/storage/storage-factory';
import { StorageClient } from '@/lib/storage/storage-client';

interface StorageContextType {
  storage: StorageClient | null;
  loading: boolean;
  error: Error | null;
}

const StorageContext = createContext<StorageContextType>({
  storage: null,
  loading: true,
  error: null,
});

export function StorageProvider({ children }: { children: ReactNode }) {
  const [storage, setStorage] = useState<StorageClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const storageProvider = process.env.NEXT_PUBLIC_STORAGE_PROVIDER as StorageType;
      const storageInstance = StorageFactory.initialize(storageProvider);
      setStorage(storageInstance);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize storage'));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <StorageContext.Provider value={{ storage, loading, error }}>
      {children}
    </StorageContext.Provider>
  );
}

// Custom hook to use storage
export function useStorage() {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('useStorage must be used within a StorageProvider');
  }

  const uploadFile = async (file: File, key: string) => {
    if (!context.storage) {
      throw new Error('Storage not initialized');
    }
    if (context.loading) {
      throw new Error('Storage is still initializing');
    }
    if (context.error) {
      throw context.error;
    }

    try {
      return await context.storage.uploadFile(file, key);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const deleteFile = async (key: string) => {
    if (!context.storage) throw new Error('Storage not initialized');
    return await context.storage.deleteFile(key);
  };

  const listFiles = async (prefix: string) => {
    if (!context.storage) throw new Error('Storage not initialized');
    return await context.storage.listFiles(prefix);
  };

  const getSignedUrl = async (key: string, expiresIn?: number) => {
    if (!context.storage) throw new Error('Storage not initialized');
    return await context.storage.getSignedUrl(key, expiresIn);
  };

  return {
    ...context,
    uploadFile,
    deleteFile,
    listFiles,
    getSignedUrl,
  };
} 