import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';

interface VideoPlayerProps {
  videoUri: string;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUri, onClose }) => {
  console.log('VideoPlayer - Video URI:', videoUri);

  // Fonction pour gérer le téléchargement de la vidéo
  const downloadVideo = async () => {
    try {
      // Obtenez le répertoire de documents de l'application
      const documentsDirectory = FileSystem.documentDirectory + 'videos/';

      // Créez le répertoire s'il n'existe pas
      await FileSystem.makeDirectoryAsync(documentsDirectory, { intermediates: true });

      // Obtenez le nom du fichier à partir de l'URI
      const fileName = videoUri.split('/').pop() || 'downloadedVideo.mp4';

      // Construisez le chemin du fichier dans le répertoire de documents
      const destinationUri = documentsDirectory + fileName;

      // Copiez le fichier de l'emplacement actuel vers le répertoire de documents
      await FileSystem.copyAsync({
        from: videoUri,
        to: destinationUri,
      });

      // Affichez l'URI du fichier copié
      console.log('VideoPlayer - Video copied at:', destinationUri);
    } catch (error) {
      console.error('VideoPlayer - Error copying video:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={{
          uri: videoUri,
        }}
        style={styles.video}
        useNativeControls
        isLooping
        shouldPlay
        onError={(error) => console.error('VideoPlayer - Error:', error)}
        onLoad={(data) => console.log('VideoPlayer - Video Loaded:', data)}
      />
      <View style={styles.buttonContainer}>
        <Button title="Stop" onPress={onClose} />
        <Button title="Download" onPress={downloadVideo} />
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
