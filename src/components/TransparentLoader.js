import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const TransparentLoader = ({ isVisible, message }) => {
  if (!isVisible) return null;

  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="65" color="#f9a825" />
      {message && <Text style={styles.loaderText}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Ensure the loader appears on top of other components
  },
  loaderText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransparentLoader;