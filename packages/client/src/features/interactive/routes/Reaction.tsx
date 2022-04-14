import GraphemeSplitter from 'grapheme-splitter';
import { FunctionComponent, useState } from 'react';
import { toast } from 'react-toastify';

import { trpc } from '@/lib/trpc';

const reactionEmojis = ['💕', '🔥', '✨', '👾', '👽', 'SEND'];

const WELCOME_TEXT = 'Send and look at the screen! 🤯';
const TOAST_TTL = 2000;

export const InteractiveReaction: FunctionComponent = () => {
  const [textString, setTextString] = useState(WELCOME_TEXT);
  const mutation = trpc.useMutation('addEmoji');

  const emojiSplitter = new GraphemeSplitter();

  const sendButtonHandler = () => {
    if (textString === 'SENT!' || textString === WELCOME_TEXT) {
      toast('You must choose one or more emoji', { type: 'error' });
      return;
    }
    // FIXME: Change uid to an actual user id
    mutation.mutate({ emoji: textString, uid: 'randomUID' });
    if (mutation.isError) {
      toast("You're sending too fast, slow down 😅", { type: 'error' });
    } else {
      toast(`${textString} successfully sent!`, { type: 'success', autoClose: TOAST_TTL });
      setTextString('SENT!');
    }
  };

  return (
    <div className="h-screen w-screen flex-col">
      <div className="flex justify-center h-3/5 items-center w-full relative">
        <p className="text-3xl text-center">{textString}</p>
        <div className="absolute z-10 bottom-3 h-[40px] px-5 w-full">
          <button
            disabled={textString == WELCOME_TEXT || textString == 'SENT!' || textString == ''}
            className={`border-2 rounded-2xl ${
              textString !== WELCOME_TEXT && textString !== 'SENT!' && textString !== ''
                ? 'bg-console border-console '
                : 'bg-[#066510] border-[#066510]'
            }  h-full w-full`}
            onClick={() => setTextString('')}
          >
            Clear
          </button>
        </div>
      </div>
      <div className="h-2/5 rounded-t-2xl border-console border-t-2 border-l-2 border-r-2 w-full p-5 grid grid-cols-3 gap-3">
        {reactionEmojis.map((s) => (
          <EmojiButton
            key={s}
            emoji={s}
            onClick={() => {
              s !== 'SEND'
                ? setTextString(
                    textString !== 'SENT!' && emojiSplitter.countGraphemes(textString) < 6
                      ? textString.concat(s)
                      : emojiSplitter.countGraphemes(textString) == 6
                      ? textString
                      : s
                  )
                : textString !== ''
                ? sendButtonHandler()
                : setTextString(textString);
            }}
          />
        ))}
      </div>
    </div>
  );
};

interface EmojiButtonProps {
  emoji: string;
  onClick: () => void;
}

const EmojiButton: FunctionComponent<EmojiButtonProps> = ({ emoji, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="border-2 text-console font-bold font-lato border-console rounded-2xl w-full text-2xl h-full flex justify-center items-center"
    >
      {emoji}
    </button>
  );
};
