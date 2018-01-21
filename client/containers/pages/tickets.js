import { connect } from 'react-redux';
import { Tickets } from 'components/pages';
import dataFetcherEnhance from 'components/data-fetcher-enhance/data-fetcher-enhance';
import { actions as ticketsDataActions } from 'ducks/data/tickets';
import { actions as staffsDataActions } from 'ducks/data/staffs';
import { actions as customersDataActions } from 'ducks/data/customers';
import { actions as modalComponentActions } from 'ducks/components/modal';
import { roles } from 'shared/constants';

const mapDispatchToProps = Object.assign(
  {},
  ticketsDataActions,
  staffsDataActions,
  customersDataActions,
  modalComponentActions
);

function mapStateToProps(state) {
  const userRole = state.data.authDataIm.getIn(['data', 'role']);
  const fetchActionNames = userRole === roles.CUSTOMER ?
    ['ticketsDataGetSignal'] :
    ['staffsDataGetSignal', 'customersDataGetSignal', 'ticketsDataGetSignal'];

  return {
    authDataIm: state.data.authDataIm,
    ticketsDataIm: state.data.ticketsDataIm,
    staffsDataIm: state.data.staffsDataIm,
    customersDataIm: state.data.customersDataIm,
    fetchActionNames,
  };
}

const TicketsWithFetch = dataFetcherEnhance(Tickets);

export default connect(mapStateToProps, mapDispatchToProps)(TicketsWithFetch);
