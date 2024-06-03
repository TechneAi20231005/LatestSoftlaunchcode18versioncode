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

    if (Object.keys(localStorage).length < Object.keys(sessionStorage).length) {
      for (var a in sessionStorage) {
        localStorage.setItem(a, sessionStorage[a]);
      }
    } else {
      for (var a in localStorage) {
        sessionStorage.setItem(a, localStorage[a]);
      }
    }
    return (
      <div className="d-none d-lg-block ">
        <div>
          <h1
            style={{ fontFamily: 'Georgia, serif' }}
            className="color-900 text-center"
          >
            My-Task
          </h1>
          <h2 style={inlineStyles}>Let's Manage Better</h2>
        </div>

        <div className="text-center">
          <img src={Logo} alt="login-img" />
        </div>
      </div>
    );
  }
}
export default LeftSide;
