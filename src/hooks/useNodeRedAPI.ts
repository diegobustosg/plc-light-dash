import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface LightState {
  id: number;
  name: string;
  isActive: boolean;
  timerValue: number;
  timerRemaining: number;
}

interface UseNodeRedAPIProps {
  baseUrl?: string;
  pollingInterval?: number;
}

export const useNodeRedAPI = ({ 
  baseUrl = "http://localhost:1880/api", 
  pollingInterval = 1000 
}: UseNodeRedAPIProps = {}) => {
  const { toast } = useToast();
  const [lights, setLights] = useState<LightState[]>([
    { id: 1, name: "Luz 1", isActive: false, timerValue: 60, timerRemaining: 0 },
    { id: 2, name: "Luz 2", isActive: false, timerValue: 120, timerRemaining: 0 },
    { id: 3, name: "Luz 3", isActive: false, timerValue: 180, timerRemaining: 0 },
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const [apiUrl, setApiUrl] = useState(baseUrl);

  // Fetch lights state from Node-Red
  const fetchLightsState = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/lights`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setLights(data.lights || lights);
        if (!isConnected) {
          setIsConnected(true);
          toast({
            title: "Conectado",
            description: "Conexión establecida con Node-Red",
          });
        }
      }
    } catch (error) {
      // En modo demo, simula el comportamiento
      if (isConnected) {
        setIsConnected(false);
        console.log("Modo demo: API no disponible");
      }
    }
  }, [apiUrl, isConnected, lights, toast]);

  // Toggle light state
  const toggleLight = useCallback(async (lightId: number) => {
    try {
      const light = lights.find((l) => l.id === lightId);
      if (!light) return;

      const response = await fetch(`${apiUrl}/lights/${lightId}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !light.isActive }),
      });

      if (response.ok) {
        toast({
          title: "Comando enviado",
          description: `${light.name} ${!light.isActive ? "encendida" : "apagada"}`,
        });
      }
    } catch (error) {
      // Modo demo: actualiza localmente
      setLights((prev) =>
        prev.map((l) =>
          l.id === lightId
            ? {
                ...l,
                isActive: !l.isActive,
                timerRemaining: !l.isActive ? l.timerValue : 0,
              }
            : l
        )
      );
      
      toast({
        title: "Modo Demo",
        description: `${lights.find(l => l.id === lightId)?.name} ${
          lights.find(l => l.id === lightId)?.isActive ? "apagada" : "encendida"
        } (sin conexión API)`,
      });
    }
  }, [apiUrl, lights, toast]);

  // Update timer value
  const updateTimer = useCallback(async (lightId: number, timerValue: number) => {
    try {
      const response = await fetch(`${apiUrl}/lights/${lightId}/timer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timerValue }),
      });

      if (response.ok) {
        toast({
          title: "Temporizador actualizado",
          description: `Nuevo valor: ${timerValue} segundos`,
        });
      }
    } catch (error) {
      // Modo demo: actualiza localmente
      setLights((prev) =>
        prev.map((l) => (l.id === lightId ? { ...l, timerValue } : l))
      );
      
      toast({
        title: "Modo Demo",
        description: `Temporizador configurado: ${timerValue}s (sin conexión API)`,
      });
    }
  }, [apiUrl, toast]);

  // Simulate timer countdown in demo mode
  useEffect(() => {
    if (!isConnected) {
      const interval = setInterval(() => {
        setLights((prev) =>
          prev.map((light) =>
            light.isActive && light.timerRemaining > 0
              ? { ...light, timerRemaining: light.timerRemaining - 1 }
              : light.isActive && light.timerRemaining === 0
              ? { ...light, isActive: false, timerRemaining: 0 }
              : light
          )
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isConnected]);

  // Polling for real-time updates
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(fetchLightsState, pollingInterval);
      return () => clearInterval(interval);
    }
  }, [isConnected, fetchLightsState, pollingInterval]);

  return {
    lights,
    isConnected,
    toggleLight,
    updateTimer,
    setApiUrl,
  };
};
