// VideoPlayer.tsx
import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Video } from 'expo-av';

interface VideoPlayerProps {
  videoUri: string;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUri, onClose }) => {
  console.log('VideoPlayer - Video URI:', videoUri);

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: videoUri.replace("file://", "") }}
        style={styles.video}
        useNativeControls
        isLooping
        onError={(error) => console.error('VideoPlayer - Error:', error)}
        onLoad={(data) => console.log('VideoPlayer - Video Loaded:', data)}
      />
      <View style={styles.buttonContainer}>
        <Button title="Stop" onPress={onClose} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    flex: 1,
    width: '100%', // Ensure the video takes the full width
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});

export default VideoPlayer;
