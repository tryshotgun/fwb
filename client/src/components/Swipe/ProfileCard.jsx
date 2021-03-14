import React, { useState, useMemo } from 'react';
import { Button } from 'reactstrap';
import TinderCard from 'react-tinder-card';
import './ProfileCard.css';

const db = [
  {
    name: 'Cory',
    url: require('assets/img/denys.jpg').default,
  },
  {
    name: 'Kevin',
    url: require('assets/img/fabien-bazanegue.jpg').default,
  },
  {
    name: 'Ed',
    url: require('assets/img/braden-collum.jpg').default,
  },
  {
    name: 'Perry',
    url: require('assets/img/john-price.jpg').default,
  },
  {
    name: 'Irving',
    url: require('assets/img/chester-wade.jpg').default,
  },
];

let charactersState = db; // This fixes issues with updating characters state forcing it to use the current state and not the state that was active when the card was created.

const ProfileCard = () => {
  const [characters, setCharacters] = useState(db);
  const [lastDirection, setLastDirection] = useState();
  const [alreadyRemoved, setAlreadyRemoved] = useState([]);

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    [],
  );

  const swiped = (direction, nameToDelete) => {
    console.log('removing: ' + nameToDelete);
    setLastDirection(direction);
    setAlreadyRemoved((oldArray) => [...oldArray, nameToDelete]);
  };

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!');
    charactersState = charactersState.filter(
      (character) => character.name !== name,
    );
    setCharacters(charactersState);
  };

  const swipe = (dir) => {
    const cardsLeft = characters.filter(
      (person) => !alreadyRemoved.includes(person.name),
    );
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].name; // Find the card object to be removed
      const index = db.map((person) => person.name).indexOf(toBeRemoved); // Find the index of which to make the reference to
      setAlreadyRemoved((oldArray) => [...oldArray, toBeRemoved]); // Make sure the next card gets removed next time if this card do not have time to exit the screen
      childRefs[index].current.swipe(dir); // Swipe the card!
    }
  };

  return (
    <div>
      <h1 className="profile-title text-left">Shotgun</h1>
      <div className="cardContainer">
        {characters.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="swipe"
            key={character.name}
            onSwipe={(dir) => swiped(dir, character.name)}
            onCardLeftScreen={() => outOfFrame(character.name)}
          >
            <div
              style={{ backgroundImage: 'url(' + character.url + ')' }}
              className="card"
            >
              <h3>{character.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="buttons">
        <Button className="btn btn-info" onClick={() => swipe('left')}>
          Swipe left!
        </Button>
        <Button className="btn btn-info" onClick={() => swipe('right')}>
          Swipe right!
        </Button>
      </div>
      {lastDirection ? (
        <h2 key={lastDirection} className="infoText">
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className="infoText">
          Swipe a card or press a button to get started!
        </h2>
      )}
    </div>
  );
};

export default ProfileCard;
