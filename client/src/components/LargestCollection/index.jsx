import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Container, ListGroup } from 'react-bootstrap';
import { IKImage } from 'imagekitio-react';
import { getLargestCollections } from '../../http/collectionAPI';
import './styles.scss';

const LargestCollection = () => {
  const [collections, setCollections] = useState([]);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getLargestCollections(5)
    .then((data) => {
      setCollections(data.collections);
      setUsers(data.users);
    });
  }, []);

  const urlEndpoint = process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT;

  return (
    <Container className="d-flex align-items-center flex-column mb-5">
      <h2 className='mt-5'>Top 5 biggest collections</h2>
      <div className="mt-2 d-flex flex-wrap">
          {collections.map((collection) => (
            <Card onClick={() => navigate(`/collection/${collection.collection.id}`)} className="collection-card m-2" key={collection.collection.id}>
              <IKImage
                urlEndpoint={urlEndpoint}
                path={collection.collection.img ?? 'noimage.jpg'}
                transformation={[
                  {
                    height: 400,
                    width: 400,
                  },
                ]}
              />
              <Card.Body>
                <Card.Title>{collection.collection.name}</Card.Title>
                <Card.Text>
                  {collection.collection.description.length > 90
                    ? collection.collection.description.slice(0, 90) + '...'
                    : collection.collection.description}
                </Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>{collection.itemsCount} items</ListGroup.Item>
                <ListGroup.Item>Author: {users.filter((user) => user.id === collection.collection.userId)[0].name}</ListGroup.Item>
              </ListGroup>
            </Card>
          ))}
        </div>
    </Container>
  );
};

export default LargestCollection;
