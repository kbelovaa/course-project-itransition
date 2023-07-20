import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { fetchTags } from '../../http/tagAPI';
import './styles.scss';

const TagsCloud = () => {
  const [tags, setTags] = useState([]);
  const [tagsCount, setTagsCount] = useState([]);

  useEffect(() => {
    fetchTags(30)
    .then((data) => {
      setTags(data.tags);
      setTagsCount(data.tagsCount);
    });
  }, []);

  return (
    <Card className="tags-card shadow-0 border mt-5 mb-5">
      <Card.Body>
        <h2 className='text-center mb-3'>Popular tags</h2>
        <div className="rti--container item-tags-wrap">
          {tagsCount.map((item, index) => (
            <span key={index} className="rti--tag mt-1">#{tags.filter((tag) => tag.id === item.tagId)[0].name}</span>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default TagsCloud;
