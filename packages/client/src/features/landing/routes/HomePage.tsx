import ReactFullpage from '@fullpage/react-fullpage';
import { FunctionComponent } from 'react';
import { Typewriter } from 'react-simple-typewriter';

export const HomePage: FunctionComponent = () => {
  return (
    <ReactFullpage
      autoScrolling={false}
      licenseKey="K9AK9-EL76I-2JI57-R5H7J-JXPMO"
      render={() => (
        <div className="w-screen h-screen relative">
          <div className="sticky top-0 border-b-2 border-console flex h-[60px] items-center px-7 justify-end">
            <button className="transition ease duration-75 px-4 py-1 font-mono text-lg bg-console hover:bg-disabled rounded-lg">
              SIGN IN
            </button>
          </div>
          <ReactFullpage.Wrapper>
            <div className="flex justify-center items-center p-5 section">
              <p className="text-console font-mono text-3xl font-extrabold tracking-[0.015em]">
                <Typewriter
                  typeSpeed={150}
                  words={['Welcome to Light Chaser']}
                  loop={1}
                  cursor
                  cursorStyle="█"
                />
              </p>
            </div>
            <div className="flex justify-center items-center p-5 section">
              <p className="text-console font-mono text-3xl font-extrabold tracking-[0.015em]">
                <Typewriter typeSpeed={150} words={['2']} loop={1} cursor cursorStyle="█" />
              </p>
            </div>
          </ReactFullpage.Wrapper>
        </div>
      )}
    />
  );
};
