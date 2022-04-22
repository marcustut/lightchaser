/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import ReactFullpage from '@fullpage/react-fullpage';
import { Modal, Input, Button } from '@nextui-org/react';
import { FunctionComponent, useState } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import 'fullpage.js/vendors/scrolloverflow';

export const HomePage: FunctionComponent = () => {
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [otpReceived, setOtpReceived] = useState<boolean>(false);

  const closeHandler = () => setIsOpen(false);

  return (
    <>
      <div
        onClick={() => {
          setIsOpen(true);
        }}
        className="sticky bg-black top-0 border-b-2 border-console flex h-[60px] items-center px-7 justify-between"
      >
        <p className="text-console font-jbmono text-lg font-extrabold tracking-[0.015em]">
          <Typewriter
            typeSpeed={150}
            words={['Welcome to Light Chaser']}
            loop={1}
            cursor
            cursorStyle="█"
          />
        </p>
        <p className="text-lg font-jbmono text-console">{'>'}</p>
      </div>
      <Modal closeButton aria-labelledby="modal-title" open={modalIsOpen} onClose={closeHandler}>
        <Modal.Header>
          <img
            className="h-10 object-scale-down w-full"
            src="/images/LightChaser_Logo.png"
            alt="title"
          />
        </Modal.Header>
        <Modal.Body>
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Phone Number..."
            contentLeft={<p className="text-lg text-console">{'>'}</p>}
          />
          {!otpReceived ? (
            <div className="w-full flex justify-between">
              <Input bordered width="50px" color="primary" size="md" maxLength={1} />
              <Input bordered width="50px" color="primary" size="md" maxLength={1} />
              <Input bordered width="50px" color="primary" size="md" maxLength={1} />
              <Input bordered width="50px" color="primary" size="md" maxLength={1} />
              <Input bordered width="50px" color="primary" size="md" maxLength={1} />
              <Input bordered width="50px" color="primary" size="md" maxLength={1} />
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={closeHandler}>
            Close
          </Button>
          <Button auto onClick={closeHandler} disabled={!otpReceived}>
            Enter
          </Button>
        </Modal.Footer>
      </Modal>
      <ReactFullpage
        autoScrolling={false}
        scrollBar={false}
        keyboardScrolling
        scrollOverflow={false}
        normalScrollElementTouchThreshold={10}
        debug
        anchors={['1', '2']}
        licenseKey="596092E9-41624545-A1E5A2C7-C11E8634"
        render={() => (
          <ReactFullpage.Wrapper>
            <div className="flex justify-center items-center p-5 section">hi</div>
            <div className="flex justify-center items-center p-5 section">
              <p className="text-console font-mono text-3xl font-extrabold tracking-[0.015em]">
                <Typewriter typeSpeed={150} words={['2']} loop={1} cursor cursorStyle="█" />
              </p>
            </div>
          </ReactFullpage.Wrapper>
        )}
      />
    </>
  );
};
