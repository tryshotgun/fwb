import React, { useEffect, useRef } from 'react';

import { Container } from 'reactstrap';

import DemoFooter from 'components/Footers/DemoFooter.js';
import ProfileCard from 'components/Swipe/ProfileCard';
import 'components/Swipe/ProfileCard.css';

const SwipePage = () => {
  const wrapper = useRef(null);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    wrapper.current.scrollTop = 0;
    document.body.classList.add('index-page');
    return function cleanup() {
      document.body.classList.remove('index-page');
    };
  }, []);

  return (
    <>
      <div className="wrapper" ref={wrapper}>
        <>
          <div className="page-header">
            <div className="squares square1" />
            <div className="squares square2" />
            <div className="squares square3" />
            <div className="squares square4" />
            <div className="squares square5" />
            <div className="squares square6" />
            <div className="squares square7" />
            <Container className="app">
              <ProfileCard />
            </Container>
          </div>
        </>
        <DemoFooter />
      </div>
    </>
  );
};

export default SwipePage;
