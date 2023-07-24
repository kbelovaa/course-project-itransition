import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { useTheme } from '../../hooks/useTheme';
import { getItem } from '../../http/itemAPI';
import { getCollection } from '../../http/collectionAPI';
import { getUser } from '../../http/userAPI';
import { themeBgLight } from '../../constants/themeValues';
import './styles.scss';

const ItemCard = ({ item }) => {
  const [tags, setTags] = useState([]);
  const [collection, setCollection] = useState({});
  const [user, setUser] = useState({});

  const navigate = useNavigate();

  const { theme } = useTheme();

  useEffect(() => {
    getItem(item.id).then((data) => {
      setTags(data.tags.map((tag) => tag.name));
      getCollection(data.item.collectionId).then((data) => {
        setCollection(data);
        getUser(data.userId).then((data) => setUser(data));
      });
    });
  }, []);

  return (
    <Card onClick={() => navigate(`/item/${item.id}`)} bg={themeBgLight[theme]} className={`${theme} item-card`}>
      <Card.Body className="item-body">
        <Card.Title className="item-title">{item.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted item-subtitle">Collection: {collection.name}</Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted item-subtitle">Author: {user.name}</Card.Subtitle>
        <Card.Text className={`bg-${themeBgLight[theme]} rti--container item-tags-wrap`}>
          {tags.map((tag) => (
            <span key={tag} className="rti--tag mt-1">
              #{tag}
            </span>
          ))}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ItemCard;
