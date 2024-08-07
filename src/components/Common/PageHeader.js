import React from 'react';
import { Nav } from 'react-bootstrap';
import './style.scss';
class PageHeader extends React.Component {
  render() {
    const { headerTitle, isTabShow, renderRight, paddingStart, showBackBtn } =
      this.props;

    return (
      <div
        className="row align-items-center page_header_container"
        // style={{ marginTop: '-40px' }}
      >
        <div className="border-0">
          <div className="card-header no-bg bg-transparent d-md-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
            <h3
              className={`fw-bold mb-0 text_primary ps-${paddingStart} d-flex align-items-center`}
            >
              {showBackBtn && (
                <i
                  className="icofont-simple-left fs-2 back_icon_btn"
                  onClick={() => window.history.back()}
                />
              )}
              <span> {headerTitle}</span>
            </h3>
            {isTabShow ? (
              <div className="col-auto py-2 w-sm-100">
                <Nav
                  variant="pills"
                  className="nav nav-tabs tab-body-header rounded invoice-set"
                >
                  <Nav.Item>
                    <Nav.Link eventKey="Invoice List">Invoice List</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="Simple invoice">
                      Simple invoice
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="Email invoice">Email invoice</Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
            ) : null}
            {renderRight ? renderRight() : null}
          </div>
        </div>
      </div>
    );
  }
}

export default PageHeader;
