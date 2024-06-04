"use client";
import React from 'react';
import { FormattedNumber, IntlProvider } from 'react-intl';

const VNMoneyFormat = ({ amount }) => {
  return (
    <IntlProvider locale="vi">
      <FormattedNumber
        value={amount}
        style="currency"
        currency="VND"
        minimumFractionDigits={0}
      />
    </IntlProvider>
  );
};

export default VNMoneyFormat;
