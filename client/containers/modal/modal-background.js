import { connect } from 'react-redux';
import ModalBackground from 'components/modal/modal-background';

function mapStateToProps(state) {
  return {
    modalComponentIm: state.components.modalComponentIm,
  };
}

export default connect(mapStateToProps)(ModalBackground);
