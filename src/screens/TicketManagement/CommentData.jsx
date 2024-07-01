import React, { useCallback, useEffect, useState } from 'react';

export default function CommentsData(props) {
  const [data, setData] = useState();




  const loadData = useCallback( async () => {
    const deta = props.data;
    setData(deta);
  },[props.data]);

  useEffect(() => {
    loadData();
  }, [data, loadData]);

  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: props.data.replace(
            /@(\w+\s\w+)/g,
            '<span style="color: blue;">@$1</span>'
          )
        }}
      ></div>
    </>
  );
}
