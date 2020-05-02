import React, { useState } from "react";

function Form({ onGenerate }) {
  const [formValues, setFormValues] = useState({
    ticker: "",
    timeSeries: "TIME_SERIES_INTRADAY",
    dataSize: "compact",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    onGenerate(formValues, true);
    setFormValues({
      ...formValues,
      ticker: "",
    });
  };

  const stockTickerChange = (e) => {
    setFormValues({
      ...formValues,
      ticker: e.target.value,
    });
  };

  const dataSizeChange = (e) => {
    setFormValues({
      ...formValues,
      dataSize: e.target.value,
    });
  };

  const timeSeriesChange = (e) => {
    setFormValues({
      ...formValues,
      timeSeries: e.target.value,
    });
  };

  return (
    <div id='form'>
      <form onSubmit={onSubmit}>
        <input
          type='text'
          onChange={stockTickerChange}
          value={formValues.ticker}
          placeholder='Enter a stock ticker'
        />
        <br />
        <label htmlFor='timeSeries'>Choose a time series:</label>
        <select id='timeSeries' onChange={timeSeriesChange}>
          <option value='TIME_SERIES_INTRADAY'>Intraday</option>
        </select>
        <br />
        <label htmlFor='dataSize'>Choose the data size:</label>
        <select id='dataSize' onChange={dataSizeChange}>
          <option value='compact'>Compact</option>
          <option value='full'>Full</option>
        </select>
        <br />
        <button type='submit'>Generate Meme Chart</button>
      </form>
    </div>
  );
}

export default Form;
