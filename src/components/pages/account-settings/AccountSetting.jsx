import { Col, ModalBody, Row } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import * as strUtils from '../../../utils/stringUtils';
import Button from 'react-bootstrap/Button';

import { CardComponent } from './Card';
import Copyright from '../../UI/footer/Copyright';
import ChangePassword from '../../../components/pages/auth/change-password/ChangePassword';
import ChangedPasswordSuccess from '../auth/change-password/success/ChangedPasswordSuccess';
import API from '../../../utils/apiUtils';
import useFetch from '../../../hooks/useFetch';
import * as userSelectors from '../../../redux/user/user-selectors';
import Container from 'react-bootstrap/Container';
import { connect, useStore } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import './AccountSetting.scss';
import { useEffect, useState } from 'react';

const AccountSetting = ({
  userToken,
  currentUser,
  portfolios,
  accountSetting,
  handleClose,
  loggedIn,
  displayPasswordModal,
  handleToggleDisplayPasswordModal,
  displayPasswordSuccessModal
}) => {
  const [userDetails, setUserDetails] = useState(null);
  console.log("sxsxsxsxsaaaa")
  console.log(portfolios)
  console.log("sxsxsxsxsaaaa")
  const [currentPortfolio, setCurrentPortfolio] = useState(null);
  // for fetching
  const {
    sendRequest: sendGetUserDetailsRequest,
    loading: getUserDetailsLoading
  } = useFetch();
  useEffect(() => {
    const userId = currentUser?.userId;
    if (!accountSetting) return;
    const res = sendGetUserDetailsRequest(
      API.fetchUserDetails(userId, userToken)
    );
    res.then(data => {
      setUserDetails(data);
      setCurrentPortfolio(portfolios[0]);
    });
  }, [accountSetting]);
  const displayName = userDetails
    ? strUtils.toTitleCase(userDetails?.firstName + ' ' + userDetails?.lastName)
    : '';
  const role = strUtils.toTitleCase(
    userDetails?.roles && userDetails?.roles.length > 0
      ? userDetails?.roles.filter(
          item => item.roleType.toLowerCase() === 'access'
        )[0].name
      : '-'
  );
  const userCardBodyContent = {
    0: (
      <div className='mt-2 d-inline-flex'>
        <img
          src='/images/icons/mail-outline.svg'
          alt='mail-svg-icon'
          className='card-icon me-2'
        />
        <span>{userDetails?.emailId}</span>
      </div>
    ),
    1: (
      <div className='mt-2 d-inline-flex'>
        <img
          src='/images/icons/phone-outline.svg'
          alt='phone-svg-icon'
          className='card-icon me-2'
        />
        <span>{userDetails?.contactNumber}</span>
      </div>
    ),
    2: <hr className='bg-danger border-2 border-top border-secondary' />,
    3: (
      <div className='mt-2 d-inline-flex'>
        <img
          src='/images/icons/user-outline.svg'
          alt='user-svg-icon'
          className='card-icon me-2'
        />
        <span>{role}</span>
      </div>
    )
  };
  const portfolioCardBodyContent = {
    1: (
      <div className='mt-2 d-inline-flex'>
        <span>
          {' '}
          Floor Count:{' '}
          {currentPortfolio?.floorCount ? currentPortfolio.floorCount : '- '}
        </span>
      </div>
    ),
    2: <hr className='bg-danger border-2 border-top border-secondary' />,
    3: (
      <div className='mt-2 d-inline-flex'>
        <span>
          {' '}
          Location: {currentPortfolio?.street ? currentPortfolio.street : '-'}
        </span>
      </div>
    ),
    4: (
      <div className='mt-2 d-inline-flex'>
        <span>
          {' '}
          City: {currentPortfolio?.city ? currentPortfolio.city : '-'}
        </span>
      </div>
    ),
    5: (
      <div className='mt-2 d-inline-flex'>
        <span>
          {' '}
          Country: {currentPortfolio?.country ? currentPortfolio.country : '-'}
        </span>
      </div>
    )
  };

  return (
    <>
      <Modal fullscreen show={accountSetting} id='accountSettingsModal'>
        <ModalBody className='create__password__wrapp forgot__password auth__wrapper py-5 position-relative ms-5'>
          {/* <Row >
                <div className="page__header d-flex align-items-center mt-5">
                    <span >Profile / Account</span>
                </div>
            </Row> */}
          {/* <Row className='mt-5 greeting'>
                <div> Greetings from <span>insuretek</span> !</div>
            </Row> */}
          <div class='py-3 py-md-4 py-lg-5'>&nbsp;</div>
          <Row>
            <Col>
              <h2>Account Settings</h2>
            </Col>
          </Row>
          <Row className='mt-5 account-settings-wrapper'>
            <div className='box1 mb-2'>
              <CardComponent
                cardClassName='border-0  shadow-none'
                title='My Info'
                bodyHeader={displayName ? displayName : 'Username'}
                headerClassName='card-body-header'
                cardBodyContent={userCardBodyContent}
              />
            </div>
            <div className='box2 mb-2'>
              <CardComponent
                cardClassName='border-0 shadow-none'
                title='My Portfolio'
                bodyHeader={
                  currentPortfolio ? currentPortfolio.name : 'Portfolio Name'
                }
                headerClassName='card-body-header'
                cardBodyContent={portfolioCardBodyContent}
              />
            </div>
            <div className='box3 mb-2'>
              <a onClick={handleToggleDisplayPasswordModal} className='fs18'>
                <u>Change Password</u>
              </a>
              <Modal
                show={displayPasswordModal}
                fullscreen
                id='changePasswordModal'
              >
                <Container>
                  <ChangePassword
                    handleToggleDisplayPasswordModal={
                      handleToggleDisplayPasswordModal
                    }
                    displayPasswordModal={displayPasswordModal}
                  />
                </Container>
              </Modal>
              <Modal show={displayPasswordSuccessModal} fullscreen>
                <ChangedPasswordSuccess softPasswordChange={true} />
              </Modal>
            </div>
          </Row>
          <Button
            type='button'
            variant='primary'
            className='rounded'
            onClick={handleClose}
          >
            {' '}
            Close
          </Button>
          <div className='mt-3'>
            <Copyright />
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  loggedIn: userSelectors.selectUserLoggedIn,
  userToken: userSelectors.selectUserToken
});

export default connect(mapStateToProps)(AccountSetting);
