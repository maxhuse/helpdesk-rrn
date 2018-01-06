import { connect } from 'react-redux';
import { Profile } from 'components/pages';
import { actions as profilePageActions } from 'ducks/components/pages/profile';
import { actions as modalComponentActions } from 'ducks/components/modal';
import { actions as authDataActions } from 'ducks/data/auth';

const mapDispatchToProps = Object.assign(
  {},
  profilePageActions,
  modalComponentActions,
  authDataActions,
);

function mapStateToProps(state) {
  return {
    authDataIm: state.data.authDataIm,
    profilePageIm: state.components.pages.profilePageIm,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
