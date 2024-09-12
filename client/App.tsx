import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Audio } from 'expo-av';
import io from 'socket.io-client';
import { Buffer } from 'buffer'; 
import RecordAudio from './components/RecordAudio';

const socket = io("http://192.168.1.14:3001");

export default function App() {
  useEffect(() => {
    const handleReceiveAudio = (data: any) => {
      const audioArrayBuffer = new Uint8Array(data.audio).buffer;

      if (Platform.OS === 'web') {
        playAudioWeb(audioArrayBuffer);
      } else {
        playAudioMobile(audioArrayBuffer);
      }
    };

    socket.on("receive_audio", handleReceiveAudio);

    return () => {
      socket.off("receive_audio", handleReceiveAudio);
    };
  }, []);

  async function playAudioMobile(audioBuffer: ArrayBuffer) {
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    const uri = `data:audio/wav;base64,${base64Audio}`;

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );
    await sound.playAsync();
  }

  function playAudioWeb(audioBuffer: ArrayBuffer) {
    const blob = new Blob([audioBuffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const audio = new window.Audio(url);
    audio.play();
  }

  return (
    <View style={styles.container}>
      <RecordAudio socket={socket}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
