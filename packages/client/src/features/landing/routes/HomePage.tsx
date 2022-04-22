import ReactFullpage from '@fullpage/react-fullpage';
import { FunctionComponent } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import 'fullpage.js/vendors/scrolloverflow';

export const HomePage: FunctionComponent = () => {
  return (
    <>
      <div className="sticky bg-black top-0 border-b-2 border-console flex h-[60px] items-center px-7 justify-between">
        <p className="bg-black text-console font-jbmono text-lg font-extrabold tracking-[0.015em]">
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
