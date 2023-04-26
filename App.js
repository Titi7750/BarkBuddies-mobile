import React, { useEffect, useState } from 'react';
import { View, StyleSheet, PanResponder, Animated } from 'react-native';
import Card from './src/components/TinderCard';
import users from './assets/data/users';

const SwipeableCard = ({ currentProfile, onSwipeLeft, onSwipeRight }) => {
  const position = useState(new Animated.ValueXY())[0];
  const [direction, setDirection] = useState(null);
  const [resetPosition, setResetPosition] = useState(false);

  const [panResponder, setPanResponder] = useState(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: position.x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -120) {
          setDirection('left');
          onSwipeLeft();
        } else if (dx > 120) {
          setDirection('right');
          onSwipeRight();
        } else {
          setResetPosition(true);
        }
      },
    })
  );

  useEffect(() => {
    if (resetPosition) {
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start(() => setResetPosition(false));
    }
  }, [resetPosition]);

  return (
    <Animated.View style={[styles.card, position.getLayout()]} {...panResponder.panHandlers}>
      <Card user={currentProfile} />
    </Animated.View>
  );
};

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipeLeft = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const handleSwipeRight = () => {
    setCurrentIndex(currentIndex + 1);
  };

  useEffect(() => {
    if (currentIndex !== 0 && currentIndex % users.length === 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex]);

  const currentProfile = users[currentIndex];

  return (
    <View style={styles.container}>
      {currentProfile && (
        <SwipeableCard
          key={currentProfile.id}
          currentProfile={currentProfile}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '80%',
    height: '70%',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
});

export default App;