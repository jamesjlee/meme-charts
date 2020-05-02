import React, { useState, useEffect } from "react";
import Form from "../../components/Form";
import Chart from "../../components/Chart";
import Header from "../../components/Header";

const API_KEY = process.env.REACT_APP_ALPHA_API_KEY;

const ChartContainer = () => {
  const [formValues, setFormValues] = useState({});
  const [url, setUrl] = useState("");
  const [apiData, setApiData] = useState({});
  const [error, setError] = useState(false);

  useEffect(() => {
    if (formValues.ticker) {
      fetch(url)
        .then((res) => res.json())
        .then((result) => {
          const results = result[Object.keys(result)[1]];
          if (results) {
            setApiData(results);
            setError(false);
          } else {
            setError(true);
            setFormValues({
              ...formValues,
              isGenerating: false,
            });
          }
        })
        .catch((err) => {
          throw new Error("Error occured", err.message);
        });
    } else {
      setError(true);
    }
  }, [url]);

  const onGenerate = (values, generating) => {
    setFormValues({
      ...values,
      isGenerating: generating,
    });

    setUrl(
      values.timeSeries === "TIME_SERIES_INTRADAY" &&
        `https://www.alphavantage.co/query?function=${values.timeSeries}&symbol=${values.ticker}&outputsize=${values.dataSize}&interval=1min&apikey=${API_KEY}`
    );
  };

  return (
    <div id='chart-container'>
      <Header title={"Meme Charts"} />
      <Form onGenerate={onGenerate} />
      {error ? (
        <div>
          No results found. Please check if your time series is correct or enter
          another stock ticker.
        </div>
      ) : (
        <Chart
          searchValue={formValues.ticker}
          generateValue={formValues.isGenerating}
          timeSeries={formValues.timeSeries}
          apiData={apiData}
          width={800}
          height={600}
        />
      )}
    </div>
  );
};

export default ChartContainer;
