import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { Wifi, WifiOff } from "lucide-react";

interface NetworkStatusProviderProps {
    children: React.ReactNode;
}

export const NetworkStatusProvider: React.FC<NetworkStatusProviderProps> = ({ children }) => {
    const isOnline = useNetworkStatus();
    const prevOnline = useRef<boolean | null>(null);

    useEffect(() => {
        // Only act on changes
        if (prevOnline.current === isOnline) return;

        // If this is the FIRST time we have a value (initial mount)
        if (prevOnline.current === null) {
            prevOnline.current = isOnline;
            return;
        }

        if (!isOnline) {
            // TRANSITION: ONLINE -> OFFLINE
            toast.error("Network connection lost. Some features may not work.", {
                id: "network-offline",
                duration: Infinity,
                icon: <WifiOff className="text-red-500" />,
            });
        } else {
            // TRANSITION: OFFLINE -> ONLINE
            toast.dismiss("network-offline");
            toast.success("Network connection restored. Reloading page...", {
                duration: 2000,
                icon: <Wifi className="text-green-500" />,
            });

            // Reload the page after a brief delay to let the toast be seen
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }

        // Update the ref for the next change
        prevOnline.current = isOnline;
    }, [isOnline]);

    return <>{children}</>;
};
