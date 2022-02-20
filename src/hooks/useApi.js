import React, { useEffect, useState } from 'react';

const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch(url);
    const json = await response.json();
    setData(json);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return { data, setData, loading };
};

export default useApi;
