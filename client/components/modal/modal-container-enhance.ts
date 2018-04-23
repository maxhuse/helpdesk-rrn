/*
* The function that connect component with the piece of the state responding for the modal windows.
* It is necessary, that not to pass modalComponentIm in a component of page.
* The page will not be rerender in this way when modalComponentIm changes.
* */

import { connect } from 'react-redux';
import { ComponentClass, StatelessComponent } from 'react';

const mapDispatchToProps = dispatch => ({
  dispatch,
});

const mapStateToProps = state => ({
  modalComponentIm: state.components.modalComponentIm,
});

interface IModalEnhance {
  (ComposedComponent: ComponentClass<any> | StatelessComponent<any>): ComponentClass<any>;
}
const enhance: IModalEnhance = ComposedComponent =>
  connect(mapStateToProps, mapDispatchToProps)(ComposedComponent);

export default enhance;
