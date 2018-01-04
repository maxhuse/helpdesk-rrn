import { connect } from 'react-redux';
import { actions as tableComponentActions } from 'ducks/components/table';
import { Table } from 'components/table';

const mapDispatchToProps = tableComponentActions;

function mapStateToProps(state) {
  return {
    tableComponentIm: state.components.tableComponentIm,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
