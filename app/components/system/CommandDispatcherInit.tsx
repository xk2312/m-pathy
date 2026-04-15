"use client";

import { useEffect } from "react";
import { initCommandDispatcher } from "@/lib/dispatcher/commandDispatcher";

export default function CommandDispatcherInit() {
  useEffect(() => {
    initCommandDispatcher();
  }, []);

  return null;
}