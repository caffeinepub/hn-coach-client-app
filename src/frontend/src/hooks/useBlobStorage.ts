import { HttpAgent } from "@icp-sdk/core/agent";
import { useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";
import { useInternetIdentity } from "./useInternetIdentity";

export function useBlobStorage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { identity } = useInternetIdentity();

  const uploadFile = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const config = await loadConfig();
      const agentOptions: Record<string, unknown> = {
        host: config.backend_host,
      };
      if (identity) {
        agentOptions.identity = identity;
      }
      const agent = new HttpAgent(agentOptions);
      if (config.backend_host?.includes("localhost")) {
        await agent.fetchRootKey().catch(() => {});
      }
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await storageClient.putFile(bytes, (pct) => {
        setUploadProgress(pct);
      });
      const url = await storageClient.getDirectURL(hash);
      return url;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, uploadProgress };
}
