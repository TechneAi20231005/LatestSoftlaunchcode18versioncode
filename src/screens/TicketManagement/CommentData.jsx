import React, { useEffect, useState } from "react";

export default function CommentsData(props) {
  const [data, setData] = useState();
  const content = "Hey my number is 555-555-5555.";
  const [string, setString] = useState();
  const loadData = async () => {
    const deta = props.data;
    setData(deta);
  };

  useEffect(() => {
    loadData();
  }, [data]);

  
  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: props.data.replace(
            /@(\w+\s\w+)/g,
            '<span style="color: blue;">@$1</span>'
          ),
        }}
      ></div>
    </>
  );
}