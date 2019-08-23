import * as React from 'react';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { List, ScrollToMode } from 'office-ui-fabric-react/lib/List';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';

export type IExampleItem = { name: string };

export interface IListScrollingExampleProps {
  items: IExampleItem[];
}

export interface IListScrollingExampleState {
  selectedIndex: number;
  scrollToMode: ScrollToMode;
  showItemIndexInView: boolean;
}

const evenItemHeight = 25;
const oddItemHeight = 50;
const numberOfItemsOnPage = 10;

export default class ListScrollingExample extends React.Component<IListScrollingExampleProps, IListScrollingExampleState> {
  private _list: List<IExampleItem>;

  constructor(props: IListScrollingExampleProps) {
    super(props);

    this.state = {
      selectedIndex: 0,
      scrollToMode: ScrollToMode.auto,
      showItemIndexInView: false
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

  public componentWillUnmount() {
    if (this.state.showItemIndexInView) {
      const itemIndexInView = this._list!.getStartItemIndexInView(
        idx => (idx % 2 === 0 ? evenItemHeight : oddItemHeight) /* measureItem */
      );
      alert('unmounting, getting first item index that was in view: ' + itemIndexInView);
    }
  }

  private _getPageHeight(idx: number): number {
    let h = 0;
    for (let i = idx; i < idx + numberOfItemsOnPage; ++i) {
      const isEvenRow = i % 2 === 0;

      h += isEvenRow ? evenItemHeight : oddItemHeight;
    }
    return h;
  }

  private _onChangeText = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value: string): void => {
    this._scroll(parseInt(value, 10) || 0, this.state.scrollToMode);
  };

  private _onDropdownChange = (event: React.FormEvent<HTMLDivElement>, option: IDropdownOption) => {
    let scrollMode = this.state.scrollToMode;
    switch (option.key) {
      case 'auto':
        scrollMode = ScrollToMode.auto;
        break;
      case 'top':
        scrollMode = ScrollToMode.top;
        break;
      case 'bottom':
        scrollMode = ScrollToMode.bottom;
        break;
      case 'center':
        scrollMode = ScrollToMode.center;
        break;
    }
    this._scroll(this.state.selectedIndex, scrollMode);
  };

  private _onRenderCell = (item: IExampleItem, index: number): JSX.Element => {
    return (
      <div data-is-focusable={true}>
        <div>
          {index} &nbsp; {item.name}
        </div>
      </div>
    );
  };

  private _scrollRelative = (delta: number): (() => void) => {
    return (): void => {
      this._scroll(this.state.selectedIndex + delta, this.state.scrollToMode);
    };
  };

  private _scroll = (index: number, scrollToMode: ScrollToMode): void => {
    const updatedSelectedIndex = Math.min(Math.max(index, 0), this.props.items.length - 1);

    this.setState(
      {
        selectedIndex: updatedSelectedIndex,
        scrollToMode: scrollToMode
      },
      () => {
        this._list.scrollToIndex(updatedSelectedIndex, idx => (idx % 2 === 0 ? evenItemHeight : oddItemHeight), scrollToMode);
      }
    );
  };

  private _resolveList = (list: List<IExampleItem>): void => {
    this._list = list;
  };

  private _onShowItemIndexInViewChanged = (event: React.FormEvent<HTMLInputElement>, checked: boolean): void => {
    this.setState({
      showItemIndexInView: checked
    });
  };
}
