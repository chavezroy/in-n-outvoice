"use client";

import { useEffect } from "react";
import { initializeStorage, initializeTemplates } from "@/lib/storage";

export function ClientStorageInit() {
  useEffect(() => {
    initializeStorage();
    initializeTemplates();
  }, []);

  return null;
}

