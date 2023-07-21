import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Accordion, Button, ButtonToolbar, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { IKImage } from 'imagekitio-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark, faPen, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { MaterialReactTable } from 'material-react-table';
import { useTheme } from '../../hooks/useTheme';
import { getCollection, deleteCollection } from '../../http/collectionAPI';
import { getUser } from '../../http/userAPI';
import { deleteItem } from '../../http/itemAPI';
import { setItemsAsync } from '../../store/actions/itemActions';
import { themeColorLight, themeBgLight } from '../../constants/themeValues';
import ItemModal from '../modals/ItemModal';
import CollectionModal from '../modals/CollectionModal';
import './styles.scss';

const Collection = () => {
  const dispatch = useDispatch();
  const collections = useSelector((state) => state.collection);
  const items = useSelector((state) => state.item);
  const [collection, setCollection] = useState({});
  const [user, setUser] = useState({});
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editCollection, setEditCollection] = useState(null);
  const [columns, setColumns] = useState([]);

  const { theme } = useTheme();

  const navigate = useNavigate();
  const params = useParams();
  const collectionId = params.id;
  const token = localStorage.getItem('token') ? jwt_decode(localStorage.getItem('token')) : null;

  const urlEndpoint = process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT;

  useEffect(() => {
    getCollection(collectionId).then((data) => {
      if (data) {
        setCollection(data);
        getUser(data.userId).then((data) => setUser(data));
        const col = [
          ['name', 'Name'],
          ...Object.entries(data)
            .slice(8, 11)
            .filter(([key, value]) => value),
          ...Object.entries(data)
            .slice(17, 20)
            .filter(([key, value]) => value),
        ].map(([key, value]) => ({
          accessorKey: key,
          header: value[0].toUpperCase() + value.slice(1),
          filterVariant: 'text',
          Cell: ({ cell }) => (key.includes('date') ? new Date(cell.getValue()).toLocaleDateString() : cell.getValue()),
        }));
        setColumns(col);
      }
    });
  }, [collectionId, collections]);

  useEffect(() => {
    dispatch(setItemsAsync(collectionId));
  }, [collectionId]);

  const handleShowItemModal = () => setShowItemModal(true);

  const handleShowModifyCollection = (id) => {
    setEditCollection(id);
    setShowCollectionModal(true);
  };

  const handleDeleteCollection = (id) => {
    deleteCollection(id).then(() => navigate(`/profile/${user.id}`));
  };

  const handleShowModifyItem = (rowId) => {
    setEditItem(items.items[rowId].id);
    setShowItemModal(true);
  };

  const handleDeleteItem = (rowId) => {
    deleteItem(items.items[rowId].id).then(() => dispatch(setItemsAsync(collectionId)));
  };

  const renderAuthorTooltip = (props) => (
    <Tooltip id="button-tooltip-author" {...props}>
      View all {`${user.name}'s`} collections
    </Tooltip>
  );

  const renderItemTooltip = (props) => (
    <Tooltip id="button-tooltip-item" {...props}>
      View item card
    </Tooltip>
  );

  const renderModifyTooltip = (props) => (
    <Tooltip id="button-tooltip-modify" {...props}>
      Edit item
    </Tooltip>
  );

  const renderDeleteTooltip = (props) => (
    <Tooltip id="button-tooltip-delete" {...props}>
      Delete item
    </Tooltip>
  );

  return (
    <Container className="container-wrap d-flex align-items-center flex-column">
      <h2 className={`text-${themeColorLight[theme]} m-3`}>{collection.name && `"${collection.name}" collection`}</h2>
      <div className="d-flex">
        <IKImage
          urlEndpoint={urlEndpoint}
          path={collection.img ?? 'noimage.jpg'}
          transformation={[
            {
              height: 400,
              width: 400,
            },
          ]}
          className="collection-image"
        />
        <div>
          <Accordion className="collection-info" defaultActiveKey="0">
            <Accordion.Item>
              <Accordion.Header className={theme}>Author</Accordion.Header>
              <OverlayTrigger placement="left" delay={{ show: 250, hide: 250 }} overlay={renderAuthorTooltip}>
                <Accordion.Body
                  className={`bg-${themeBgLight[theme]} collection-author`}
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  {user.name}
                </Accordion.Body>
              </OverlayTrigger>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header className={theme}>Description</Accordion.Header>
              <Accordion.Body className={`bg-${themeBgLight[theme]}`}>{collection.description}</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item
              eventKey="2"
              className={token !== null && (token.role === 'ADMIN' || user.id == token.id) ? '' : 'd-none'}
            >
              <Accordion.Header className={theme}>Custom fields</Accordion.Header>
              <Accordion.Body className={`bg-${themeBgLight[theme]}`}>
                {Object.values(collection)
                  .slice(5, 20)
                  .filter((field) => field).length === 0
                  ? '—'
                  : Object.values(collection)
                      .slice(5, 20)
                      .filter((field) => field)
                      .join(', ')}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <ButtonToolbar className={token !== null && (token.role === 'ADMIN' || user.id == token.id) ? '' : 'd-none'}>
            <Button onClick={handleShowItemModal} className="m-2" variant="primary">
              Add item <FontAwesomeIcon icon={faPlus} />
            </Button>
            <Button onClick={() => handleShowModifyCollection(collection.id)} className="m-2" variant="secondary">
              Edit <FontAwesomeIcon icon={faPen} />
            </Button>
            <Button onClick={() => handleDeleteCollection(collection.id)} className="m-2" variant="danger">
              Delete <FontAwesomeIcon icon={faXmark} />
            </Button>
          </ButtonToolbar>
        </div>
      </div>
      {items.items.length === 0 ? (
        <h4 className={`text-${themeColorLight[theme]} mt-5`}>There are no items</h4>
      ) : (
        <div className="collection-table">
          <h3 className={`text-${themeColorLight[theme]} m-3 text-center`}>Collection items</h3>
          {columns[0] && (
            <MaterialReactTable
              className={`${theme} filter-table`}
              columns={columns}
              data={items.items}
              enableFacetedValues
              initialState={{ showColumnFilters: true }}
              enableRowActions
              positionActionsColumn="last"
              renderRowActions={({ row }) => (
                <div className="d-flex">
                  <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 250 }} overlay={renderItemTooltip}>
                    <Button
                      onClick={() => navigate(`/item/${items.items[row.index].id}`)}
                      variant="primary"
                      size="sm"
                      className="m-1"
                    >
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 250 }} overlay={renderModifyTooltip}>
                    <Button
                      className={token !== null && (token.role === 'ADMIN' || user.id == token.id) ? 'm-1' : 'd-none'}
                      onClick={() => handleShowModifyItem(row.index)}
                      variant="secondary"
                      size="sm"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 250 }} overlay={renderDeleteTooltip}>
                    <Button
                      className={token !== null && (token.role === 'ADMIN' || user.id == token.id) ? 'm-1' : 'd-none'}
                      onClick={() => handleDeleteItem(row.index)}
                      variant="danger"
                      size="sm"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </Button>
                  </OverlayTrigger>
                </div>
              )}
            />
          )}
        </div>
      )}
      <ItemModal
        show={showItemModal}
        setShow={setShowItemModal}
        itemId={editItem}
        setEditItem={setEditItem}
        collectionId={collectionId}
      />
      <CollectionModal
        show={showCollectionModal}
        setShow={setShowCollectionModal}
        collectionId={editCollection}
        setEditCollection={setEditCollection}
      />
    </Container>
  );
};

export default Collection;
