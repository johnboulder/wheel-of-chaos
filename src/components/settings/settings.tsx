import React, {useState, useContext} from 'react';
import {BsGearFill} from 'react-icons/bs';
import './settings.scss';
import {Accordion, Button, Col, Form, InputGroup, Offcanvas, Row} from 'react-bootstrap';
import {ShowSettingsContext} from '../../App';
import {ShowSettings} from '../../utils/cookie-utils';
import {Part} from '../spinning-wheel/spinning-wheel';
import {getWheelValues} from './settings-utils';
import IconButton from '../icon-button';

const getSpinOrder = (performerCount: number): string[] => {
  const spinOrder: string[] = [];
  for (let i = 0; i < performerCount; i++) {
    spinOrder.push("punishment");
  }

  return spinOrder;
};

const getPerformerNameTextInputRows = (list: string[], performerCount: number, onChangeCallback:  (event: React.ChangeEvent<HTMLInputElement>, index: number) => void ) => {
  return getTextInputRowsToRender(list, "Performer Name", performerCount, onChangeCallback);
};

const getPunishmentNameTextInputRows = (list: string[], performerCount: number, onChangeCallback: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void) => {
  return getTextInputRowsToRender(list, "Punishment Name", performerCount, onChangeCallback);
};

const getTextInputRowsToRender = (list: string[], placeHolderText: string, performerCount: number, onChangeCallback: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void) => {
  while(performerCount > list.length) {
    list.push("");
  }
  return list.slice(0, performerCount).map((performerNameString, index) => (
    <InputGroup>
      <InputGroup.Text>#{index + 1}</InputGroup.Text>
      <Form.Control
        type="name"
        id={placeHolderText + '_' + index}
        key={index}
        placeholder={placeHolderText}
        defaultValue={performerNameString}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {onChangeCallback(event, index)}}
        required
      />
    </InputGroup>
  ))
};

const Settings = () => {
  const showSettings = useContext(ShowSettingsContext);

  const {performerCount, performerList, punishmentList, spinOrder, setShowSettings, wheelValues} = showSettings;

  const [menuPerformerCount, setMenuPerformerCount] = useState<number>(performerCount);
  const [menuPerformerList, setMenuPerformerList] = useState<string[]>(performerList);
  const [menuPunishmentList, setMenuPunishmentList] = useState<string[]>(punishmentList);
  const [menuWheelValues, setMenuWheelValues] = useState<Part[]>(wheelValues);

  const handlePunishmentChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const updatedList = menuPunishmentList.map((punishment, index) => {
      if(id === index) {
        return event.target.value;
      }

      return punishment;
    });

    setMenuPunishmentList(updatedList);
  }

  const handlePerformerChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const updatedList = menuPerformerList.map((performer, index) => {
      if(id === index) {
        return event.target.value;
      }

      return performer;
    });

    setMenuPerformerList(updatedList);
  }

  const handlePerformerCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMenuPerformerCount(Number(event.target.value))
    while(menuPerformerList.length < menuPerformerCount) {
      menuPerformerList.push("");
    }
    setMenuPerformerList(menuPerformerList);

    while(menuPunishmentList.length < menuPerformerCount) {
      menuPunishmentList.push("");
    }
    setMenuPunishmentList(menuPunishmentList);

    setMenuWheelValues(getWheelValues(menuPerformerCount));
  };

  const [showDrawer, setShowDrawer] = useState(false);

  const handleClose = () => setShowDrawer(false);
  const handleShow = () => setShowDrawer(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const menuShowSettings: ShowSettings = {
      performerCount: menuPerformerCount,
      performerList: menuPerformerList,
      punishmentList: menuPunishmentList,
      wheelValues: getWheelValues(menuPerformerCount),
      spinOrder: getSpinOrder(menuPerformerCount),
    };

    setShowSettings(menuShowSettings);
  };

  return (
    <>
      <IconButton onClick={handleShow} className='settings-btn'>
        <BsGearFill/>
      </IconButton>

      <Offcanvas
        className="w-75"
        show={showDrawer}
        onHide={handleClose}
        backdrop="static"
        data-bs-theme="dark"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Show Settings</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Form.Group as={Col} sm={3} className="mb-3" controlId="fromNumberOfPerformers">
                <Form.Label># of Performers</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="# of Performers"
                  defaultValue={menuPerformerCount}
                  min={1}
                  onChange={handlePerformerCountChange}/>
              </Form.Group>
              <Form.Group as={Col} sm={3} className="mb-3" controlId="formLineup">
                <Form.Label>Lineup</Form.Label>
                  {getPerformerNameTextInputRows(menuPerformerList, menuPerformerCount, handlePerformerChange)}
              </Form.Group>
            </Row>
            <Accordion className="mb-3" flush>
              <Accordion.Header>Secret Settings</Accordion.Header>
              <Accordion.Body>
                <Form.Group as={Col} sm={3} className="mb-3" controlId="formPunishments">
                  <Form.Label>Punishments</Form.Label>
                    {getPunishmentNameTextInputRows(menuPunishmentList, menuPerformerCount, handlePunishmentChange)}
                </Form.Group>
              </Accordion.Body>
            </Accordion>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Settings;
