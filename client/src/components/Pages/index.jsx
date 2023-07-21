import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination } from 'react-bootstrap';
import { setPageTableAction } from '../../store/actions/tableActions';
import { setPageCollectionAction } from '../../store/actions/collectionActions';

const Pages = ({ component }) => {
  const dispatch = useDispatch();

  const table = useSelector((state) => state.table);
  const collection = useSelector((state) => state.collection);

  let elem;
  let handleClick;
  switch (component) {
    case 'usersTable':
      elem = table;
      handleClick = (page) => dispatch(setPageTableAction(page));
      break;
    case 'profile':
      elem = collection;
      handleClick = (page) => dispatch(setPageCollectionAction(page));
      break;
    default:
      elem = null;
      handleClick = null;
  }

  const pageCount = Math.ceil(elem.totalCount / elem.limit);
  const pages = [];

  for (let i = 0; i < pageCount; i++) {
    pages.push(i + 1);
  }

  return (
    <Pagination className="mt-3">
      {pages.map((page) => (
        <Pagination.Item key={page} active={elem.page === page} onClick={() => handleClick(page)}>
          {page}
        </Pagination.Item>
      ))}
    </Pagination>
  );
};

export default Pages;
