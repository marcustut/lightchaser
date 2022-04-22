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
        <p className="font-chi text-2xl text-console">游戏玩法</p>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col justify-center items-center mb-10">
          {text?.map((t) =>
            t.startsWith('P/S', 0) ? (
              <p className="text-disabled text-center font-chi mb-1" key={t}>
                {t}
              </p>
            ) : (
              <p className="text-white text-center font-chi text-xl mb-4" key={t}>
                {t}
              </p>
            )
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
