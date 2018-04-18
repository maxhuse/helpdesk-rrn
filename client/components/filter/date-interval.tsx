/*
* Component with two datepickers - from and to.
* His value is an array with "from" and "to" timestamps
* If no one date is picked - value returns undefined
* */
import React, { PureComponent } from 'react';
import i18next from 'i18next';
import moment, { Moment } from 'moment';
import DatePicker from 'react-datepicker';

interface IInputDataProps {
  id?: string;
  placeholderText: string;
  value: number | undefined;
}
interface IInputDataState {
  date: Moment | string;
}
class InputDate extends PureComponent<IInputDataProps, IInputDataState> {
  constructor(props) {
    super(props);

    this.onChangeDate = this.onChangeDate.bind(this);

    const initialDate = props.value ? moment(props.value, 'X') : '';

    this.state = { date: initialDate };
  }

  onChangeDate(value) {
    this.setState({ date: value });
  }

  get value() {
    return this.state.date && moment.isMoment(this.state.date) ?
      this.state.date.format('X') :
      '';
  }

  set value(newValue: any) {
    // DatePicker want empty string as empty value
    const newDate = newValue ? moment(newValue, 'X') : '';

    this.setState({ date: newDate });
  }

  render() {
    const { id, placeholderText } = this.props;
    const { date } = this.state;

    return (
      <div className="date-interval__range">
        <DatePicker
          dateFormat="DD MMM YYYY"
          onChange={this.onChangeDate}
          id={id}
          selected={date || undefined}
          className="input"
          popoverTargetOffset="10px -50px"
          placeholderText={placeholderText}
          value={date}
          tetherConstraints={[]}
        />
      </div>
    );
  }
}

interface IDateIntervalProps {
  defaultValue: [number | undefined, number | undefined] | undefined;
}
// eslint-disable-next-line react/no-multi-comp
export default class DateInterval extends PureComponent<IDateIntervalProps> {
  private dateFromInputRef: InputDate | null;
  private dateToInputRef: InputDate | null;

  get value(): [number | undefined, number | undefined] | undefined {
    const fromValue = this.dateFromInputRef ?
      Number(this.dateFromInputRef.value) || undefined :
      undefined;
    let toValue = this.dateToInputRef ?
      Number(this.dateToInputRef.value) || undefined :
      undefined;

    if (!fromValue && !toValue) {
      return undefined;
    } else if (toValue) {
      // it should be the last second of selected day
      toValue = Number(
        moment(Number(toValue), 'X')
          .add(23, 'hours')
          .add(59, 'minutes')
          .add(59, 'seconds')
          .format('X')
      );
    }

    return [fromValue, toValue];
  }

  set value(newValue) {
    if (!Array.isArray(newValue)) {
      return;
    }

    const [fromValue, toValue] = newValue;

    if (this.dateFromInputRef && this.dateToInputRef) {
      this.dateFromInputRef.value = fromValue;
      this.dateToInputRef.value = toValue;
    }
  }

  render() {
    const defaultValue = this.props.defaultValue || [];
    const currentValueFrom = Number(defaultValue[0]) || undefined;
    const currentValueTo = Number(defaultValue[1]) || undefined;

    return (
      <div className="date-interval">
        <InputDate
          ref={(ref) => { this.dateFromInputRef = ref; }}
          placeholderText={i18next.t('from')}
          value={currentValueFrom}
        />

        <InputDate
          ref={(ref) => { this.dateToInputRef = ref; }}
          placeholderText={i18next.t('to')}
          value={currentValueTo}
        />
      </div>
    );
  }
}
