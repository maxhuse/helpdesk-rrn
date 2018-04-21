import React, { PureComponent, Fragment, StatelessComponent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import i18next from 'i18next';
import { Table } from 'components/table';
import { roles } from 'shared/constants';
import dataFetcherEnhance from 'components/data-fetcher-enhance';
import { sortType, filterType } from 'client-constants';
import { actions as staffsActions, TState as TStaffState } from 'ducks/data/staffs';
import { actions as modalActions, TState as TModalState } from 'ducks/components/modal';
import Modal, { ModalChangePassword, modalContainerEnhance } from 'components/modal';
import ModalAddStaff from './modal-add-staff';
import ModalEditStaff from './modal-edit-staff';
import ModalBlockStaff from './modal-block-staff';

const mapDispatchToProps = {
  staffsDataUpdateSignal: staffsActions.staffsDataUpdateSignal,
  staffsDataGetSignal: staffsActions.staffsDataGetSignal,
  modalComponentShowSignal: modalActions.modalComponentShowSignal,
};

const mapStateToProps = state => ({
  staffsDataIm: state.data.staffsDataIm,
  fetchActionAttributes: [{ name: 'staffsDataGetSignal' }],
});

const modalId = {
  ADD: 'addStaff',
  EDIT: 'editStaff',
  BLOCK: 'blockStaff',
  CHANGE_PASSWORD: 'changePassword',
};

interface IModalContainerProps {
  staffsDataIm: TStaffState;
  modalComponentIm: TModalState;
  staffsDataUpdateSignal: typeof staffsActions.staffsDataUpdateSignal;
  dispatch: Dispatch<any>;
}
// Call modalContainerEnhance for passing modalComponentIm into the component
const StaffsModalContainer = modalContainerEnhance(
  class extends PureComponent<IModalContainerProps> {
    render() {
      const {
        staffsDataIm,
        modalComponentIm,
        staffsDataUpdateSignal,
        dispatch,
      } = this.props;

      return (
        <Fragment>
          <Modal modalId={modalId.ADD}>
            <ModalAddStaff />
          </Modal>

          <Modal modalId={modalId.EDIT}>
            <ModalEditStaff
              getStaff={() => {
                if (!modalComponentIm.options) {
                  return undefined;
                }

                const staffId = modalComponentIm.options.id;

                return staffsDataIm.data.find(model => model.get('id') === staffId);
              }}
            />
          </Modal>

          <Modal modalId={modalId.BLOCK}>
            <ModalBlockStaff
              getStaff={() => {
                if (!modalComponentIm.options) {
                  return undefined;
                }

                const staffId = modalComponentIm.options.id;

                return staffsDataIm.data.find(model => model.get('id') === staffId);
              }}
            />
          </Modal>

          <Modal modalId={modalId.CHANGE_PASSWORD}>
            <ModalChangePassword
              doneText={() => {
                if (!modalComponentIm.options) {
                  return undefined;
                }

                const staffId = modalComponentIm.options.id;
                const staffIm = staffsDataIm.data.find(model => model.get('id') === staffId);

                if (!staffIm) {
                  return undefined;
                }

                return i18next.t('staff_edited', { name: staffIm.get('name') });
              }}
              submitSignal={options => dispatch(staffsDataUpdateSignal(options))}
            />
          </Modal>
        </Fragment>
      );
    }
  }
);

interface IStaffProps {
  staffsDataIm: TStaffState;
  staffsDataUpdateSignal: typeof staffsActions.staffsDataUpdateSignal;
  modalComponentShowSignal: typeof modalActions.modalComponentShowSignal;
}
const Staffs: StatelessComponent<IStaffProps> = ({
  staffsDataIm,
  staffsDataUpdateSignal,
  modalComponentShowSignal,
}) => {
  // Describe table cells
  const cells = [
    {
      id: 'name',
      getValue: model => model.get('name'),
      className: 'table__cell_2',
      name: i18next.t('name'),
      sort: {
        type: sortType.ALPHABETIC,
        field: 'name',
      },
    },
    {
      id: 'login',
      getValue: model => model.get('login'),
      className: 'table__cell_1',
      name: i18next.t('login'),
      sort: {
        type: sortType.ALPHABETIC,
        field: 'login',
      },
    },
    {
      id: 'role',
      getValue: model => i18next.t(model.get('role')),
      className: 'table__cell_3',
      name: i18next.t('role'),
      sort: {
        type: sortType.ALPHABETIC,
        field: 'role',
      },
    },
    {
      id: 'email',
      getValue: model => model.get('email'),
      name: i18next.t('email'),
      className: 'table__cell_4',
    },
    {
      id: 'notes',
      getValue: model => model.get('description'),
      name: i18next.t('notes'),
      isHiddenOnClosed: true,
    },
  ];

  // describe table row
  const row = {
    iconButtons: [
      {
        getIcon: () => 'edit',
        getTitle: () => i18next.t('edit'),
        getClassName: () => 'button_flat button_icon',
        onClick: item => modalComponentShowSignal(modalId.EDIT, { id: item.get('id') }),
      },
      {
        getIcon: () => 'account_circle',
        getTitle: () => i18next.t('change_password'),
        getClassName: () => 'button_flat button_icon',
        onClick: item => modalComponentShowSignal(modalId.CHANGE_PASSWORD, { id: item.get('id') }),
      },
      {
        isShown: item => item.get('role') !== roles.ADMIN,
        getIcon: item => (item.get('active') ? 'enhanced_encryption' : 'no_encryption'),
        getTitle: item => i18next.t(item.get('active') ? 'block' : 'unblock'),
        getClassName: () => 'button_flat button_icon',
        onClick: item => modalComponentShowSignal(modalId.BLOCK, { id: item.get('id') }),
      },
    ],
  };

  // Describe filters
  const rolesForFilter = [
    { name: i18next.t(roles.ADMIN), value: roles.ADMIN },
    { name: i18next.t(roles.ENGINEER), value: roles.ENGINEER },
  ];

  const filterFields = [
    {
      type: filterType.TEXT,
      key: 'name',
      name: i18next.t('name'),
    },
    {
      type: filterType.TEXT,
      key: 'login',
      name: i18next.t('login'),
    },
    {
      type: filterType.SELECT,
      key: 'role',
      name: i18next.t('role'),
      options: rolesForFilter,
    },
  ];

  return (
    <div className="content">
      <div className="content__body">
        <Table
          items={staffsDataIm.data}
          cells={cells}
          row={row}
          filterFields={filterFields}
          showHeader
          createButton={{
            onClick: () => modalComponentShowSignal(modalId.ADD, false),
          }}
        />

        <StaffsModalContainer
          staffsDataIm={staffsDataIm}
          staffsDataUpdateSignal={staffsDataUpdateSignal}
        />
      </div>
    </div>
  );
};

const StaffsWithFetch = dataFetcherEnhance(Staffs);

export default connect(mapStateToProps, mapDispatchToProps)(StaffsWithFetch);
