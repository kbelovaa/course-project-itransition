import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button, ButtonToolbar, Card, Container } from 'react-bootstrap';
import { IKImage } from 'imagekitio-react';
import { useTheme } from '../../hooks/useTheme';
import { setTotalCountCollectionAsync, setCollectionsAsync } from '../../store/actions/collectionActions';
import { deleteCollection } from '../../http/collectionAPI';
import { getUser } from '../../http/userAPI';
import {
  themeBgLight,
  themeColorLight,
  btnThemeVariantPrimary,
  btnThemeVariantDanger,
} from '../../constants/themeValues';
import CollectionModal from '../modals/CollectionModal';
import Pages from '../Pages';
import './styles.scss';

const Profile = () => {
  const dispatch = useDispatch();
  const collections = useSelector((state) => state.collection);
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editCollection, setEditCollection] = useState(null);
  const { theme } = useTheme();

  const navigate = useNavigate();
  const params = useParams();
  const userId = params.id;
  const token = localStorage.getItem('token') ? jwt_decode(localStorage.getItem('token')) : null;

  const urlEndpoint = process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT;

  useEffect(() => {
    getUser(userId).then((data) => setUser(data));
    dispatch(setTotalCountCollectionAsync(userId));
  }, [userId]);

  useEffect(() => {
    dispatch(setCollectionsAsync(userId, collections.page, collections.limit));
  }, [collections.page, userId]);

  const handleShow = () => setShowModal(true);

  const handleShowModify = (id) => {
    setEditCollection(id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    deleteCollection(id)
      .then(() => dispatch(setCollectionsAsync(userId)))
      .then(() => dispatch(setTotalCountCollectionAsync(userId)));
  };

  return (
    <Container className="container-wrap d-flex align-items-center flex-column">
      <h2 className={`text-${themeColorLight[theme]} m-3`}>
        {token !== null && userId == token.id ? 'Your' : `${user.name}'s`} collections
      </h2>
      <ButtonToolbar
        className={
          token !== null && (token.role === 'ADMIN' || userId == token.id) ? 'profile-button-toolbar' : 'd-none'
        }
      >
        <Button onClick={handleShow} className="m-2" variant="primary">
          Create new <FontAwesomeIcon icon={faPlus} />
        </Button>
      </ButtonToolbar>
      {collections.collections.length === 0 ? (
        <h4 className="mt-5">There are no collections</h4>
      ) : (
        <div className="mt-2 d-flex flex-wrap justify-content-center collection-wrap">
          {collections.collections.map((collection) => (
            <Card bg={themeBgLight[theme]} className={`${theme} collection-card`} key={collection.id}>
              <IKImage
                className="collection-icon"
                onClick={() => navigate(`/collection/${collection.id}`)}
                urlEndpoint={urlEndpoint}
                path={collection.img ?? 'noimage.jpg'}
                transformation={[
                  {
                    height: 400,
                    width: 400,
                  },
                ]}
              />
              <Card.Body className="collection-body" onClick={() => navigate(`/collection/${collection.id}`)}>
                <Card.Title>{collection.name}</Card.Title>
              </Card.Body>
              <Card.Footer
                className={
                  token !== null && (token.role === 'ADMIN' || userId == token.id)
                    ? 'd-flex justify-content-between'
                    : 'd-none'
                }
              >
                <Button variant={btnThemeVariantPrimary[theme]} onClick={() => handleShowModify(collection.id)}>
                  Edit
                </Button>
                <Button variant={btnThemeVariantDanger[theme]} onClick={() => handleDelete(collection.id)}>
                  Delete
                </Button>
              </Card.Footer>
            </Card>
          ))}
        </div>
      )}
      <Pages component="profile" />
      <CollectionModal
        show={showModal}
        setShow={setShowModal}
        collectionId={editCollection}
        setEditCollection={setEditCollection}
      />
    </Container>
  );
};

export default Profile;
