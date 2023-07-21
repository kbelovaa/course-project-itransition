import React from 'react';
import { Container } from 'react-bootstrap';
import LatestItems from '../LatestItems';
import LargestCollection from '../LargestCollection';
import TagsCloud from '../TagsCloud';

const Main = () => {
  return (
    <Container className="container-wrap d-flex align-items-center flex-column">
      <TagsCloud />
      <LatestItems />
      <LargestCollection />
    </Container>
  );
};

export default Main;
