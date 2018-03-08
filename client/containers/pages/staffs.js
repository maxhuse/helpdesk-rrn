import { connect } from 'react-redux';
import { Staffs } from 'components/pages';
import dataFetcherEnhance from 'components/data-fetcher-enhance/data-fetcher-enhance';
import { actions as staffsDataActions } from 'ducks/data/staffs';
import { actions as modalComponentActions } from 'ducks/components/modal';

const mapDispatchToProps = Object.assign(
  {},
  staffsDataActions,
  modalComponentActions
);

function mapStateToProps(state) {
  return {
    staffsDataIm: state.data.staffsDataIm,
    fetchActionAttributes: [{ name: 'staffsDataGetSignal' }],
  };
}

const StaffsWithFetch = dataFetcherEnhance(Staffs);

export default connect(mapStateToProps, mapDispatchToProps)(StaffsWithFetch);
