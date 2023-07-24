import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { useTheme } from '../../hooks/useTheme';
import { setUserAsync, setIsAuthAction } from '../../store/actions/userActions';
import { check } from '../../http/authAPI';
import NavBar from '../NavBar';
import Main from '../Main';
import Auth from '../Auth';
import UsersTable from '../UsersTable';
import Profile from '../Profile';
import Collection from '../Collection';
import Item from '../Item';
import SearchResult from '../SearchResult';
import './styles.scss';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const { theme, setTheme } = useTheme();

  const userRole = localStorage.getItem('token') ? jwt_decode(localStorage.getItem('token')).role : user.role;
  const userTheme = localStorage.getItem('theme');

  useEffect(() => {
    if (localStorage.getItem('token')) {
      check().then((data) => {
        if (data === 'deleted' || data === 'blocked') {
          dispatch(setIsAuthAction(false));
        } else {
          dispatch(setUserAsync(data));
          dispatch(setIsAuthAction(true));
        }
      });
    }
    if (userTheme === 'dark') {
      setTheme(theme);
    }
  }, []);

  return (
    <div className={`bg-${theme} content`}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/registration" element={<Auth />} />
          {userRole === 'ADMIN' && <Route path="/users" element={<UsersTable />} />}
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/collection/:id" element={<Collection />} />
          <Route path="/item/:id" element={<Item />} />
          <Route path="/results/:tagId" element={<SearchResult />} />
          <Route path="/*" element={<Navigate to={'/'} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
