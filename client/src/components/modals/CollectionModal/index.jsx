import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Form, Modal, Row, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { IKContext, IKUpload } from 'imagekitio-react';
import { v4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../../hooks/useTheme';
import { createCollection, getCollection, editCollection } from '../../../http/collectionAPI';
import { setCollectionsAsync, setTotalCountCollectionAsync } from '../../../store/actions/collectionActions';
import THEMES from '../../../constants/collectionThemes';
import {
  themeBgLight,
  themeColorDark,
  themeColorLight,
  btnThemeVariantSecondary,
} from '../../../constants/themeValues';
import './styles.scss';

const CollectionModal = ({ show, setShow, collectionId, setEditCollection }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('none');
  const [file, setFile] = useState(null);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [customFields, setCustomFields] = useState({
    intChecked: false,
    stringChecked: false,
    textChecked: false,
    boolChecked: false,
    dateChecked: false,
  });
  const [fieldsQuantity, setFieldsQuantity] = useState({
    intFields: 1,
    stringFields: 1,
    textFields: 1,
    boolFields: 1,
    dateFields: 1,
  });
  const [intFields, setIntFields] = useState(['', '', '']);
  const [stringFields, setStringFields] = useState(['', '', '']);
  const [textFields, setTextFields] = useState(['', '', '']);
  const [boolFields, setBoolFields] = useState(['', '', '']);
  const [dateFields, setDateFields] = useState(['', '', '']);

  const inputFileRef = useRef(null);

  const params = useParams();
  const userId = params.id;

  const { theme } = useTheme();

  const urlEndpoint = process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT;
  const publicKey = process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY;
  const authenticationEndpoint = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (collectionId) {
      getCollection(collectionId).then((data) => {
        setName(data.name);
        setDescription(data.description);
        setSelectedTheme(data.theme);
        setFile(data.img);
        setCustomFields({
          intChecked: Boolean(data.numberField1 || data.numberField2 || data.numberField3),
          stringChecked: Boolean(data.stringField1 || data.stringField2 || data.stringField3),
          textChecked: Boolean(data.textField1 || data.textField2 || data.textField3),
          boolChecked: Boolean(data.booleanField1 || data.booleanField2 || data.booleanField3),
          dateChecked: Boolean(data.dateField1 || data.dateField2 || data.dateField3),
        });
        const intQuantity = [data.numberField1, data.numberField2, data.numberField3].filter((field) => field).length;
        const stringQuantity = [data.stringField1, data.stringField2, data.stringField3].filter(
          (field) => field,
        ).length;
        const textQuantity = [data.textField1, data.textField2, data.textField3].filter((field) => field).length;
        const boolQuantity = [data.booleanField1, data.booleanField2, data.booleanField3].filter(
          (field) => field,
        ).length;
        const dateQuantity = [data.dateField1, data.dateField2, data.dateField3].filter((field) => field).length;
        setFieldsQuantity({
          intFields: intQuantity <= 1 ? 1 : intQuantity,
          stringFields: stringQuantity <= 1 ? 1 : stringQuantity,
          textFields: textQuantity <= 1 ? 1 : textQuantity,
          boolFields: boolQuantity <= 1 ? 1 : boolQuantity,
          dateFields: dateQuantity <= 1 ? 1 : dateQuantity,
        });
        setIntFields([data.numberField1 ?? '', data.numberField2 ?? '', data.numberField3 ?? '']);
        setStringFields([data.stringField1 ?? '', data.stringField2 ?? '', data.stringField3 ?? '']);
        setTextFields([data.textField1 ?? '', data.textField2 ?? '', data.textField3 ?? '']);
        setBoolFields([data.booleanField1 ?? '', data.booleanField2 ?? '', data.booleanField3 ?? '']);
        setDateFields([data.dateField1 ?? '', data.dateField2 ?? '', data.dateField3 ?? '']);
      });
    }
  }, [collectionId]);

  const clearFields = () => {
    setName('');
    setDescription('');
    setSelectedTheme('none');
    setFile(null);
    setCustomFields({
      intChecked: false,
      stringChecked: false,
      textChecked: false,
      boolChecked: false,
      dateChecked: false,
    });
    setFieldsQuantity({
      intFields: 1,
      stringFields: 1,
      textFields: 1,
      boolFields: 1,
      dateFields: 1,
    });
    setIntFields(['', '', '']);
    setStringFields(['', '', '']);
    setTextFields(['', '', '']);
    setBoolFields(['', '', '']);
    setDateFields(['', '', '']);
  };

  const handleClose = () => {
    if (collectionId) {
      clearFields();
    }
    setShow(false);
    setEditCollection(null);
  };

  const selectFile = (res) => {
    setFile(res.name);
    setSubmitDisabled(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const intQuantity = customFields.intChecked ? fieldsQuantity.intFields : 0;
    const stringQuantity = customFields.stringChecked ? fieldsQuantity.stringFields : 0;
    const textQuantity = customFields.textChecked ? fieldsQuantity.textFields : 0;
    const boolQuantity = customFields.boolChecked ? fieldsQuantity.boolFields : 0;
    const dateQuantity = customFields.dateChecked ? fieldsQuantity.dateFields : 0;
    const fieldsNamesQuantity = [...intFields, ...stringFields, ...textFields, ...boolFields, ...dateFields].filter(
      (field) => field,
    ).length;

    if (
      selectedTheme !== 'none' &&
      fieldsNamesQuantity === intQuantity + stringQuantity + textQuantity + boolQuantity + dateQuantity
    ) {
      setShowMessage(false);
      if (collectionId) {
        editCollection(
          {
            name: name[0].toUpperCase() + name.slice(1),
            description: description[0].toUpperCase() + description.slice(1),
            theme: selectedTheme,
            img: file,
            customFields: JSON.stringify([...intFields, ...stringFields, ...textFields, ...boolFields, ...dateFields]),
          },
          collectionId,
        )
          .then(() => dispatch(setCollectionsAsync(userId)))
          .then(() => handleClose());
      } else {
        createCollection({
          name: name[0].toUpperCase() + name.slice(1),
          description: description[0].toUpperCase() + description.slice(1),
          theme: selectedTheme,
          img: file,
          customFields: JSON.stringify([...intFields, ...stringFields, ...textFields, ...boolFields, ...dateFields]),
          userId,
        })
          .then(() => dispatch(setCollectionsAsync(userId)))
          .then(() => dispatch(setTotalCountCollectionAsync(userId)))
          .then(() => {
            clearFields();
            handleClose();
          });
      }
    } else {
      setShowMessage(true);
    }
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete file
    </Tooltip>
  );

  const onIntCheckedChange = (e) => {
    setCustomFields((state) => ({ ...state, intChecked: e.target.checked }));
    setIntFields(['', '', '']);
  };

  const onStringCheckedChange = (e) => {
    setCustomFields((state) => ({ ...state, stringChecked: e.target.checked }));
    setStringFields(['', '', '']);
  };

  const onTextCheckedChange = (e) => {
    setCustomFields((state) => ({ ...state, textChecked: e.target.checked }));
    setTextFields(['', '', '']);
  };

  const onBoolCheckedChange = (e) => {
    setCustomFields((state) => ({ ...state, boolChecked: e.target.checked }));
    setBoolFields(['', '', '']);
  };

  const onDateCheckedChange = (e) => {
    setCustomFields((state) => ({ ...state, dateChecked: e.target.checked }));
    setDateFields(['', '', '']);
  };

  const onIntSelectChange = (e) => {
    setFieldsQuantity((state) => ({ ...state, intFields: e.target.value }));
    setIntFields((state) => state.map((item, index) => (index > Number(e.target.value) - 1 ? '' : item)));
  };

  const onStringSelectChange = (e) => {
    setFieldsQuantity((state) => ({ ...state, stringFields: e.target.value }));
    setStringFields((state) => state.map((item, index) => (index > Number(e.target.value) - 1 ? '' : item)));
  };

  const onTextSelectChange = (e) => {
    setFieldsQuantity((state) => ({ ...state, textFields: e.target.value }));
    setTextFields((state) => state.map((item, index) => (index > Number(e.target.value) - 1 ? '' : item)));
  };

  const onBoolSelectChange = (e) => {
    setFieldsQuantity((state) => ({ ...state, boolFields: e.target.value }));
    setBoolFields((state) => state.map((item, index) => (index > Number(e.target.value) - 1 ? '' : item)));
  };

  const onDateSelectChange = (e) => {
    setFieldsQuantity((state) => ({ ...state, dateFields: e.target.value }));
    setDateFields((state) => state.map((item, index) => (index > Number(e.target.value) - 1 ? '' : item)));
  };

  return (
    <Modal size="lg" show={show} onHide={handleClose}>
      <Modal.Header className={`bg-${themeBgLight[theme]}`} closeButton>
        <Modal.Title>{collectionId ? 'Modify' : 'Create'} collection</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className={`bg-${themeBgLight[theme]}`}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Collection name</Form.Label>
            <Form.Control
              className={`bg-${themeColorDark[theme]} text-${themeColorLight[theme]}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
              required
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="theme">
            <Form.Label>Collection theme</Form.Label>
            <Form.Select
              className={`bg-${themeColorDark[theme]} text-${themeColorLight[theme]}`}
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
            >
              <option value="none" disabled hidden>
                Select a theme
              </option>
              {THEMES.sort().map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Collection description</Form.Label>
            <Form.Control
              className={`bg-${themeColorDark[theme]} text-${themeColorLight[theme]}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              as="textarea"
              maxLength="500"
              placeholder="Description..."
              rows={3}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <p className="mb-2">Collection image (optional)</p>
            <div className="d-flex align-items-center">
              <IKContext
                urlEndpoint={urlEndpoint}
                publicKey={publicKey}
                authenticationEndpoint={authenticationEndpoint}
              >
                <IKUpload
                  fileName={v4() + '.jpg'}
                  onUploadStart={() => setSubmitDisabled(true)}
                  onSuccess={selectFile}
                  className="d-none"
                  inputRef={inputFileRef}
                />
                {inputFileRef && (
                  <Button variant={btnThemeVariantSecondary[theme]} onClick={() => inputFileRef.current.click()}>
                    Select a file
                  </Button>
                )}
                {file ? (
                  <p className="ms-2 mb-0">
                    File selected
                    <OverlayTrigger placement="right" delay={{ show: 250, hide: 250 }} overlay={renderTooltip}>
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-form-delete ms-1"
                        onClick={() => setFile(null)}
                      />
                    </OverlayTrigger>
                  </p>
                ) : (
                  <p className="ms-2 mb-0">No file selected</p>
                )}
              </IKContext>
            </div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="customFields">
            <Form.Label>Choose collection custom fields</Form.Label>
            <Form.Group className="ms-1" controlId="intFields">
              <Form.Check
                checked={customFields.intChecked}
                onChange={(e) => onIntCheckedChange(e)}
                type="switch"
                id="int"
                label="Integer fields"
              />
              <Form.Group as={Row} className={customFields.intChecked ? 'mb-2' : 'd-none'} controlId="intFields">
                <Form.Label className="modal-form-label me-2">Fields quantity</Form.Label>
                <Form.Select
                  size="sm"
                  value={fieldsQuantity.intFields}
                  onChange={(e) => onIntSelectChange(e)}
                  className={`bg-${themeColorDark[theme]} text-${themeColorLight[theme]} modal-form-select`}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Row} className={customFields.intChecked ? 'mb-2' : 'd-none'} controlId="intFieldsNames">
                <Form.Label className="modal-form-label me-2">Fields names</Form.Label>
                {[...Array(Number(fieldsQuantity.intFields))]
                  .map((_, i) => i)
                  .map((item) => (
                    <Form.Control
                      key={item}
                      value={intFields[item]}
                      onChange={(e) =>
                        setIntFields((state) => state.map((el, index) => (index === item ? e.target.value : el)))
                      }
                      type="text"
                      placeholder={`Field ${item + 1}`}
                      size="sm"
                      className={`bg-${themeColorDark[theme]} text-${themeColorLight[theme]} modal-form-control me-2`}
                    />
                  ))}
              </Form.Group>
            </Form.Group>
            <Form.Group className="ms-1" controlId="stringFields">
              <Form.Check
                checked={customFields.stringChecked}
                onChange={(e) => onStringCheckedChange(e)}
                type="switch"
                id="string"
                label="String fields"
              />
              <Form.Group as={Row} className={customFields.stringChecked ? 'mb-2' : 'd-none'} controlId="stringFields">
                <Form.Label className="modal-form-label me-2">Fields quantity</Form.Label>
                <Form.Select
                  size="sm"
                  value={fieldsQuantity.stringFields}
                  onChange={(e) => onStringSelectChange(e)}
                  className={`bg-${themeColorDark[theme]} text-${themeColorLight[theme]} modal-form-select`}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </Form.Select>
              </Form.Group>
              <Form.Group
                as={Row}
                className={customFields.stringChecked ? 'mb-2' : 'd-none'}
                controlId="stringFieldsNames"
              >
                <Form.Label className="modal-form-label me-2">Fields names</Form.Label>
                {[...Array(Number(fieldsQuantity.stringFields))]
                  .map((_, i) => i)
                  .map((item) => (
                    <Form.Control
                      key={item}
                      value={stringFields[item]}
                      onChange={(e) =>
                        setStringFields((state) => state.map((el, index) => (index === item ? e.target.value : el)))
                      }
                      type="text"
                      placeholder={`Field ${item + 1}`}
                      size="sm"
                      className={`bg-${themeColorDark[theme]} text-${themeColorLight[theme]} modal-form-control me-2`}
                    />
                  ))}
              </Form.Group>
            </Form.Group>
            <Form.Group className="ms-1" controlId="textFields">
              <Form.Check
                checked={customFields.textChecked}
                onChange={(e) => onTextCheckedChange(e)}
                type="switch"
                id="text"
                label="Text fields"
              />
              <Form.Group as={Row} className={customFields.textChecked ? 'mb-2' : 'd-none'} controlId="textFields">
                <Form.Label className="modal-form-label me-2">Fields quantity</Form.Label>
                <Form.Select
                  size="sm"
                  value={fieldsQuantity.textFields}
                  onChange={(e) => onTextSelectChange(e)}
                  className={`bg-${themeColorDark[theme]} text-${themeColorLight[theme]} modal-form-select`}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Row} className={customFields.textChecked ? 'mb-2' : 'd-none'} controlId="textFieldsNames">
                <Form.Label className="modal-form-label me-2">Fields names</Form.Label>
                {[...Array(Number(fieldsQuantity.textFields))]
                  .map((_, i) => i)
                  .map((item) => (
                    <Form.Control
                      key={item}
                      value={textFields[item]}
                      onChange={(e) =>
                        setTextFields((state) => state.map((el, index) => (index === item ? e.target.value : el)))
                      }
                      type="text"
                      placeholder={`Field ${item + 1}`}
                      size="sm"
                      className={`bg-${themeColorDark[theme]} text-${themeColorLight[theme]} modal-form-control me-2`}
                    />
                  ))}
              </Form.Group>
            </Form.Group>
            <Form.Group className="ms-1" controlId="boolFields">
              <Form.Check
                checked={customFields.boolChecked}
                onChange={(e) => onBoolCheckedChange(e)}
                type="switch"
                id="bool"
                label="Logical yes/no fields"
              />
              <Form.Group as={Row} className={customFields.boolChecked ? 'mb-2' : 'd-none'} controlId="boolFields">
                <Form.Label className="modal-form-label me-2">Fields quantity</Form.Label>
                <Form.Select
                  size="sm"
                  value={fieldsQuantity.boolFields}
                  onChange={(e) => onBoolSelectChange(e)}
                  className={`bg-${themeColorDark[theme]} text-${themeColorLight[theme]} modal-form-select`}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Row} className={customFields.boolChecked ? 'mb-2' : 'd-none'} controlId="boolFieldsNames">
                <Form.Label className="modal-form-label me-2">Fields names</Form.Label>
                {[...Array(Number(fieldsQuantity.boolFields))]
                  .map((_, i) => i)
                  .map((item) => (
                    <Form.Control
                      key={item}
                      value={boolFields[item]}
                      onChange={(e) =>
                        setBoolFields((state) => state.map((el, index) => (index === item ? e.target.value : el)))
                      }
                      type="text"
                      placeholder={`Field ${item + 1}`}
                      size="sm"
                      className={`bg-${themeColorDark[theme]} text-${themeColorLight[theme]} modal-form-control me-2`}
                    />
                  ))}
              </Form.Group>
            </Form.Group>
            <Form.Group className="ms-1" controlId="dateFields">
              <Form.Check
                checked={customFields.dateChecked}
                onChange={(e) => onDateCheckedChange(e)}
                type="switch"
                id="date"
                label="Date fields"
              />
              <Form.Group as={Row} className={customFields.dateChecked ? 'mb-2' : 'd-none'} controlId="dateFields">
                <Form.Label className="modal-form-label me-2">Fields quantity</Form.Label>
                <Form.Select
                  size="sm"
                  value={fieldsQuantity.dateFields}
                  onChange={(e) => onDateSelectChange(e)}
                  className={`bg-${themeColorDark[theme]} text-${themeColorLight[theme]} modal-form-select`}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Row} className={customFields.dateChecked ? 'mb-2' : 'd-none'} controlId="dateFieldsNames">
                <Form.Label className="modal-form-label me-2">Fields names</Form.Label>
                {[...Array(Number(fieldsQuantity.dateFields))]
                  .map((_, i) => i)
                  .map((item) => (
                    <Form.Control
                      key={item}
                      value={dateFields[item]}
                      onChange={(e) =>
                        setDateFields((state) => state.map((el, index) => (index === item ? e.target.value : el)))
                      }
                      type="text"
                      placeholder={`Field ${item + 1}`}
                      size="sm"
                      className={`bg-${themeColorDark[theme]} text-${themeColorLight[theme]} modal-form-control me-2`}
                    />
                  ))}
              </Form.Group>
            </Form.Group>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className={`bg-${themeBgLight[theme]}`}>
          <Form.Text id="message" className={showMessage ? 'text-danger' : 'd-none'}>
            Fill in all the fields
          </Form.Text>
          <Button variant={btnThemeVariantSecondary[theme]} onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" variant="primary" disabled={submitDisabled}>
            {collectionId ? 'Save changes' : 'Create'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CollectionModal;
