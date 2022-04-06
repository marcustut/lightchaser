import GraphemeSplitter from 'grapheme-splitter';
import { FunctionComponent, useState } from 'react';

const reactionEmojis = ['💕', '🔥', '✨', '👾', '👽', 'SEND'];

export const InteractiveReaction: FunctionComponent = () => {
  const [textString, setTextString] = useState('Light Chaser! ✨');

  const emojiSplitter = new GraphemeSplitter();

  return (
    <div className="h-screen w-screen flex-col">
      <div className="flex justify-center h-3/5 items-center w-full relative">
        <p className="text-3xl text-center">{textString}</p>
        <div className="absolute z-10 bottom-3 h-[40px] px-5 w-full">
          <button
            disabled={textString == 'Light Chaser! ✨' || textString == 'SENT!' || textString == ''}
            className={`border-2 rounded-2xl ${
              textString !== 'Light Chaser! ✨' && textString !== 'SENT!' && textString !== ''
                ? 'bg-console border-console '
                : 'bg-[#066510] border-[#066510]'
            }  h-full w-full`}
            onClick={() => setTextString('')}
          >
            Clear
          </button>
        </div>
      </div>
      <div className="h-2/5 rounded-t-2xl border-console border-t-2 border-l-2 flex border-r-2 w-full p-5 grid grid-cols-3 gap-3">
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
                ? setTextString('SENT!')
                : setTextString(textString);
              console.log(textString);
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
