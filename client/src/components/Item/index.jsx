import io from 'socket.io-client';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { Button, ButtonToolbar, Container, ListGroup, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { TagsInput } from 'react-tag-input-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPen, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../hooks/useTheme';
import { getItem } from '../../http/itemAPI';
import { getCollection } from '../../http/collectionAPI';
import { getUser } from '../../http/userAPI';
import { deleteItem } from '../../http/itemAPI';
import { changeLike, getLike, fetchLikes } from '../../http/likeAPI';
import { themeColorLight, themeBgLight, themeListGroupVariant } from '../../constants/themeValues';
import Comments from '../Comments';
import ItemModal from '../modals/ItemModal';
import './styles.scss';

const socket = io.connect(process.env.REACT_APP_API_URL);

const Item = () => {
  const items = useSelector((state) => state.item);
  const [item, setItem] = useState({});
  const [tags, setTags] = useState([]);
  const [collection, setCollection] = useState({});
  const [user, setUser] = useState({});
  const [showItemModal, setShowItemModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeQuantity, setLikeQuantity] = useState(0);

  const { theme } = useTheme();

  const navigate = useNavigate();
  const params = useParams();
  const itemId = params.id;
  const token = localStorage.getItem('token') ? jwt_decode(localStorage.getItem('token')) : null;

  const customFields = Object.entries(collection)
    .slice(5, 20)
    .filter(([key, value]) => value);

  useEffect(() => {
    getItem(itemId).then((data) => {
      setItem(data.item);
      setTags(data.tags.map((tag) => tag));
      getCollection(data.item.collectionId).then((data) => {
        setCollection(data);
        getUser(data.userId).then((data) => setUser(data));
      });
      token && getLike(token.id, data.item.id).then((data) => setIsLiked(!!data));
    });
  }, [itemId, items]);

  useEffect(() => {
    fetchLikes(itemId).then((data) => setLikeQuantity(data));
  }, [isLiked, item]);

  const handleLike = () => {
    if (token) {
      changeLike(token.id, item.id).then((data) => setIsLiked(!data));
    }
  };

  const handleShowModifyItem = () => {
    setEditItem(item.id);
    setShowItemModal(true);
  };

  const handleDeleteItem = () => {
    deleteItem(item.id).then(() => navigate(`/collection/${collection.id}`));
  };

  const renderCollectionTooltip = (props) => (
    <Tooltip id="button-tooltip-author" {...props}>
      View all collection items
    </Tooltip>
  );

  const renderAuthorTooltip = (props) => (
    <Tooltip id="button-tooltip-author" {...props}>
      View all {`${user.name}'s`} collections
    </Tooltip>
  );

  return (
    <Container className="container-wrap d-flex align-items-center flex-column">
      <h2 className={`text-${themeColorLight[theme]} m-3`}>{item.name}</h2>
      <div className="d-flex align-items-start flex-column-reverse flex-md-row">
        <div className="me-3">
          <ListGroup className="item-info">
            <ListGroup.Item variant={themeListGroupVariant[theme]}>
              <OverlayTrigger placement="left" delay={{ show: 250, hide: 250 }} overlay={renderCollectionTooltip}>
                <div onClick={() => navigate(`/collection/${collection.id}`)} className="ms-2 me-auto">
                  <div className="fw-bold">Collection</div>
                  {collection.name}
                </div>
              </OverlayTrigger>
            </ListGroup.Item>
            <ListGroup.Item className={`bg-${themeBgLight[theme]}`}>
              <OverlayTrigger placement="left" delay={{ show: 250, hide: 250 }} overlay={renderAuthorTooltip}>
                <div onClick={() => navigate(`/profile/${user.id}`)} className="ms-2 me-auto">
                  <div className="fw-bold">Author</div>
                  {user.name}
                </div>
              </OverlayTrigger>
            </ListGroup.Item>
            <ListGroup.Item className={`bg-${themeBgLight[theme]}`}>
              <div className="ms-2 me-auto">
                <div className="fw-bold">Tags</div>
                <div className={`bg-${themeBgLight[theme]} rti--container item-tags-wrap`}>
                  {tags.map((tag) => (
                    <span onClick={() => navigate(`/results/${tag.id}`)} key={tag.id} className="rti--tag mt-1">
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </ListGroup.Item>
          </ListGroup>
          <ButtonToolbar className="align-items-center justify-content-between">
            <div className={`text-${themeColorLight[theme]} d-flex align-items-center`}>
              <FontAwesomeIcon
                onClick={handleLike}
                icon={faHeart}
                className={
                  token === null
                    ? `${theme} like m-2`
                    : isLiked
                    ? `${theme} like-available like-active m-2`
                    : `${theme} like-available like-not-active m-2`
                }
              />
              {likeQuantity}
            </div>
            <div>
              <Button
                onClick={handleShowModifyItem}
                className={token !== null && (token.role === 'ADMIN' || user.id == token.id) ? 'm-2' : 'd-none'}
                variant="secondary"
              >
                Edit <FontAwesomeIcon icon={faPen} />
              </Button>
              <Button
                onClick={handleDeleteItem}
                className={token !== null && (token.role === 'ADMIN' || user.id == token.id) ? 'm-2' : 'd-none'}
                variant="danger"
              >
                Delete <FontAwesomeIcon icon={faXmark} />
              </Button>
            </div>
          </ButtonToolbar>
        </div>
        <Table variant={theme} striped bordered hover className={customFields.length === 0 ? 'd-none' : 'item-table'}>
          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {customFields.map(([key, value], index) => (
              <tr key={index}>
                <td>{value[0].toUpperCase() + value.slice(1)}</td>
                <td>
                  {item[key] === null
                    ? '—'
                    : item[key] === false
                    ? 'No'
                    : item[key] === true
                    ? 'Yes'
                    : key.includes('dateField')
                    ? new Date(item[key]).toLocaleDateString()
                    : item[key]}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Comments socket={socket} itemId={itemId} userId={user.id} />
      <ItemModal
        show={showItemModal}
        setShow={setShowItemModal}
        itemId={editItem}
        setEditItem={setEditItem}
        collectionId={collection.id}
      />
    </Container>
  );
};

export default Item;
