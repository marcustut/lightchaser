import { Modal, Text } from '@nextui-org/react';
import { FunctionComponent } from 'react';

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

export const WelcomeModal: FunctionComponent<WelcomeModalProps> = ({ open, onClose }) => {
  return (
    <Modal closeButton aria-labelledby="welcome-modal-title" open={open} onClose={onClose}>
      <Modal.Header id="welcome-modal-title">
        <div className="flex flex-col justify-center items-center">
          <img
            className="h-10 object-scale-down w-full"
            src="/images/LightChaser_Logo.png"
            alt="title"
          />
          <Text weight="medium" size="large" css={{ marginTop: '$8', marginBottom: '$8' }}>
            To continue logging in, click the button on the bottom right.
          </Text>
        </div>
      </Modal.Header>
    </Modal>
  );
};
