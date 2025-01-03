'use client';

import { createContext, useContext, ReactNode, ComponentType } from 'react';
import { StorageClient } from '@/types/storage.types';
import dynamic from 'next/dynamic';

// Dynamically import storage services with no SSR
const S3Service = dynamic<any>(
  () => import('@/lib/storage/aws-s3').then(mod => mod.S3Service)as any,
  { ssr: false }
);

const GoogleStorageService = dynamic<any>(
  () => import('@/lib/storage/google-storage').then(mod => mod.GoogleStorageService) as any,
  { ssr: false }
);

interface StorageContextType {
  storage: StorageClient;
}

export const StorageContext = createContext<StorageContextType | undefined>(undefined);

export function StorageProvider({ children }: { children: ReactNode }) {
  const provider = process.env.NEXT_PUBLIC_STORAGE_PROVIDER;
  const ServiceClass:any = provider === 'aws' ? S3Service : GoogleStorageService;
  const storageInstance = new ServiceClass();

  return (
    <StorageContext.Provider value={{ storage: storageInstance }}>
      {children}
    </StorageContext.Provider>
  );
} 