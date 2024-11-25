import React, {useState, useContext, MouseEventHandler} from 'react';
import {BsGearFill} from 'react-icons/bs';
import './settings.scss';
import {Accordion, Button, Col, Form, InputGroup, Offcanvas, Row} from 'react-bootstrap';
import {ShowSettingsContext, ShowStateHistoryContext} from '../../App';
import {Part} from '../spinning-wheel/spinning-wheel';
import {getPunishmentPool, getWheelValues} from './settings-utils';
import IconButton from '../icon-button';
import {PunishmentSelectionType, PunishmentSelectionTypeMessages, ShowSettings} from '../../cookies/show-settings';
import {DEFAULT_SHOW_STATE_HISTORY} from '../../cookies/show-state';
import {getNewShowStateHistory} from '../../cookies/show-state-history-utils';

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

const getPunishmentSelectionTypeInputRows = (list: string[], performerCount: number, onChangeCallback: (event: React.ChangeEvent<HTMLSelectElement>, index: number) => void) => {
  return getSelectInputRowsToRender(list, PunishmentSelectionTypeMessages, performerCount, onChangeCallback);
};

const getSelectInputRowsToRender = (
  list: string[],
  selectOptions: Map<string, string>,
  performerCount: number,
  onChangeCallback: (event: React.ChangeEvent<HTMLSelectElement>, index: number) => void
) => {
  while(performerCount > list.length) {
    list.push("");
  }
  return list.slice(0, performerCount).map((punishmentOrderOption, index) => (
    <InputGroup>
      <InputGroup.Text>#{index + 1}</InputGroup.Text>
      <Form.Select
        id={'punishment_ordering' + '_' + index}
        key={index}
        required
        defaultValue={punishmentOrderOption}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {onChangeCallback(event, index)}}
      >
        {
          Array.from(selectOptions.keys().map((key) => (
            <option value={key}>{selectOptions.get(key)}</option>
          )))
        }
      </Form.Select>
    </InputGroup>
  ))
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
  const showStateHistory = useContext(ShowStateHistoryContext);

  const {
    performerCount,
    performerList,
    punishmentList,
    punishmentSelectionTypeList,
    setShowSettings,
    wheelValues
  } = showSettings;

  const [menuPerformerCount, setMenuPerformerCount] = useState<number>(performerCount);
  const [menuPerformerList, setMenuPerformerList] = useState<string[]>(performerList);
  const [menuPunishmentList, setMenuPunishmentList] = useState<string[]>(punishmentList);
  const [menuPunishmentSelectionTypeList, setMenuPunishmentSelectionTypeList] = useState<string[]>(punishmentSelectionTypeList);
  const [menuWheelValues, setMenuWheelValues] = useState<Part[]>(wheelValues);

  const handlePunishmentChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const updatedList = menuPunishmentList.map((punishment, index) => {
      if(id === index) {
        return event.target.value;
      }

      return punishment;
    });

    setMenuPunishmentList(updatedList);
  };

  const handlePerformerChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const updatedList = menuPerformerList.map((performer, index) => {
      if(id === index) {
        return event.target.value;
      }

      return performer;
    });

    setMenuPerformerList(updatedList);
  };

  const handlePerformerCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedPerformerCount = Number(event.target.value);
    const updatedPerformerList = [];
    const updatedPunishmentList = [];
    const updatedPunishmentSelectionTypeList = [];

    for(let i = 0; i < updatedPerformerCount; i++) {
      if(i < menuPerformerList.length) {
        updatedPerformerList.push(menuPerformerList[i]);
        updatedPunishmentList.push(menuPunishmentList[i]);
        updatedPunishmentSelectionTypeList.push(punishmentSelectionTypeList[i]);
      } else {
        updatedPerformerList.push("");
        updatedPunishmentList.push("");
        updatedPunishmentSelectionTypeList.push(PunishmentSelectionType.RANDOM);
      }
    }

    setMenuPerformerList(updatedPerformerList);
    setMenuPunishmentList(updatedPunishmentList);
    setMenuPerformerCount(updatedPerformerCount);
    setMenuPunishmentSelectionTypeList(updatedPunishmentSelectionTypeList);
    setMenuWheelValues(getWheelValues(updatedPerformerCount));

    console.log('updatedPerformerCount: ', updatedPerformerCount);
  };

  const handlePunishmentSelectionTypeListChange = (event: React.ChangeEvent<HTMLSelectElement>, id: number) => {
    const updatedList = menuPunishmentSelectionTypeList.map((punishmentOrderOption, index) => {
      if(id === index) {
        return event.target.value;
      }

      return punishmentOrderOption;
    });

    setMenuPunishmentSelectionTypeList(updatedList);
  };

  const [showDrawer, setShowDrawer] = useState(false);

  const handleClose = () => setShowDrawer(false);
  const handleShow = () => setShowDrawer(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const {
      setShowStateHistory
    } = showStateHistory;

    const menuShowSettings: ShowSettings = {
      performerCount: menuPerformerCount,
      performerList: menuPerformerList,
      punishmentSelectionTypeList: menuPunishmentSelectionTypeList,
      punishmentList: menuPunishmentList,
      randomPunishmentPool: getPunishmentPool(menuPunishmentList, menuPunishmentSelectionTypeList),
      wheelValues: getWheelValues(menuPerformerCount),
      spinOrder: getSpinOrder(menuPerformerCount),
    };

    setShowStateHistory(getNewShowStateHistory(menuShowSettings.randomPunishmentPool));
    setShowSettings(menuShowSettings);
  };

  const handleRestartShow: MouseEventHandler<HTMLButtonElement> = () => {
    const {
      setShowStateHistory
    } = showStateHistory;

    setShowStateHistory(getNewShowStateHistory(showSettings.randomPunishmentPool));
    window.location.reload();
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
              <Form.Group as={Col} sm={3} className="mb-3">
                <Form.Label># of Performers</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="# of Performers"
                  defaultValue={menuPerformerCount}
                  min={1}
                  onChange={handlePerformerCountChange}/>
              </Form.Group>
              <Form.Group as={Col} sm={3} className="mb-3">
                <Form.Label>Lineup</Form.Label>
                  {getPerformerNameTextInputRows(menuPerformerList, menuPerformerCount, handlePerformerChange)}
              </Form.Group>
            </Row>
            <Accordion className="mb-3" flush>
              <Accordion.Header>Secret Settings</Accordion.Header>
              <Accordion.Body>
                <Form.Group as={Row} className="mb-3">
                  <Form.Group as={Col} sm={3} className="mb-3">
                    <Form.Label>Punishments</Form.Label>
                    {getPunishmentNameTextInputRows(menuPunishmentList, menuPerformerCount, handlePunishmentChange)}
                  </Form.Group>
                  <Form.Group as={Col} sm={3} className="mb-3">
                    <Form.Label>Random or In Order Punishment?</Form.Label>
                    {getPunishmentSelectionTypeInputRows(menuPunishmentSelectionTypeList, menuPerformerCount, handlePunishmentSelectionTypeListChange)}
                  </Form.Group>
                </Form.Group>
              </Accordion.Body>
            </Accordion>
            <Form.Group as={Row} className="mb-3">
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Button variant="secondary" onClick={handleRestartShow}>
                  Restart Show
                </Button>
              </Form.Group>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Settings;
