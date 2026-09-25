/** État de connexion à l'API — avec auto-récupération et retry */

"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

export function useApiHealth() {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    let retryCount = 0;
    const maxRetries = 10;

    function checkHealth() {
      api
        .health()
        .then(() => {
          if (!cancelled) setOk(true);
        })
        .catch(() => {
          if (!cancelled) {
            setOk(false);
            if (retryCount < maxRetries) {
              retryCount += 1;
              setTimeout(checkHealth, 3000);
            }
          }
        });
    }

    checkHealth();

    // Re-vérifier périodiquement toutes les 30s
    const interval = setInterval(checkHealth, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return ok;
}

