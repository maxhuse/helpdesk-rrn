import React, { PureComponent } from 'react';
import ItemsPerPage from './items-per-page';
import PaginationControls from './pagination-controls';

class Pagination extends PureComponent {
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

  onNextClick() {
    const { changePage, currentPage } = this.props;

    if (this.hasNext()) {
      changePage(currentPage + 1);
    }
  }

  onPreviousClick() {
    const { changePage, currentPage } = this.props;

    if (this.hasPrev()) {
      changePage(currentPage - 1);
    }
  }

  onChangeItemsPerPage(event) {
    this.props.changeItemsPerPage(+event.target.value);
  }

  calcPagesCount(itemsPerPage, itemsCount) {
    return itemsCount < itemsPerPage ?
      1 :
      Math.ceil(itemsCount / itemsPerPage);
  }

  hasNext() {
    return this.props.currentPage < this.state.pagesCount;
  }

  hasPrev() {
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

export default Pagination;
