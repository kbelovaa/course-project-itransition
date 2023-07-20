import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import parseISO from "date-fns/parseISO";
import formatDistance from "date-fns/formatDistance";
import { Button, Card, Container, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Scrollbar } from 'react-scrollbars-custom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { createComment, fetchComments, deleteComment } from '../../http/commentAPI';
import './styles.scss';

const Comments = ({ socket, itemId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token') ? jwt_decode(localStorage.getItem('token')) : null;

  useEffect(() => {
    fetchComments(itemId)
    .then((data) => setComments(data));
  }, []);

  useEffect(() => {
    socket.on("new-comment", ({ comment }) => {
      setComments((comments) => [comment, ...comments]);
    });
    socket.on("delete-comment", ({ id }) => {
      setComments((comments) => comments.filter((comment) => comment.id != id));
    });
  
    return () => {
      socket.off("new-comment");
    };
  }, [setComments, socket]);

  const sendComment = (e) => {
    e.preventDefault();
    createComment(commentText, token.id, itemId);
    setCommentText("");
  };

  const formatDate = (dateStr) => {
    const date = parseISO(dateStr);
    return formatDistance(date, new Date(), { addSuffix: true });
  };

  const renderAuthorTooltip = (props) => (
    <Tooltip id="button-tooltip-author" {...props}>
      View user collections
    </Tooltip>
  );

  const renderDeleteTooltip = (props) => (
    <Tooltip id="button-tooltip-delete" {...props}>
      Delete comment
    </Tooltip>
  );

  return (
    <Container className="comments-container mt-5">
      <Card className="comments-card shadow-0 border mb-5">
        <Card.Body>
          <Form onSubmit={sendComment} className={token !== null ? 'd-flex flex-column' : 'd-none'}>
            <Form.Control value={commentText} onChange={(e) => setCommentText(e.target.value)} as="textarea" placeholder="Type comment..." rows={2} required />
            <Button className='comments-send-button m-2' type="submit" variant="primary">Send</Button>
          </Form>
          <h4 className='text-center'>{comments.length === 0 ? 'Leave the first comment!' : 'Comments'}</h4>
          <Scrollbar style={{ height: '20vw' }}>
            {comments.map((comment) => (
              <Card key={comment.id} className="mb-2">
                <Card.Body>
                  <div className="d-flex flex-column">
                    <div className="d-flex justify-content-between">
                      <OverlayTrigger placement="left" delay={{ show: 250, hide: 250 }} overlay={renderAuthorTooltip}>
                        <span onClick={() => navigate(`/profile/${comment.user.id}`)} className="small fw-bold mb-1">{comment.user.name}</span>
                      </OverlayTrigger>
                      <div className='d-flex align-items-center'>
                        <span className="small text-muted mb-0">{formatDate(comment.createdAt)}</span>
                        <OverlayTrigger placement="right" delay={{ show: 250, hide: 250 }} overlay={renderDeleteTooltip}>
                          <FontAwesomeIcon onClick={() => deleteComment(comment.id)} className={token !== null && (token.role === 'ADMIN' || comment.user.id == token.id) ? 'ms-2' : 'd-none'} icon={faXmark} />
                        </OverlayTrigger>
                      </div>
                    </div>
                    <p className="mb-0">{comment.text}</p>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Scrollbar>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Comments;
