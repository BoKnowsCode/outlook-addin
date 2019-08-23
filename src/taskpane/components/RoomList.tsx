import * as React from 'react';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { List } from 'office-ui-fabric-react/lib/List';

import DetailedRoomButton from './DetailedRoomButton';

export type IExampleItem = { name: string };

export interface IRoomListProps {
  items: IExampleItem[];
}

export interface IRoomListState {
}

const evenItemHeight = 25;
const oddItemHeight = 50;
const numberOfItemsOnPage = 10;

export default class RoomList extends React.Component<IRoomListProps, IRoomListState> {
  private _list: List<IExampleItem>;

  constructor(props: IRoomListProps) {
    super(props);

    this.state = {
    };
  }

  public render() {
    const { items } = this.props;

    return (
      <FocusZone direction={FocusZoneDirection.vertical}>
        <div className='scroll-container' data-is-scrollable={true}>
          <List ref={this._resolveList} items={items} getPageHeight={this._getPageHeight} onRenderCell={this._onRenderCell} />
        </div>
      </FocusZone>
    );
  }

  private _getPageHeight(idx: number): number {
    let h = 0;
    for (let i = idx; i < idx + numberOfItemsOnPage; ++i) {
      const isEvenRow = i % 2 === 0;

      h += isEvenRow ? evenItemHeight : oddItemHeight;
    }
    return h;
  }

  private _onRenderCell = (item: IExampleItem, index: number): JSX.Element => {
    return (
      
      <div data-is-focusable={true}>
        <DetailedRoomButton roomName={index + " " + item.name}/>
      </div>
    );
  };

  private _resolveList = (list: List<IExampleItem>): void => {
    this._list = list;
  };
}
