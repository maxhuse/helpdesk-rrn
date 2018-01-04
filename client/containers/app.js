import { connect } from 'react-redux';
import App from 'components/app';
import { actions as authDataActions } from 'ducks/data/auth';
import { actions as toastsComponentActions } from 'ducks/components/toasts';
import { actions as modalComponentActions } from 'ducks/components/modal';
import { actions as sidebarComponentActions } from 'ducks/components/sidebar';

const mapDispatchToProps = Object.assign(
  authDataActions,
  toastsComponentActions,
  modalComponentActions,
  sidebarComponentActions,
);

function mapStateToProps(state) {
  return {
    authDataIm: state.data.authDataIm,
    sidebarComponentIm: state.components.sidebarComponentIm,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
