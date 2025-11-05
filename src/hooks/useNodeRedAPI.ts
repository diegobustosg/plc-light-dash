import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface LightState {
  id: number;
  name: string;
  isActive: boolean;
}

interface UseNodeRedAPIProps {
  pollingInterval?: number;
}

/**
 * API Service class for FastAPI backend integration
 */
class FastAPIClient {
  private baseUrl: string;
  private retryAttempts: number = 3;
  private retryDelay: number = 1000;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic fetch with retry logic and error handling
   */
  private async fetchWithRetry(url: string, options: RequestInit = {}): Promise<Response> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        if (response.ok) {
          return response;
        }

        // If not ok, throw error to retry
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        lastError = error as Error;
        console.warn(`API request failed (attempt ${attempt}/${this.retryAttempts}):`, error);

        if (attempt < this.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        }
      }
    }

    throw lastError!;
  }

  /**
   * Fetch all lights status
   */
  async fetchLights(): Promise<{ lights: LightState[] }> {
    const response = await this.fetchWithRetry(`${this.baseUrl}/api/lights`);
    return response.json();
  }

  /**
   * Toggle a specific light
   */
  async toggleLight(lightId: number, isActive: boolean): Promise<{ success: boolean; message: string }> {
    const response = await this.fetchWithRetry(`${this.baseUrl}/api/lights/${lightId}/toggle`, {
      method: 'POST',
      body: JSON.stringify({ isActive }),
    });
    return response.json();
  }

  /**
   * Check API health
   */
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    const response = await this.fetchWithRetry(`${this.baseUrl}/health`);
    return response.json();
  }
}

export const useNodeRedAPI = ({
  pollingInterval = 2000
}: UseNodeRedAPIProps = {}) => {
  const { toast } = useToast();
  const [lights, setLights] = useState<LightState[]>([
    { id: 1, name: "Luz 1", isActive: false },
    { id: 2, name: "Luz 2", isActive: false },
    { id: 3, name: "Luz 3", isActive: false },
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const apiClient = new FastAPIClient("http://localhost:8000");

  // Fetch lights state from FastAPI
  const fetchLightsState = useCallback(async () => {
    try {
      const data = await apiClient.fetchLights();
      setLights(data.lights);
      if (!isConnected) {
        setIsConnected(true);
        console.log("Connection established with FastAPI");
        toast({
          title: "Conectado",
          description: "Conexión establecida con FastAPI",
        });
      }
    } catch (error) {
      console.error("Failed to fetch lights:", error);
      if (isConnected) {
        setIsConnected(false);
        console.log("Connection lost with FastAPI");
        toast({
          title: "Desconectado",
          description: "No se pudo conectar con FastAPI",
          variant: "destructive",
        });
      }
    }
  }, [apiClient, isConnected, toast]);

  // Toggle light state
  const toggleLight = useCallback(async (lightId: number) => {
    if (isToggling) return; // Prevent multiple simultaneous toggles

    setIsToggling(true);
    const light = lights.find((l) => l.id === lightId);
    if (!light) {
      setIsToggling(false);
      return;
    }

    // Optimistic update
    const newState = !light.isActive;
    setLights((prev) =>
      prev.map((l) =>
        l.id === lightId ? { ...l, isActive: newState } : l
      )
    );

    try {
      const result = await apiClient.toggleLight(lightId, newState);
      toast({
        title: "Comando enviado",
        description: result.message,
      });
    } catch (error) {
      console.error("Failed to toggle light:", error);
      // Revert optimistic update on failure
      setLights((prev) =>
        prev.map((l) =>
          l.id === lightId ? { ...l, isActive: light.isActive } : l
        )
      );
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado de la luz",
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
    }
  }, [apiClient, lights, isToggling, toast]);

  // Check API health
  const checkHealth = useCallback(async (): Promise<boolean> => {
    try {
      const result = await apiClient.checkHealth();
      console.log("Health check successful:", result);
      return true;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }, [apiClient]);

  // Initial load and connection check
  useEffect(() => {
    console.log("Initializing API connection...");
    fetchLightsState();
    checkHealth().then((connected) => {
      console.log("Initial health check result:", connected);
      setIsConnected(connected);
    });
  }, [fetchLightsState, checkHealth]);

  // Polling for real-time updates (only when connected and not toggling)
  useEffect(() => {
    if (isConnected && !isToggling) {
      console.log(`Starting polling every ${pollingInterval}ms`);
      const interval = setInterval(() => {
        console.log("Polling for lights state...");
        fetchLightsState();
      }, pollingInterval);
      return () => {
        console.log("Stopping polling");
        clearInterval(interval);
      };
    }
  }, [isConnected, isToggling, fetchLightsState, pollingInterval]);

  return {
    lights,
    isConnected,
    toggleLight,
    checkHealth,
  };
};
