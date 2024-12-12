import React from 'react'
import PageHeader from '../../components/Common/PageHeader';

function PowerBidashboard() {
  return (
    <>
      <PageHeader

            headerTitle="Performance View Report"
          />
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <iframe
        src="https://app.powerbi.com/view?r=eyJrIjoiNzY3NGE2Y2ItYzM4Yi00M2IxLTgzZGQtOTI3YmMxYzk3ZmVlIiwidCI6IjJhZTgyM2ViLTE3YTYtNDIyOS1iOGNiLTFiMGI0ZDJhNDM1MyJ9"
        title="Full Screen Iframe"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        allowFullScreen
      ></iframe>
    </div>
    </>
  )
}

export default PowerBidashboard
