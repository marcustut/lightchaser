import { Modal } from '@nextui-org/react';
import { FunctionComponent } from 'react';

interface GameInstructionProps {
  text?: string[];
  open: boolean;
  onClose: () => void;
}

export const GameInstruction: FunctionComponent<GameInstructionProps> = ({
  text,
  open,
  onClose,
}) => {
  return (
    <Modal open={open} animated onClose={() => onClose()}>
      <Modal.Header>
        <p className="font-chi text-2xl text-console">游戏须知</p>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col justify-center items-center mb-10">
          {text?.map((t) => (
            <p className="text-disabled font-chi text-xl" key={t}>
              {t}
            </p>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};
