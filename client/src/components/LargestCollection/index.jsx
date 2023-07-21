import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Container, ListGroup } from 'react-bootstrap';
import { IKImage } from 'imagekitio-react';
import { useTheme } from '../../hooks/useTheme';
import { getLargestCollections } from '../../http/collectionAPI';
import { themeBgLight, themeColorLight } from '../../constants/themeValues';
import './styles.scss';

const LargestCollection = () => {
  const [collections, setCollections] = useState([]);
  const [users, setUsers] = useState([]);

  const { theme } = useTheme();

  const navigate = useNavigate();

  useEffect(() => {
    getLargestCollections(5).then((data) => {
      setCollections(data.collections);
      setUsers(data.users);
    });
  }, []);

  const urlEndpoint = process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT;

  return (
    <Container className="d-flex align-items-center flex-column mb-5">
      <h2 className={`text-${themeColorLight[theme]} mt-5`}>Top 5 biggest collections</h2>
      <div className="mt-2 d-flex flex-wrap">
        {collections.map((collection) => (
          <Card
            bg={themeBgLight[theme]}
            onClick={() => navigate(`/collection/${collection.collection.id}`)}
            className={`${theme} collection-card m-2`}
            key={collection.collection.id}
          >
            <IKImage
              className="collection-icon"
              urlEndpoint={urlEndpoint}
              path={collection.collection.img ?? 'noimage.jpg'}
              transformation={[
                {
                  height: 400,
                  width: 400,
                },
              ]}
            />
            <Card.Body className="collection-body">
              <Card.Title>{collection.collection.name}</Card.Title>
              <Card.Text>
                {collection.collection.description.length > 90
                  ? collection.collection.description.slice(0, 90) + '...'
                  : collection.collection.description}
              </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroup.Item className={`bg-${themeBgLight[theme]} collection-number`}>
                {collection.itemsCount} items
              </ListGroup.Item>
              <ListGroup.Item className={`bg-${themeBgLight[theme]} collection-author`}>
                Author: {users.filter((user) => user.id === collection.collection.userId)[0].name}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default LargestCollection;
