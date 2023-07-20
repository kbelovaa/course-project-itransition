import React, { useEffect, useState }from 'react';
import { Container, Table } from 'react-bootstrap';
import { getLatestItems } from '../../http/itemAPI';
import './styles.scss';

const LatestItems = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getLatestItems(5)
    .then((data) => setItems(data));
  }, []);

  return (
    <Container className="d-flex align-items-center flex-column">
      <h2 className='mt-3'>Last added items</h2>
      <Table className="items-table mt-3" striped bordered hover>
        <thead>
          <tr>
            <th>Item name</th>
            <th>Collection</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.collection.name}</td>
              <td>{item.collection.user.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default LatestItems;
