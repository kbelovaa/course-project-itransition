import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { TagCloud } from 'react-tagcloud';
import { useTheme } from '../../hooks/useTheme';
import { fetchPopularTags } from '../../http/tagAPI';
import { themeBgLight, themeTagsLight } from '../../constants/themeValues';
import './styles.scss';

const TagsCloud = () => {
  const [tags, setTags] = useState([]);
  const [tagsCount, setTagsCount] = useState([]);
  const { theme } = useTheme();

  const navigate = useNavigate();

  const tagsArray = tagsCount.map((item) => {
    return {
      value: tags.filter((tag) => tag.id === item.tagId)[0].name,
      count: item.tagCount,
      color: themeTagsLight[Math.floor(Math.random() * themeTagsLight.length)],
    };
  });

  useEffect(() => {
    fetchPopularTags(30).then((data) => {
      setTags(data.tags);
      setTagsCount(data.tagsCount);
    });
  }, []);

  const handleTagClick = (tag) => {
    const tagId = tags.filter((item) => item.name === tag)[0].id;
    navigate(`/results/${tagId}`);
  };

  return (
    <Card className={`bg-${themeBgLight[theme]} tags-card shadow-0 border mt-5 mb-5`}>
      <Card.Body>
        <h2 className="text-center mb-3">Popular tags</h2>
        <TagCloud
          className="d-flex justify-content-center flex-wrap"
          minSize={20}
          maxSize={50}
          tags={tagsArray}
          onClick={(tag) => handleTagClick(tag.value)}
        />
      </Card.Body>
    </Card>
  );
};

export default TagsCloud;
