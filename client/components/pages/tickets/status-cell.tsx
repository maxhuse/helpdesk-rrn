import React, { StatelessComponent } from 'react';
import i18next from 'i18next';
import { ticketStatus } from 'shared/constants';
import { ExpandableCell } from 'components/table/cell';
import Chip from 'components/chip';

interface IProps {
  className: string;
  isExpanded: boolean;
  name: string;
  value: string;
}
const TicketStatusCell: StatelessComponent<IProps> = ({ value, name, isExpanded, className }) => {
  const types = {
    [ticketStatus.NEW]: 'green',
    [ticketStatus.PENDING]: 'yellow',
    [ticketStatus.ASSIGNED]: 'purple',
    [ticketStatus.CLOSED]: 'gray',
  };
  const formatValue = i18next.t(value);

  return (
    <ExpandableCell isExpanded={isExpanded} className={className} name={name} title={formatValue}>
      <Chip color={types[value]} text={formatValue} />
    </ExpandableCell>
  );
};

export default TicketStatusCell;
