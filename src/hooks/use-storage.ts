import { StorageContext } from "@/providers/storage-provider";
import { useState } from "react";

import { useContext } from "react";
import { STORAGE_KEYS } from '@/utils/storage.utils'

export function useStorage() {
    const [isUploading, setIsUploading] = useState(false);
    
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }

  const uploadFile = async (file: File, key: string): Promise<string> => {
    try {
      // 1. Get upload URL from API
      const response = await fetch('/api/storage', {
        method: 'POST',
        body: JSON.stringify({
          operation: 'getUploadUrl',
          key,
          fileType: file.type,
        }),
      });
      const { url } = await response.json();

      setIsUploading(true);

      // 2. Upload file directly to storage
      await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      setIsUploading(false);
      // 3. Get download URL
      const downloadResponse = await fetch('/api/storage', {
        method: 'POST',
        body: JSON.stringify({
          operation: 'getDownloadUrl',
          key,
        }),
      });
      const { url: downloadUrl } = await downloadResponse.json();
      return downloadUrl;
    } catch (error) {
      setIsUploading(false);
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const deleteFile = async (key: string): Promise<void> => {
    await fetch('/api/storage', {
      method: 'POST',
      body: JSON.stringify({
        operation: 'deleteFile',
        key,
      }),
    });
  };

  const listFiles = async (prefix: string = ''): Promise<Array<{
    key: string;
    lastModified: string;
    size: number;
    etag: string;
  }>> => {
    const response = await fetch('/api/storage', {
      method: 'POST',
      body: JSON.stringify({
        operation: 'listFiles',
        key: prefix,
      }),
    });
    const { files } = await response.json();
    return files;
  };

  const getSignedUrl = async (key: string, expiresIn: number = 3600): Promise<string> => {
    const response = await fetch('/api/storage', {
      method: 'POST',
      body: JSON.stringify({
        operation: 'getDownloadUrl',
        key,
        expiresIn,
      }),
    });
    const { url } = await response.json();
    return url;
  };

  const uploadFiles = async (files: File[], projectId: string): Promise<string[]> => {
    try {
        setIsUploading(true);
        const uploadPromises = files.map(async (file, index) => {
            const mediaId = crypto.randomUUID() // Generate unique ID
            const key = STORAGE_KEYS.getMediaKey(projectId, mediaId)
            return uploadFile(file, key);
        });

        const urls = await Promise.all(uploadPromises);
        setIsUploading(false);
        return urls;
    } catch (error) {
        setIsUploading(false);
        console.error('Error uploading files:', error);
        throw error;
    }
  };

  const deleteMedia = async (mediaId: string, projectId: string): Promise<{ success: boolean, error?: string }> => {
    try {
        const key = STORAGE_KEYS.getMediaKey(projectId, mediaId)
        await deleteFile(key);
        return { success: true };
    } catch (error) {
        console.error('Error deleting media:', error);
        return { success: false, error: 'Failed to delete media' };
    }
  };

  return {
    uploadFile,
    uploadFiles,
    deleteFile,
    deleteMedia,
    listFiles,
    getSignedUrl,
    isUploading,
  };
}