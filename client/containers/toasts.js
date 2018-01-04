import { connect } from 'react-redux';
import Toasts from 'components/toasts';
import { actions as toastsComponentActions } from '../ducks/components/toasts';

const mapDispatchToProps = toastsComponentActions;

const mapStateToProps = state => ({
  toastsComponentIm: state.components.toastsComponentIm,
});

export default connect(mapStateToProps, mapDispatchToProps)(Toasts);
