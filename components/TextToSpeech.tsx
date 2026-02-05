'use client';

import { useState, useEffect } from 'react';

interface TextToSpeechProps {
    text: string;
    language?: 'en-US' | 'ta-IN';
    autoPlay?: boolean;
    showControls?: boolean;
}

export default function TextToSpeech({
    text,
    language = 'en-US',
    autoPlay = false,
    showControls = true
}: TextToSpeechProps) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        // Check if speech synthesis is supported
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setIsSupported(true);
        }
    }, []);

    useEffect(() => {
        if (autoPlay && isSupported && text) {
            speak();
        }
        // Cleanup on unmount
        return () => {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, [autoPlay, text, isSupported]);

    const speak = () => {
        if (!isSupported || !text) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 0.9; // Slightly slower for better clarity
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const stop = () => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    if (!isSupported) {
        return null; // Don't show anything if TTS is not supported
    }

    if (!showControls) {
        return null; // Component manages speech in background
    }

    return (
        <div className="flex items-center gap-2">
            {!isSpeaking ? (
                <button
                    onClick={speak}
                    className="flex items-center gap-2 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm"
                    aria-label="Read aloud"
                >
                    🔊 Read Aloud
                </button>
            ) : (
                <button
                    onClick={stop}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                    aria-label="Stop reading"
                >
                    ⏹️ Stop
                </button>
            )}
        </div>
    );
}
