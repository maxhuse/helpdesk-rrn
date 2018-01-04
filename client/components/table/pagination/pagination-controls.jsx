import React from 'react';

const PaginationControls = ({
  currentPage,
  itemsPerPage,
  itemsCount,
  pagesCount,
  hasPrev,
  hasNext,
  onPreviousClick,
  onNextClick,
}) => {
  const firstItemOnPage = (currentPage - 1) * itemsPerPage;
  let lastItemOnPage;

  if (itemsCount < itemsPerPage) {
    lastItemOnPage = itemsCount;
  } else if (currentPage < pagesCount) {
    lastItemOnPage = currentPage * itemsPerPage;
  } else {
    lastItemOnPage = itemsCount;
  }

  const prevArrowClass = hasPrev ?
    'table__pagination-arrow table__pagination-arrow_prev' :
    'table__pagination-arrow table__pagination-arrow_prev table__pagination-arrow_disabled';

  const nextArrowClass = hasNext ?
    'table__pagination-arrow table__pagination-arrow_next' :
    'table__pagination-arrow table__pagination-arrow_next table__pagination-arrow_disabled';

  return (
    <span>
      <div className="table__pagination-count">
        {firstItemOnPage + 1}-{lastItemOnPage} of {itemsCount}
      </div>
      <div className={prevArrowClass} onClick={onPreviousClick}>
        <i className="material-icons">chevron_left</i>
      </div>
      <div className={nextArrowClass} onClick={onNextClick}>
        <i className="material-icons">chevron_right</i>
      </div>
    </span>
  );
};

export default PaginationControls;
