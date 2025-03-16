import React, { createContext, useContext, useState, useEffect } from "react";
import { Client, Storage } from "appwrite";

const projectID = import.meta.env.VITE_APP_APPWRITE_PROJECTID;
const endPoint = import.meta.env.VITE_APP_APPWRITE_ENDPOINT;
const bucketId = import.meta.env.VITE_APP_APPWRITE_BUCKETID;


const client = new Client()
  .setEndpoint(endPoint) 
  .setProject(projectID); 


const storage = new Storage(client);


const AppwriteContext = createContext();


export const AppwriteProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    setIsLoading(false);
  }, []);


  const uploadFile = async (file) => {
    try {
      const response = await storage.createFile(bucketId, "unique()", file);
      return response;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

 
  const deleteFile = async (fileId) => {
    try {
      const response = await storage.deleteFile(bucketId, fileId);
      return response;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  };


  const getFilePreview = (fileId) => {
    return storage.getFilePreview(bucketId, fileId);
  };

  
  const listFiles = async () => {
    try {
      const response = await storage.listFiles(bucketId);
      return response.files;
    } catch (error) {
      console.error("Error listing files:", error);
      throw error;
    }
  };

  return (
    <AppwriteContext.Provider
      value={{
        uploadFile,
        deleteFile,
        getFilePreview,
        listFiles,
        isLoading,
      }}
    >
      {children}
    </AppwriteContext.Provider>
  );
};


export const useAppwrite = () => useContext(AppwriteContext);