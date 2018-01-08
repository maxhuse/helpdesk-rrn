import { connect } from 'react-redux';
import { Auth } from 'components/pages';
import { actions as authDataActions } from 'ducks/data/auth';
import { actions as toastsComponentActions } from 'ducks/components/toasts';

const mapDispatchToProps = Object.assign({}, authDataActions, toastsComponentActions);

function mapStateToProps(state) {
  return {
    authDataIm: state.data.authDataIm,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
