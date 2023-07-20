import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { login, registration } from '../../http/authAPI';
import { getUser } from '../../http/userAPI';
import { setUserAction, setIsAuthAction } from '../../store/actions/userActions';
import './styles.scss';

const Auth = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState(' ');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (isLogin) {
        data = await login(email, password);
      } else {
        const userName = name[0].toUpperCase() + name.slice(1);
        data = await registration(userName, email, password);
      }
      getUser(data.id).then((data) => dispatch(setUserAction(data)));
      dispatch(setIsAuthAction(true));
      navigate('/');
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  return (
    <Container className="auth-container d-flex justify-content-center align-items-center">
      <Card className="auth-card p-5">
        <h2 className="m-auto">{isLogin ? 'Authorization' : 'Registration'}</h2>
        <Form onSubmit={handleSubmit} className="d-flex flex-column">
          {isLogin ? (
            <></>
          ) : (
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-3"
              type="text"
              placeholder="Enter your name"
              required
            />
          )}
          <Form.Control
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-3"
            type="email"
            placeholder="Enter your e-mail"
            required
          />
          <Form.Control
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-3"
            type="password"
            placeholder="Enter your password"
            aria-describedby="message"
            required
          />
          <Form.Text id="message" className="text-danger">
            {message}
          </Form.Text>
          <Button type="submit" className="mt-3 mb-3" variant="outline-primary">
            {isLogin ? 'Log in' : 'Register'}
          </Button>
          {isLogin ? (
            <div className="auth-hint">
              <NavLink to={'/registration'} className="auth-link">
                Register
              </NavLink>{' '}
              if you don't have an account
            </div>
          ) : (
            <div className="auth-hint">
              <NavLink to={'/login'} className="auth-link">
                Log in
              </NavLink>{' '}
              if you have an account
            </div>
          )}
        </Form>
      </Card>
    </Container>
  );
};

export default Auth;
