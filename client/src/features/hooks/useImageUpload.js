import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024;
const DEFAULT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

function makeLocalAsset(file) {
  return {
    id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
    url: URL.createObjectURL(file),
    name: file.name,
    size: file.size,
    type: file.type,
    file,
    local: true,
  };
}

export function useImageUpload({ upload, maxSize = DEFAULT_MAX_SIZE, acceptedTypes = DEFAULT_TYPES } = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const assets = useRef(new Map());

  useEffect(() => () => {
    assets.current.forEach((asset) => {
      if (asset.local && asset.url?.startsWith('blob:')) URL.revokeObjectURL(asset.url);
    });
    assets.current.clear();
  }, []);

  const validate = useCallback((file) => {
    if (!file || !file.type?.startsWith('image/')) throw new Error('Please choose an image file.');
    if (acceptedTypes.length && !acceptedTypes.includes(file.type)) {
      throw new Error(`Unsupported image type. Use ${acceptedTypes.map((type) => type.split('/')[1]).join(', ')}.`);
    }
    if (file.size > maxSize) throw new Error(`Image must be smaller than ${Math.round(maxSize / 1024 / 1024)} MB.`);
  }, [acceptedTypes, maxSize]);

  const uploadOne = useCallback(async (file) => {
    validate(file);
    setIsUploading(true);
    setProgress(15);
    setError(null);
    try {
      const result = upload ? await upload(file, setProgress) : makeLocalAsset(file);

      const asset = typeof result === 'string' ? { ...makeLocalAsset(file), url: result, local: false } : result;
      assets.current.set(asset.id || asset.url, asset);
      setProgress(100);
      return asset;
    } catch (uploadError) {
      const nextError = uploadError instanceof Error ? uploadError : new Error('Image upload failed.');
      setError(nextError);
      throw nextError;
    } finally {
      window.setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
      }, 250);
    }
  }, [upload, validate]);

  const uploadMany = useCallback(async (files) => {
    const results = [];
    for (const file of Array.from(files || [])) results.push(await uploadOne(file));
    return results;
  }, [uploadOne]);

  const revoke = useCallback((asset) => {
    if (asset?.local && asset.url?.startsWith('blob:')) URL.revokeObjectURL(asset.url);
    if (asset?.id) assets.current.delete(asset.id);
  }, []);

  return { upload: uploadOne, uploadMany, revoke, isUploading, progress, error };
}

export default useImageUpload;
