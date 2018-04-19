import React, { ChangeEvent, PureComponent } from 'react';
import { connect } from 'react-redux';
import { actions as tableActions } from 'ducks/components/table';
import ItemsPerPage from './items-per-page';
import PaginationControls from './pagination-controls';

const mapDispatchToProps = {
  changePage: tableActions.tableComponentChangePageDelta,
  changeItemsPerPage: tableActions.tableComponentChangeItemsPerPageDelta,
};

interface IProps {
  itemsCount: number;
  itemsPerPage: number;
  currentPage: number;
  changePage: typeof tableActions.tableComponentChangePageDelta;
  changeItemsPerPage: typeof tableActions.tableComponentChangeItemsPerPageDelta;
}
interface IState {
  pagesCount: number;
}
class Pagination extends PureComponent<IProps, IState> {
  constructor(props) {
    super(props);

    this.onChangeItemsPerPage = this.onChangeItemsPerPage.bind(this);
    this.onPreviousClick = this.onPreviousClick.bind(this);
    this.onNextClick = this.onNextClick.bind(this);

    this.state = {
      pagesCount: this.calcPagesCount(props.itemsPerPage, props.itemsCount),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (('itemsPerPage' in nextProps) || ('itemsCount' in nextProps)) {
      this.setState({
        pagesCount: this.calcPagesCount(nextProps.itemsPerPage, nextProps.itemsCount),
      });
    }
  }
  private onNextClick(): void {
    const { changePage, currentPage } = this.props;

    if (this.hasNext()) {
      changePage(currentPage + 1);
    }
  }

  private onPreviousClick(): void {
    const { changePage, currentPage } = this.props;

    if (this.hasPrev()) {
      changePage(currentPage - 1);
    }
  }

  private onChangeItemsPerPage(event: ChangeEvent<HTMLSelectElement>): void {
    this.props.changeItemsPerPage(Number(event.target.value));
  }

  private calcPagesCount(itemsPerPage: number, itemsCount: number): number {
    return itemsCount < itemsPerPage ?
      1 :
      Math.ceil(itemsCount / itemsPerPage);
  }

  private hasNext(): boolean {
    return this.props.currentPage < this.state.pagesCount;
  }

  private hasPrev(): boolean {
    return this.props.currentPage > 1;
  }

  render() {
    const { currentPage, itemsCount, itemsPerPage } = this.props;
    const { pagesCount } = this.state;

    return (
      <div className="table__pagination">
        <ItemsPerPage
          itemsPerPage={itemsPerPage}
          itemsCount={itemsCount}
          onChange={this.onChangeItemsPerPage}
        />

        <PaginationControls
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          itemsCount={itemsCount}
          pagesCount={pagesCount}
          hasNext={this.hasNext()}
          hasPrev={this.hasPrev()}
          onPreviousClick={this.onPreviousClick}
          onNextClick={this.onNextClick}
        />
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(Pagination);
