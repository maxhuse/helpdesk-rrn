import { connect } from 'react-redux';
import { Tickets } from 'components/pages';
import dataFetcherEnhance from 'components/data-fetcher-enhance/data-fetcher-enhance';
import { actions as ticketsDataActions } from 'ducks/data/tickets';
import { actions as staffsDataActions } from 'ducks/data/staffs';
import { actions as customersDataActions } from 'ducks/data/customers';
import { actions as modalComponentActions } from 'ducks/components/modal';

const mapDispatchToProps = Object.assign(
  {},
  ticketsDataActions,
  staffsDataActions,
  customersDataActions,
  modalComponentActions
);

// TODO: split fetchActions by roles
function mapStateToProps(state) {
  return {
    authDataIm: state.data.authDataIm,
    ticketsDataIm: state.data.ticketsDataIm,
    staffsDataIm: state.data.staffsDataIm,
    customersDataIm: state.data.customersDataIm,
    fetchActionNames: ['staffsDataGetSignal', 'customersDataGetSignal', 'ticketsDataGetSignal'],
  };
}

const TicketsWithFetch = dataFetcherEnhance(Tickets);

export default connect(mapStateToProps, mapDispatchToProps)(TicketsWithFetch);
