import React, { PureComponent, Fragment } from 'react';
import i18next from 'i18next';
import { Table } from 'containers';
import { roles } from 'constants.js';
import Modal, { modalContainerEnhance } from 'containers/modal';
import ModalChangePassword from 'components/modal/change-password';
import ModalAddStaff from './modal-add-staff';
import ModalEditStaff from './modal-edit-staff';
import ModalBlockStaff from './modal-block-staff';

// Call modalContainerEnhance for passing modalComponentIm into the component
const StaffsModalContainer = modalContainerEnhance(
  class extends PureComponent {
    render() {
      const {
        staffsDataIm,
        modalComponentIm,
        staffsDataAddSignal,
        staffsDataUpdateSignal,
      } = this.props;

      return (
        <Fragment>
          <Modal modalId="addStaff">
            <ModalAddStaff submitSignal={staffsDataAddSignal} />
          </Modal>

          <Modal modalId="editStaff">
            <ModalEditStaff
              getStaff={() => {
                const staffId = modalComponentIm.get('options').id;

                return staffsDataIm.get('data').find(model => model.get('id') === staffId);
              }}
              submitSignal={staffsDataUpdateSignal}
            />
          </Modal>

          <Modal modalId="blockStaff">
            <ModalBlockStaff
              getStaff={() => {
                const staffId = modalComponentIm.get('options').id;

                return staffsDataIm.get('data').find(model => model.get('id') === staffId);
              }}
              submitSignal={staffsDataUpdateSignal}
            />
          </Modal>

          <Modal modalId="changePassword">
            <ModalChangePassword
              doneText={() => {
                const staffId = modalComponentIm.get('options').id;
                const staffIm = staffsDataIm.get('data').find(model => model.get('id') === staffId);

                return i18next.t('staff_edited', { name: staffIm.get('name') });
              }}
              submitSignal={staffsDataUpdateSignal}
            />
          </Modal>
        </Fragment>
      );
    }
  }
);

const Staffs = ({
  staffsDataIm,
  staffsDataAddSignal,
  staffsDataUpdateSignal,
  modalComponentShowDelta,
}) => {
  // Describe table cells
  const cells = [
    {
      id: 'name',
      getValue: model => model.get('name'),
      className: 'table__cell_2',
      name: i18next.t('name'),
      sort: {
        type: 'alphabetic',
        field: 'name',
      },
    },
    {
      id: 'login',
      getValue: model => model.get('login'),
      className: 'table__cell_1',
      name: i18next.t('login'),
      sort: {
        type: 'alphabetic',
        field: 'login',
      },
    },
    {
      id: 'role',
      getValue: model => i18next.t(model.get('role')),
      className: 'table__cell_3',
      name: i18next.t('role'),
      sort: {
        type: 'alphabetic',
        field: 'role',
      },
    },
    {
      id: 'email',
      getValue: model => (model.get('email') ? model.get('email') : '\u2014'),
      name: i18next.t('email'),
      className: 'table__cell_4',
      sort: {
        type: 'alphabetic',
        field: 'role',
      },
    },
    {
      id: 'notes',
      getValue: model => (model.get('description') ? model.get('description') : '\u2014'),
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
        onClick: item => modalComponentShowDelta('editStaff', { id: item.get('id') }),
      },
      {
        getIcon: () => 'account_circle',
        getTitle: () => i18next.t('change_password'),
        getClassName: () => 'button_flat button_icon',
        onClick: item => modalComponentShowDelta('changePassword', { id: item.get('id') }),
      },
      {
        isShown: item => item.get('role') !== roles.ADMIN,
        getIcon: item => (item.get('active') ? 'enhanced_encryption' : 'no_encryption'),
        getTitle: item => (item.get('active') ? i18next.t('block') : i18next.t('unblock')),
        getClassName: () => 'button_flat button_icon',
        onClick: item => modalComponentShowDelta('blockStaff', { id: item.get('id') }),
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
      type: 'text',
      key: 'name',
      name: i18next.t('name'),
    },
    {
      type: 'text',
      key: 'login',
      name: i18next.t('login'),
    },
    {
      type: 'select',
      key: 'role',
      name: i18next.t('role'),
      options: rolesForFilter,
    },
  ];

  return (
    <div className="content">
      <div className="content__body">
        <Table
          items={staffsDataIm.get('data')}
          cells={cells}
          row={row}
          filterFields={filterFields}
          showHeader
          createButton={{
            onClick: () => modalComponentShowDelta('addStaff', false),
          }}
        />

        <StaffsModalContainer
          staffsDataIm={staffsDataIm}
          staffsDataAddSignal={staffsDataAddSignal}
          staffsDataUpdateSignal={staffsDataUpdateSignal}
        />
      </div>
    </div>
  );
};

export default Staffs;
