import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { useTheme } from '../../hooks/useTheme';
import { getLatestItems } from '../../http/itemAPI';
import { themeColorLight } from '../../constants/themeValues';
import './styles.scss';

const LatestItems = () => {
  const [items, setItems] = useState([]);
  const { theme } = useTheme();

  const navigate = useNavigate();

  useEffect(() => {
    getLatestItems(5).then((data) => setItems(data));
  }, []);

  const renderItemTooltip = (props) => (
    <Tooltip id="button-tooltip-item" {...props}>
      View item card
    </Tooltip>
  );

  const renderCollectionTooltip = (props) => (
    <Tooltip id="button-tooltip-collection" {...props}>
      View all collection items
    </Tooltip>
  );

  const renderAuthorTooltip = (props) => (
    <Tooltip id="button-tooltip-author" {...props}>
      View all author collections
    </Tooltip>
  );

  return (
    <Container className="d-flex align-items-center flex-column">
      <h2 className={`text-${themeColorLight[theme]} mt-3`}>Last added items</h2>
      <Table className="items-table mt-3" variant={theme} striped bordered hover>
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
              <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 250 }} overlay={renderItemTooltip}>
                <td className="items-row" onClick={() => navigate(`/item/${item.id}`)}>
                  {item.name}
                </td>
              </OverlayTrigger>
              <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 250 }} overlay={renderCollectionTooltip}>
                <td className="items-row" onClick={() => navigate(`/collection/${item.collectionId}`)}>
                  {item.collection.name}
                </td>
              </OverlayTrigger>
              <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 250 }} overlay={renderAuthorTooltip}>
                <td className="items-row" onClick={() => navigate(`/profile/${item.collection.userId}`)}>
                  {item.collection.user.name}
                </td>
              </OverlayTrigger>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default LatestItems;
