import React, { useState, useMemo } from 'react';
import { Button } from 'reactstrap';
import TinderCard from 'react-tinder-card';
import 'assets/css/profile-card.css';
import denys from 'assets/img/denys.jpg';
import fabien from 'assets/img/fabien-bazanegue.jpg';
import braden from 'assets/img/braden-collum.jpg';
import john from 'assets/img/john-price.jpg';
import chester from 'assets/img/chester-wade.jpg';

const db = [
  {
    name: 'Cory',
    url: denys,
  },
  {
    name: 'Kevin',
    url: fabien,
  },
  {
    name: 'Ed',
    url: braden,
  },
  {
    name: 'Perry',
    url: john,
  },
  {
    name: 'Irving',
    url: chester,
  },
];

// This fixes issues with updating characters state forcing it to
// use the current state and not the state that was active when the card was created.
let charactersState = db;

const ProfileCard = () => {
  const [characters, setCharacters] = useState(db);
  const [lastDirection, setLastDirection] = useState();
  const [alreadyRemoved, setAlreadyRemoved] = useState([]);

  const childRefs = useMemo(
    () => Array(db.length)
      .fill(0)
    // eslint-disable-next-line no-unused-vars
      .map((i) => React.createRef()),
    [],
  );

  const swiped = (direction, nameToDelete) => {
    setLastDirection(direction);
    setAlreadyRemoved((oldArray) => [...oldArray, nameToDelete]);
  };

  const outOfFrame = (name) => {
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
      // Find the card object to be removed
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].name;

      // Find the index of which to make the reference to
      const index = db.map((person) => person.name).indexOf(toBeRemoved);

      // Make sure the next card gets removed next time if
      // this card do not have time to exit the screen
      setAlreadyRemoved((oldArray) => [...oldArray, toBeRemoved]);
      // Swipe the card!
      childRefs[index].current.swipe(dir);
    }
  };

  return (
    <div>
      <h1 className="profile-title text-left">Shotgun</h1>
      <div className="swipe-card-container">
        {characters.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="swipe"
            key={character.name}
            onSwipe={(dir) => swiped(dir, character.name)}
            onCardLeftScreen={() => outOfFrame(character.name)}
          >
            <div
              style={{ backgroundImage: `url(${character.url})` }}
              className="swipe-card"
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
        <h2 key={lastDirection} className="info-text">
          You swiped
          {' '}
          {lastDirection}
        </h2>
      ) : (
        <h2 className="info-text">
          Swipe a card or press a button to get started!
        </h2>
      )}
    </div>
  );
};

export default ProfileCard;
