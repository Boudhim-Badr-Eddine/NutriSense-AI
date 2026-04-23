"use client";

import { useCallback, useState } from "react";

import {
  getStoredMaterials,
  MaterialItem,
  saveStoredMaterials,
} from "@/lib/materials";

interface UseMaterialsDataResult {
  materials: MaterialItem[];
  setMaterials: (updater: (current: MaterialItem[]) => MaterialItem[]) => void;
  refreshMaterials: () => void;
}

/**
 * Keep materials in sync across pages using localStorage-backed state.
 */
export const useMaterialsData = (): UseMaterialsDataResult => {
  const [materials, setMaterialsState] = useState<MaterialItem[]>(() =>
    getStoredMaterials(),
  );

  const refreshMaterials = useCallback(() => {
    setMaterialsState(getStoredMaterials());
  }, []);

  const setMaterials = useCallback(
    (updater: (current: MaterialItem[]) => MaterialItem[]) => {
      setMaterialsState((current) => {
        const base = current.length > 0 ? current : getStoredMaterials();
        const next = updater(base);
        saveStoredMaterials(next);
        return next;
      });
    },
    [],
  );

  return {
    materials,
    setMaterials,
    refreshMaterials,
  };
};
