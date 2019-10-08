import * as React from 'react';
// import { DefaultButton } from 'office-ui-fabric-react';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';

import RoomList from './RoomList';
// import { createListItems } from '../../utilities/exampleData';

import axios from 'axios';
// import { response } from 'express';

// for now we are using fake data items in the scrolling room grid
// const _cachedItems = createListItems(5000);
//const _cachedItems = []

export interface AppProps {
}

export interface AppState {
  startTime: Date;
  endTime: Date;
  showUnavailable: boolean;
  rooms: Array<any>;
}

export default class RoomFinder extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      startTime: null,
      endTime: null,
      showUnavailable: false,
      rooms: []
    };
  }

  componentDidMount() {
    let mapRoomIdToActivity = this.getActivities(/* start and end time? */);
    this.getAvailableRooms(mapRoomIdToActivity);
  }

  getActivities() {
    let mapRoomIdToActivity = new Map();
    axios.get('The Activities GET call goes here').then(response => {
      response.data.data.forEach((d: any[]) => {
        // assuming d[21] is the room ID. Probably this will need to change based on what order the fields come back in
        mapRoomIdToActivity.set(d[21], true /* or maybe the whole activity object */);
      });
    });
  }

  getAvailableRooms(mapRoomIdToActivity) {
    let items = [];
    //axios.get('https://qeapp/SG86044Merced/~api/query/room?&fields=Id%2CName%2CroomNumber%2CRoomType%2EName%2CBuilding%2EName%2CBuilding%2EBuildingCode%2CMaxOccupancy%2CIsActive&allowUnlimitedResults=false&sort=%2BBuilding%2EName,Name&page=1&start=0&limit=200').then(response => {
    axios.get('https://qeapp/SG86044Merced/~api/search/room?_dc=1570562089531&start=0&limit=500&_s=1&fields=RowNumber%2CId%2CRoomName%2CRoomDescription%2CRoomNumber%2CRoomTypeName%2CBuildingCode%2CBuildingName%2CCampusName%2CCapacity%2CBuildingRoomNumberRoomName%2CEffectiveDateId%2CCanEdit%2CCanDelete&filter=(RegionId%20in%20(%221549784a-5a61-4cf1-a328-1c019fdd64d7%22))&sortOrder=%2BBuildingRoomNumberRoomName&page=1&sort=%5B%7B%22property%22%3A%22BuildingRoomNumberRoomName%22%2C%22direction%22%3A%22ASC%22%7D%5D').then(response => {
      response.data.data.forEach((d: any[]) => {
        items.push({
          key: d[0],
          roomName: d[1],
          roomNumber: d[2],
          roomBuilding: d[4],
          available: mapRoomIdToActivity.get(d[1]) ? false : true, // assuming d[1] is roomId here
          capacity: 100
        })
      });

      this.setState({
        ...this.state,
        rooms: items
      })
    })
  }

  postReservation() {
    // Need to know when the event creation is saved in outlook
    console.log("Writing reservation back to Ad Astra")
  }

  makePromise = function (itemField) {
    return new Promise(function(resolve, reject) {
      itemField.getAsync(function (asyncResult) {
        if (asyncResult.status.toString === "failed") {
          reject(asyncResult.error.message);
        }
        else {
          resolve(asyncResult.value);
        }
      });
    });
  }

  click = async () => {
    var item = Office.context.mailbox.item;
    Promise.all([this.makePromise(item.start), this.makePromise(item.end)])
      .then(function(values) {
        console.log(values);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  onToggleChange = ({}, checked: boolean) => {
    this.setState({showUnavailable: !checked});
  };

  render() {
    return (
      <div>
        <div style={{ paddingLeft: '16px', paddingRight: '16px', paddingBottom: '10px', borderBottomWidth: '1px',
                       borderColor: 'rgba(237, 235, 233, 1)', borderBottomStyle: 'solid'}}>
          <div className="ms-SearchBoxExample" style={{borderColor: 'rgba(237, 235, 233, 1)'}}>
            <SearchBox
              placeholder="Search by Ad Astra room name"
              onSearch={newValue => console.log('value is ' + newValue)}
              onFocus={() => console.log('onFocus called')}
              onBlur={() => console.log('onBlur called')}
              onChange={() => console.log('onChange called')}
            />
          </div>
          <div style={{ marginTop: '13px', marginBottom: '5px' }} >
              <Toggle
                defaultChecked={!this.state.showUnavailable}
                label="Only available rooms"
                inlineLabel={true}
                onFocus={() => console.log('onFocus called')}
                onBlur={() => console.log('onBlur called')}
                onChange={this.onToggleChange}
              />
          </div>
        </div>
        <RoomList items={this.state.rooms} showUnavailable={this.state.showUnavailable} />

        {/* <DefaultButton className='ms-welcome__action'  onClick={this.click} text="Refresh"/>
        <div>Here is what I pulled of invite: {JSON.stringify(this.state)} </div> */}
      </div>
);
  }
}
