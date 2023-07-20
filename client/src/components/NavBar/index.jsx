import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { setUserAction, setIsAuthAction } from '../../store/actions/userActions';

const NavBar = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.user.isAuth);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const logOut = () => {
    dispatch(setUserAction({}));
    dispatch(setIsAuthAction(false));
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Navbar className="justify-content-between" bg="dark" variant="dark">
      <Navbar.Brand className="ms-4" href="/">
        Collections
      </Navbar.Brand>
      {isAuth ? (
        <Nav>
          {user.role === 'ADMIN' ? (
            <Button className="m-2" variant="outline-light" onClick={() => navigate('/users')}>
              Users
            </Button>
          ) : (
            <></>
          )}
          <Button className="m-2" variant="outline-light" onClick={() => navigate(`/profile/${user.id}`)}>
            Profile
          </Button>
          <Button className="m-2" variant="outline-light" onClick={logOut}>
            Log out
          </Button>
        </Nav>
      ) : (
        <Nav>
          <Button className="m-2" variant="outline-light" onClick={() => navigate('/registration')}>
            Sign up
          </Button>
          <Button className="m-2" variant="outline-light" onClick={() => navigate('/login')}>
            Log in
          </Button>
        </Nav>
      )}
    </Navbar>
  );
};

export default NavBar;
