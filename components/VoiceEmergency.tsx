'use client';

import { useState, useEffect } from 'react';

interface VoiceEmergencyProps {
    onEmergencyTriggered: () => void;
}

export default function VoiceEmergency({ onEmergencyTriggered }: VoiceEmergencyProps) {
    const [listening, setListening] = useState(false);
    const [supported, setSupported] = useState(false);
    const [transcript, setTranscript] = useState('');

    useEffect(() => {
        // Check if browser supports Web Speech API
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setSupported(true);
        }
    }, []);

    const startListening = () => {
        if (!supported) {
            alert('Voice recognition is not supported in your browser');
            return;
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setListening(true);
            setTranscript('Listening...');
        };

        recognition.onresult = (event: any) => {
            const result = event.results[0][0].transcript.toLowerCase();
            setTranscript(result);

            if (result.includes('emergency') || result.includes('help') || result.includes('sos')) {
                setTimeout(() => {
                    const speech = new SpeechSynthesisUtterance('Emergency detected. Sending help request.');
                    window.speechSynthesis.speak(speech);
                    onEmergencyTriggered();
                }, 500);
            }
        };

        recognition.onerror = () => {
            setListening(false);
            setTranscript('Error occurred. Please try again.');
        };

        recognition.onend = () => {
            setListening(false);
        };

        recognition.start();
    };

    return (
        <div className="card card-glass p-6 text-center">
            <h3 className="text-xl font-bold text-primary-teal mb-4">
                🎤 Voice Emergency
            </h3>
            <p className="text-text-secondary mb-4 text-sm">
                Speak &quot;Emergency&quot;, &quot;Help&quot;, or &quot;SOS&quot; to send an alert
            </p>

            <button
                onClick={startListening}
                disabled={!supported || listening}
                className={`w-20 h-20 rounded-full mx-auto mb-4 transition ${listening
                    ? 'bg-emergency-red animate-pulse'
                    : 'bg-primary-teal hover:bg-primary-teal-dark'
                    } text-white flex items-center justify-center text-3xl`}
            >
                🎤
            </button>

            {transcript && (
                <p className="text-sm text-text-secondary italic">
                    &quot;{transcript}&quot;
                </p>
            )}

            {!supported && (
                <p className="text-sm text-warning-amber mt-2">
                    Voice recognition not supported in this browser
                </p>
            )}
        </div>
    );
}
