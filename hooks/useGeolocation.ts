'use client';

import { useState, useEffect } from 'react';

interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
    loading: boolean;
}

interface UseGeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
    watch?: boolean;
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
    const {
        enableHighAccuracy = true,
        timeout = 5000,
        maximumAge = 0,
        watch = false,
    } = options;

    const [state, setState] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        error: null,
        loading: true,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setState({
                latitude: null,
                longitude: null,
                error: 'Geolocation is not supported by your browser',
                loading: false,
            });
            return;
        }

        const onSuccess = (position: GeolocationPosition) => {
            setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
                loading: false,
            });
        };

        const onError = (error: GeolocationPositionError) => {
            setState({
                latitude: null,
                longitude: null,
                error: error.message,
                loading: false,
            });
        };

        const geoOptions = {
            enableHighAccuracy,
            timeout,
            maximumAge,
        };

        let watchId: number | undefined;

        if (watch) {
            watchId = navigator.geolocation.watchPosition(onSuccess, onError, geoOptions);
        } else {
            navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions);
        }

        return () => {
            if (watchId !== undefined) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [enableHighAccuracy, timeout, maximumAge, watch]);

    const refreshLocation = () => {
        setState(prev => ({ ...prev, loading: true }));

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                    loading: false,
                });
            },
            (error) => {
                setState({
                    latitude: null,
                    longitude: null,
                    error: error.message,
                    loading: false,
                });
            },
            { enableHighAccuracy, timeout, maximumAge }
        );
    };

    return {
        ...state,
        refreshLocation,
    };
}
