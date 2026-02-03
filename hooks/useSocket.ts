'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

interface UseSocketOptions {
    autoConnect?: boolean;
}

export function useSocket(options: UseSocketOptions = {}) {
    const { autoConnect = true } = options;
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (autoConnect && !socketRef.current) {
            socketRef.current = io(SOCKET_URL, {
                transports: ['websocket', 'polling'],
            });

            socketRef.current.on('connect', () => {
                console.log('✅ Socket connected');
                setIsConnected(true);
            });

            socketRef.current.on('disconnect', () => {
                console.log('❌ Socket disconnected');
                setIsConnected(false);
            });

            socketRef.current.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [autoConnect]);

    const emit = (event: string, data?: any) => {
        if (socketRef.current) {
            socketRef.current.emit(event, data);
        }
    };

    const on = (event: string, callback: (data: any) => void) => {
        if (socketRef.current) {
            socketRef.current.on(event, callback);
        }
    };

    const off = (event: string, callback?: (data: any) => void) => {
        if (socketRef.current) {
            socketRef.current.off(event, callback);
        }
    };

    const authenticate = (userId: string, role: string, ambulanceId?: string) => {
        emit('authenticate', { userId, role, ambulanceId });
    };

    return {
        socket: socketRef.current,
        isConnected,
        emit,
        on,
        off,
        authenticate,
    };
}
