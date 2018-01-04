import { connect } from 'react-redux';
import Modal from 'components/modal';
import { actions as modalComponentActions } from 'ducks/components/modal';

const mapDispatchToProps = Object.assign(
  {},
  modalComponentActions
);

function mapStateToProps(state) {
  return {
    modalComponentIm: state.components.modalComponentIm,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
