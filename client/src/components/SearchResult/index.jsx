import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useTheme } from '../../hooks/useTheme';
import { getItemsByTag } from '../../http/itemAPI';
import { themeColorLight } from '../../constants/themeValues';
import ItemCard from '../ItemCard';
import './styles.scss';

const SearchResult = () => {
  const [items, setItems] = useState([]);
  const [tag, setTag] = useState({});

  const params = useParams();
  const tagId = params.tagId;

  const { theme } = useTheme();

  useEffect(() => {
    getItemsByTag(tagId).then((data) => {
      setItems(data.items);
      setTag(data.tag);
    });
  }, []);

  return (
    <Container className="container-wrap d-flex align-items-center flex-column">
      <h2 className={`text-${themeColorLight[theme]} m-3`}>Items with tag #{tag.name}</h2>
      <div className="d-flex flex-wrap justify-content-center items-wrap">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </Container>
  );
};

export default SearchResult;
