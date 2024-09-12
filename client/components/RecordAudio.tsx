import { useState } from "react";
import { View, StyleSheet, Text, Pressable, Animated } from "react-native";
import { Recording } from "expo-av/build/Audio";
import { Audio } from 'expo-av';
import { Socket } from 'socket.io-client';
import MicSvg from "./MicSvg";

type RecordAudioProps = {
    socket: Socket;
};

export default function RecordAudio({ socket }: RecordAudioProps) {
    const [recording, setRecording] = useState<Recording | undefined>();
    const [colorAnim] = useState(new Animated.Value(0));

    async function startRecording() {
        try {
            const permission = await Audio.requestPermissionsAsync();

            if (permission.status === "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });

                const { recording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );

                setRecording(recording);

                Animated.timing(colorAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            } else {
                console.log("No permission to record audio.");
            }
        } catch (err) {
            console.error("Failed to start recording", err);
        }
    }

    async function stopRecording() {
        if (!recording) return;

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();

            if (uri) {
                const response = await fetch(uri);
                const audioBlob = await response.blob();

                const reader = new FileReader();
                reader.readAsArrayBuffer(audioBlob);

                reader.onloadend = () => {
                    const arrayBuffer = reader.result;

                    if (arrayBuffer) {
                        socket.emit("send_audio", { audio: arrayBuffer });
                    } else {
                        console.error("Failed to convert audio Blob to ArrayBuffer");
                    }
                };

                reader.onerror = (error) => {
                    console.error("Failed to read audio Blob", error);
                };
            }
        } catch (err) {
            console.error("Failed to stop recording", err);
        } finally {
            setRecording(undefined);

            Animated.timing(colorAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    }

    const interpolateColor = colorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#3C4043', '#CB3739'],
    });

    const interpolateBorderColor = colorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#555555', '#F36969'],
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.button, { backgroundColor: interpolateColor, borderColor: interpolateBorderColor }]}>
                <Pressable
                    onPressIn={startRecording}
                    onPressOut={stopRecording}
                    style={styles.pressable}
                >
                    <MicSvg />
                </Pressable>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#161515',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 8,
        borderRadius: 50,
        width: 200,
        height: 200,
    },
    pressable: {
        width: '100%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
