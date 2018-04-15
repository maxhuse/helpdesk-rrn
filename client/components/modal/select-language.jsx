import React, { PureComponent, Fragment } from 'react';
import i18next from 'i18next';
import Radio from 'components/radio';
import { ModalHeader, ModalOkCancelButtons } from 'components/modal';

export default class ModalSelectLanguage extends PureComponent {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const { setLanguageDelta, currentLanguage, closeAction } = this.props;
    let language;

    if (this.languageEnglishRef.checked) {
      language = 'en';
    } else if (this.languageRussianRef.checked) {
      language = 'ru';
    }

    // Language not changed
    if (language === currentLanguage) {
      closeAction();
    } else {
      // Language changed
      setLanguageDelta(language);
    }
  }

  render() {
    const { modalComponentHideSignal, currentLanguage } = this.props;

    return (
      <Fragment>
        <ModalHeader text={i18next.t('select_language')} />

        <div className="modal__content">
          <div className="modal__item">
            <Radio
              id="language_english"
              name="language"
              defaultChecked={currentLanguage === 'en'}
              ref={(ref) => { this.languageEnglishRef = ref; }}
            />
            <label htmlFor="language_english" className="modal__language-name">
              {i18next.t('english')}
            </label>
          </div>

          <div className="modal__item">
            <Radio
              id="language_russian"
              name="language"
              defaultChecked={currentLanguage === 'ru'}
              ref={(ref) => { this.languageRussianRef = ref; }}
            />
            <label htmlFor="language_russian" className="modal__language-name">
              {i18next.t('russian')}
            </label>
          </div>
        </div>

        <ModalOkCancelButtons
          closeAction={modalComponentHideSignal}
          onSubmit={this.onSubmit}
          okText={i18next.t('apply')}
          cancelText={i18next.t('cancel')}
        />
      </Fragment>
    );
  }
}
