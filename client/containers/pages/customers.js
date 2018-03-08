import { connect } from 'react-redux';
import { Customers } from 'components/pages';
import dataFetcherEnhance from 'components/data-fetcher-enhance/data-fetcher-enhance';
import { actions as customersDataActions } from 'ducks/data/customers';
import { actions as modalComponentActions } from 'ducks/components/modal';

const mapDispatchToProps = Object.assign(
  {},
  customersDataActions,
  modalComponentActions
);

function mapStateToProps(state) {
  return {
    customersDataIm: state.data.customersDataIm,
    fetchActionAttributes: [{ name: 'customersDataGetSignal' }],
  };
}

const CustomersWithFetch = dataFetcherEnhance(Customers);

export default connect(mapStateToProps, mapDispatchToProps)(CustomersWithFetch);
