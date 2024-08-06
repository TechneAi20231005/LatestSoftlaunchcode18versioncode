import React from 'react';

import Logo from '../../assets/images/logo.jpeg';

class LeftSide extends React.Component {
  render() {
    const inlineStyles = {
      fontFamily: 'Georgia, serif',
      color: '#d63384',
      textAlign: 'center',
      fontWeight: 'bold'
    };

    if (Object.keys(localStorage).length < Object.keys(localStorage).length) {
      for (var a in localStorage) {
        localStorage.setItem(a, localStorage[a]);
      }
    } else {
      for (var b in localStorage) {
        localStorage.setItem(b, localStorage[b]);
      }
    }
    return (
      <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center rounded-lg auth-h100">
        <div style={{ maxWidth: '25rem' }}>
          <div className="mb-5">
            <h1
              style={{ fontFamily: 'Georgia, serif' }}
              className="color-900 text-center"
            >
              My-Task
            </h1>
            <h2 style={inlineStyles}>Let's Manage Better</h2>
          </div>

          <div className="text-center mb-5">
            <img src={Logo} alt="login-img" />
          </div>
        </div>
      </div>
    );
  }
}
export default LeftSide;
