import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { Button, ButtonToolbar, Container, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlock, faUserXmark, faUserGear, faUser, faImages } from '@fortawesome/free-solid-svg-icons';
import { changeStatus, remove, changeRole } from '../../http/userAPI';
import { setUsersAction, setUsersAsync, setTotalCountTableAsync } from '../../store/actions/tableActions';
import { setUserAction, setIsAuthAction } from '../../store/actions/userActions';
import { fetchUsers } from '../../http/userAPI';
import Pages from '../Pages';
import './styles.scss';

const UsersTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const table = useSelector((state) => state.table);
  const [masterChecked, setMasterChecked] = useState(false);
  const [selectedList, setSelectedList] = useState([]);

  useEffect(() => {
    dispatch(setTotalCountTableAsync());
  }, []);

  useEffect(() => {
    fetchUsers(table.page, table.limit).then((data) => {
      dispatch(setUsersAction(data.rows));
      data.rows.every((user) => {
        if (!selectedList.includes(user.id)) {
          setMasterChecked(false);
          return false;
        }
      });
    });
  }, [table.page]);

  const logOut = () => {
    dispatch(setUserAction({}));
    dispatch(setIsAuthAction(false));
    localStorage.removeItem('token');
  };

  const setStatus = (status) => {
    if (selectedList.length > 0) {
      changeStatus(selectedList, status)
        .then(() => dispatch(setUsersAsync(table.page, table.limit)))
        .then(() => {
          if (status === 'blocked' && selectedList.includes(jwt_decode(localStorage.getItem('token')).id)) {
            logOut();
          }
        });
    }
  };

  const setRole = (role) => {
    if (selectedList.length > 0) {
      changeRole(selectedList, role)
        .then(() => dispatch(setUsersAsync(table.page, table.limit)))
        .then(() => {
          if (role === 'USER' && selectedList.includes(jwt_decode(localStorage.getItem('token')).id)) {
            logOut();
          }
        });
    }
  };

  const deleteUser = () => {
    if (selectedList.length > 0) {
      remove(selectedList)
      .then(() => {
        dispatch(setUsersAsync(table.page, table.limit));
        dispatch(setTotalCountTableAsync());
      })
      .then(() => {
        if (selectedList.includes(jwt_decode(localStorage.getItem('token')).id)) {
          logOut();
        }
      });
    }
  };

  const onMasterCheck = (e) => {
    const selectedIds = e.target.checked ? table.users.map((user) => user.id) : [];
    setSelectedList(selectedIds);
    setMasterChecked(e.target.checked);
  };

  const onItemCheck = (e, id) => {
    const selectedIds = e.target.checked ? [...selectedList, id] : [...selectedList.filter((item) => item !== id)];
    setSelectedList(selectedIds);
    setMasterChecked(table.users.length === selectedIds.length);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      View collections
    </Tooltip>
  );

  return (
    <Container className="d-flex align-items-center flex-column">
      <ButtonToolbar className="users-button-toolbar">
        <Button onClick={() => setStatus('blocked')} className="m-2" variant="secondary">
          Block <FontAwesomeIcon icon={faLock} />
        </Button>
        <Button onClick={() => setStatus('active')} className="m-2" variant="secondary">
          Unblock <FontAwesomeIcon icon={faUnlock} />
        </Button>
        <Button onClick={deleteUser} className="m-2" variant="secondary">
          Delete <FontAwesomeIcon icon={faUserXmark} />
        </Button>
        <Button onClick={() => setRole('ADMIN')} className="m-2" variant="secondary">
          Add to admins <FontAwesomeIcon icon={faUserGear} />
        </Button>
        <Button onClick={() => setRole('USER')} className="m-2" variant="secondary">
          Remove from admins <FontAwesomeIcon icon={faUser} />
        </Button>
      </ButtonToolbar>
      <Table className="users-table mt-3" striped bordered hover>
        <thead>
          <tr>
            <th className="text-center">
              <input
                type="checkbox"
                className="form-check-input"
                checked={masterChecked}
                onChange={(e) => onMasterCheck(e)}
              />
            </th>
            <th>id</th>
            <th>Name</th>
            <th>e-mail</th>
            <th>Status</th>
            <th>Role</th>
            <th className="text-center">Collections</th>
          </tr>
        </thead>
        <tbody>
          {table.users.map((user) => (
            <tr key={user.id}>
              <td className="text-center" scope="row">
                <input
                  type="checkbox"
                  checked={selectedList.includes(user.id)}
                  className="form-check-input"
                  onChange={(e) => onItemCheck(e, user.id)}
                />
              </td>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>{user.role}</td>
              <td className="text-center">
                <OverlayTrigger placement="right" delay={{ show: 250, hide: 250 }} overlay={renderTooltip}>
                  <Button onClick={() => navigate(`/profile/${user.id}`)} variant="secondary">
                    <FontAwesomeIcon icon={faImages} />
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pages component="usersTable" />
    </Container>
  );
};

export default UsersTable;
