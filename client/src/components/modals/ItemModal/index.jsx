import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Modal } from 'react-bootstrap';
import { TagsInput } from 'react-tag-input-component';
import { useTheme } from '../../../hooks/useTheme';
import { getCollection } from '../../../http/collectionAPI';
import { getItem, createItem, editItem } from '../../../http/itemAPI';
import { setItemsAsync } from '../../../store/actions/itemActions';
import {
  themeBgLight,
  themeColorDark,
  themeColorLight,
  btnThemeVariantSecondary,
} from '../../../constants/themeValues';
import './styles.scss';

const ItemModal = ({ show, setShow, itemId, setEditItem, collectionId }) => {
  const dispatch = useDispatch();
  const collections = useSelector((state) => state.collection);

  const [collection, setCollection] = useState({});
  const [name, setName] = useState('');
  const [tags, setTags] = useState([]);
  const [intFields, setIntFields] = useState(['', '', '']);
  const [stringFields, setStringFields] = useState(['', '', '']);
  const [textFields, setTextFields] = useState(['', '', '']);
  const [boolFields, setBoolFields] = useState(['', '', '']);
  const [dateFields, setDateFields] = useState(['', '', '']);
  const [intFieldsValues, setIntFieldsValues] = useState(['', '', '']);
  const [stringFieldsValues, setStringFieldsValues] = useState(['', '', '']);
  const [textFieldsValues, setTextFieldsValues] = useState(['', '', '']);
  const [boolFieldsValues, setBoolFieldsValues] = useState([false, false, false]);
  const [dateFieldsValues, setDateFieldsValues] = useState(['', '', '']);
  const [showMessage, setShowMessage] = useState(false);

  const { theme } = useTheme();

  useEffect(() => {
    if (collectionId) {
      getCollection(collectionId).then((data) => {
        setCollection(data);
        setIntFields([data.numberField1 ?? '', data.numberField2 ?? '', data.numberField3 ?? '']);
        setStringFields([data.stringField1 ?? '', data.stringField2 ?? '', data.stringField3 ?? '']);
        setTextFields([data.textField1 ?? '', data.textField2 ?? '', data.textField3 ?? '']);
        setBoolFields([data.booleanField1 ?? '', data.booleanField2 ?? '', data.booleanField3 ?? '']);
        setDateFields([data.dateField1 ?? '', data.dateField2 ?? '', data.dateField3 ?? '']);
      });
    }
  }, [collections, collectionId]);

  useEffect(() => {
    if (itemId) {
      getItem(itemId).then((data) => {
        setName(data.item.name);
        setTags(data.tags.map((tag) => tag.name));
        setIntFieldsValues([data.item.numberField1 ?? '', data.item.numberField2 ?? '', data.item.numberField3 ?? '']);
        setStringFieldsValues([
          data.item.stringField1 ?? '',
          data.item.stringField2 ?? '',
          data.item.stringField3 ?? '',
        ]);
        setTextFieldsValues([data.item.textField1 ?? '', data.item.textField2 ?? '', data.item.textField3 ?? '']);
        setBoolFieldsValues([data.item.booleanField1, data.item.booleanField2, data.item.booleanField3]);
        setDateFieldsValues([
          data.item.dateField1 ? data.item.dateField1.slice(0, 10) : '',
          data.item.dateField2 ? data.item.dateField2.slice(0, 10) : '',
          data.item.dateField3 ? data.item.dateField3.slice(0, 10) : '',
        ]);
      });
    }
  }, [itemId]);

  const clearFields = () => {
    setName('');
    setTags([]);
    setIntFieldsValues(['', '', '']);
    setStringFieldsValues(['', '', '']);
    setTextFieldsValues(['', '', '']);
    setBoolFieldsValues([false, false, false]);
    setDateFieldsValues(['', '', '']);
  };

  const handleClose = () => {
    if (itemId) {
      clearFields();
    }
    setShow(false);
    setEditItem(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const intCustomFieldsLength = Object.values(collection)
      .slice(5, 8)
      .filter((field) => field).length;
    const stringCustomFieldsLength = Object.values(collection)
      .slice(8, 11)
      .filter((field) => field).length;
    const textCustomFieldsLength = Object.values(collection)
      .slice(11, 14)
      .filter((field) => field).length;
    const dateCustomFieldsLength = Object.values(collection)
      .slice(17, 20)
      .filter((field) => field).length;
    const intCustomFieldsValuesLength = intFieldsValues.filter((value) => value !== '').length;
    const stringCustomFieldsValuesLength = stringFieldsValues.filter((value) => value !== '').length;
    const textCustomFieldsValuesLength = textFieldsValues.filter((value) => value !== '').length;
    const dateCustomFieldsValuesLength = dateFieldsValues.filter((value) => value !== '').length;

    if (
      tags.length !== 0 &&
      intCustomFieldsLength === intCustomFieldsValuesLength &&
      stringCustomFieldsLength === stringCustomFieldsValuesLength &&
      textCustomFieldsLength === textCustomFieldsValuesLength &&
      dateCustomFieldsLength === dateCustomFieldsValuesLength
    ) {
      setShowMessage(false);
      if (itemId) {
        editItem(
          {
            name: name[0].toUpperCase() + name.slice(1),
            tags: JSON.stringify(tags),
            customFields: JSON.stringify([
              ...intFieldsValues,
              ...stringFieldsValues,
              ...textFieldsValues,
              ...boolFieldsValues,
              ...dateFieldsValues,
            ]),
          },
          itemId,
        )
          .then(() => dispatch(setItemsAsync(collectionId)))
          .then(() => handleClose());
      } else {
        createItem({
          name: name[0].toUpperCase() + name.slice(1),
          tags: JSON.stringify(tags),
          customFields: JSON.stringify([
            ...intFieldsValues,
            ...stringFieldsValues,
            ...textFieldsValues,
            ...boolFieldsValues,
            ...dateFieldsValues,
          ]),
          collectionId,
        })
          .then(() => dispatch(setItemsAsync(collectionId)))
          .then(() => {
            clearFields();
            handleClose();
          });
      }
    } else {
      setShowMessage(true);
    }
  };

  return (
    <Modal size="lg" show={show} onHide={handleClose}>
      <Modal.Header className={`bg-${themeBgLight[theme]}`} closeButton>
        <Modal.Title>{itemId ? 'Modify' : 'Create'} item</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className={`bg-${themeBgLight[theme]}`}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Item name</Form.Label>
            <Form.Control
              className={`bg-${themeColorDark[theme]} text-${themeColorLight[theme]}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
              autoFocus
            />
          </Form.Group>
          <Form.Group className={`${theme} mb-3`} controlId="tags">
            <Form.Label>Item tags</Form.Label>
            <TagsInput value={tags} onChange={setTags} placeHolder="Enter tags" required />
            <Form.Text>Press enter to add new tag</Form.Text>
          </Form.Group>
          {intFields.map((item, index) => (
            <Form.Group key={index} className={item ? 'mb-3' : 'd-none'} controlId="intFields">
              <Form.Label>{item && item[0].toUpperCase() + item.slice(1)}</Form.Label>
              <Form.Control
                className={`bg-${themeColorDark[theme]} text-${themeColorLight[theme]}`}
                value={intFieldsValues[index]}
                onChange={(e) =>
                  setIntFieldsValues((state) => state.map((el, i) => (i === index ? e.target.value : el)))
                }
                type="number"
                placeholder="Enter a numeric value"
              />
            </Form.Group>
          ))}
          {stringFields.map((item, index) => (
            <Form.Group key={index} className={item ? 'mb-3' : 'd-none'} controlId="stringFields">
              <Form.Label>{item && item[0].toUpperCase() + item.slice(1)}</Form.Label>
              <Form.Control
                className={`bg-${themeColorDark[theme]} text-${themeColorLight[theme]}`}
                value={stringFieldsValues[index]}
                onChange={(e) =>
                  setStringFieldsValues((state) => state.map((el, i) => (i === index ? e.target.value : el)))
                }
                type="text"
                placeholder="Enter a string value"
              />
            </Form.Group>
          ))}
          {textFields.map((item, index) => (
            <Form.Group key={index} className={item ? 'mb-3' : 'd-none'} controlId="textFields">
              <Form.Label>{item && item[0].toUpperCase() + item.slice(1)}</Form.Label>
              <Form.Control
                className={`bg-${themeColorDark[theme]} text-${themeColorLight[theme]}`}
                value={textFieldsValues[index]}
                onChange={(e) =>
                  setTextFieldsValues((state) => state.map((el, i) => (i === index ? e.target.value : el)))
                }
                as="textarea"
                placeholder="Enter a text value"
                maxLength="500"
                rows={3}
              />
            </Form.Group>
          ))}
          {boolFields.map((item, index) => (
            <Form.Group key={index} className={item ? 'mb-3' : 'd-none'} controlId="boolFields">
              <Form.Check
                checked={boolFieldsValues[index]}
                onChange={(e) =>
                  setBoolFieldsValues((state) => state.map((el, i) => (i === index ? e.target.checked : el)))
                }
                type="switch"
                label={item && item[0].toUpperCase() + item.slice(1)}
              />
            </Form.Group>
          ))}
          {dateFields.map((item, index) => (
            <Form.Group key={index} className={item ? 'mb-3' : 'd-none'} controlId="dateFields">
              <Form.Label>{item && item[0].toUpperCase() + item.slice(1)}</Form.Label>
              <Form.Control
                className={`bg-${themeColorDark[theme]} text-${themeColorLight[theme]}`}
                value={dateFieldsValues[index]}
                onChange={(e) =>
                  setDateFieldsValues((state) => state.map((el, i) => (i === index ? e.target.value : el)))
                }
                type="date"
              />
            </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer className={`bg-${themeBgLight[theme]}`}>
          <Form.Text id="message" className={showMessage ? 'text-danger' : 'd-none'}>
            Fill in all the fields
          </Form.Text>
          <Button variant={btnThemeVariantSecondary[theme]} onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" variant="primary">
            {itemId ? 'Save changes' : 'Create'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ItemModal;
