/*
* The function that connect component with the piece of the state responding for the modal windows.
* It is necessary, that not to pass modalComponentIm in a component of page.
* The page will not be rerender in this way when modalComponentIm changes.
* */

import { connect } from 'react-redux';

const mapStateToProps = state => ({
  modalComponentIm: state.components.modalComponentIm,
});

export default ComposedComponent => connect(mapStateToProps)(ComposedComponent);
