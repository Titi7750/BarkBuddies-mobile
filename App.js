import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, PanResponder, Animated, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Card from './src/components/TinderCard';
import users from './assets/data/users';
import Logo from './assets/images/logo.png';

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
      <Image source={Logo} style={styles.logo} />
      {currentProfile && (
        <SwipeableCard
          key={currentProfile.id}
          currentProfile={currentProfile}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      )}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.button}>
          <Image source={Logo} style={styles.logoNav} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <MaterialIcons name="search" size={30} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <MaterialIcons name="favorite" size={30} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <MaterialIcons name="message" size={30} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <MaterialIcons name="person" size={30} color="grey" />
        </TouchableOpacity>
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
  logo: {
    width: 70,
    height: 70,
    margin: 'auto',
    position: 'absolute',
    top: '5%',
  },
  card: {
    width: '90%',
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
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  logoNav: {
    width: 40,
    height: 40,
  },
  button: {
    alignItems: 'center',
  },
  buttonText: {
    color: 'grey',
  },
});

export default App;