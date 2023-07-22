import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../hooks/useTheme';
import { setUserAction, setIsAuthAction } from '../../store/actions/userActions';
import { navBarThemeVariant, themeBgDark, themeColorDark } from '../../constants/themeValues';
import './styles.scss';

const NavBar = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.user.isAuth);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const logOut = () => {
    dispatch(setUserAction({}));
    dispatch(setIsAuthAction(false));
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleThemeSwitch = () => {
    setTheme(theme);
    localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Navbar className="justify-content-between" bg={themeBgDark[theme]} variant="dark">
      <Navbar.Brand className={`${themeColorDark[theme]} navbar-title ms-4`} href="/">
        Collections
      </Navbar.Brand>
      {isAuth ? (
        <Nav className="align-items-center">
          <Button onClick={handleThemeSwitch} variant={navBarThemeVariant[theme]} className="theme-switcher m-2">
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
          </Button>
          {user.role === 'ADMIN' ? (
            <Button className="m-2" variant={navBarThemeVariant[theme]} onClick={() => navigate('/users')}>
              Users
            </Button>
          ) : (
            <></>
          )}
          <Button className="m-2" variant={navBarThemeVariant[theme]} onClick={() => navigate(`/profile/${user.id}`)}>
            Profile
          </Button>
          <Button className="m-2" variant={navBarThemeVariant[theme]} onClick={logOut}>
            Log out
          </Button>
        </Nav>
      ) : (
        <Nav className="align-items-center">
          <Button onClick={handleThemeSwitch} variant={navBarThemeVariant[theme]} className="theme-switcher m-2">
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
          </Button>
          <Button className="m-2" variant={navBarThemeVariant[theme]} onClick={() => navigate('/registration')}>
            Sign up
          </Button>
          <Button className="m-2" variant={navBarThemeVariant[theme]} onClick={() => navigate('/login')}>
            Log in
          </Button>
        </Nav>
      )}
    </Navbar>
  );
};

export default NavBar;
