/*
* Функция, которая конектит компонент с участком стейте отвечающего за модальные окна.
* Нужна ради того, чтобы не прокидывать modalComponentIm в компонент страницы.
* Страница не будет таким образом перерисовываться при изменениях modalComponentIm.
* */

import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    modalComponentIm: state.components.modalComponentIm,
  };
}

export default ComposedComponent => connect(mapStateToProps)(ComposedComponent);
