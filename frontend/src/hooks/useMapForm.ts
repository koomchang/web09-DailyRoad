import { useCallback, useEffect, useState } from 'react';

import { BaseMap } from '@/types';

const defaultMapData: BaseMap = {
  title: '',
  description: '',
  thumbnailUrl: '',
  isPublic: true,
  mode: 'MAP',
};

export const useMapForm = (initialMapData?: BaseMap) => {
  const [mapInfo, setMapInfo] = useState<BaseMap>(
    initialMapData ?? defaultMapData,
  );
  const [isMapInfoValid, setIsMapInfoValid] = useState(false);

  useEffect(() => {
    validateInputs();
  }, [mapInfo]);

  const validateInputs = () => {
    const { title, description, thumbnailUrl } = mapInfo;
    const isUrlValid = !thumbnailUrl || /^https?:\/.+/.test(thumbnailUrl);
    setIsMapInfoValid(!!title && !!description && isUrlValid);
  };

  const updateMapInfo = useCallback(
    <K extends keyof BaseMap>(field: K, value: BaseMap[K]) => {
      setMapInfo((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  return { mapInfo, updateMapInfo, isMapInfoValid };
};
