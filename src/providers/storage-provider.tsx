'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { StorageClient } from '@/types/storage.types';
import { S3Service } from '@/lib/storage/aws-s3';
import { GoogleStorageService } from '@/lib/storage/google-storage';

interface StorageContextType {
  storage: StorageClient;
}

export const StorageContext = createContext<StorageContextType | undefined>(undefined);

export function StorageProvider({ children }: { children: ReactNode }) {
  const provider = process.env.NEXT_PUBLIC_STORAGE_PROVIDER;
  const storage = provider === 'aws' ? new S3Service() : new GoogleStorageService();

  return (
    <StorageContext.Provider value={{ storage }}>
      {children}
    </StorageContext.Provider>
  );
}