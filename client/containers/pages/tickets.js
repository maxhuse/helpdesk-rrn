import { connect } from 'react-redux';
import { Tickets } from 'components/pages';
import dataFetcherEnhance from 'components/data-fetcher-enhance';
import { actions as ticketsDataActions } from 'ducks/data/tickets';
import { actions as customersDataActions } from 'ducks/data/customers';
import { actions as messagesDataActions } from 'ducks/data/messages';
import { actions as modalComponentActions } from 'ducks/components/modal';
import { roles } from 'shared/constants';

const mapDispatchToProps = Object.assign(
  {},
  ticketsDataActions,
  customersDataActions,
  messagesDataActions,
  modalComponentActions
);

function mapStateToProps(state) {
  const userRole = state.data.authDataIm.getIn(['data', 'role']);
  const fetchActionAttributes = userRole === roles.CUSTOMER ?
    [{ name: 'ticketsDataGetSignal' }] :
    [
      { name: 'customersDataGetSignal' },
      { name: 'ticketsDataGetSignal' }
    ];

  return {
    authDataIm: state.data.authDataIm,
    ticketsDataIm: state.data.ticketsDataIm,
    customersDataIm: state.data.customersDataIm,
    messagesDataIm: state.data.messagesDataIm,
    fetchActionAttributes,
  };
}

const TicketsWithFetch = dataFetcherEnhance(Tickets);

export default connect(mapStateToProps, mapDispatchToProps)(TicketsWithFetch);
