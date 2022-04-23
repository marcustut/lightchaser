/* eslint-disable react/jsx-no-undef */
import ReactFullpage, { fullpageApi } from '@fullpage/react-fullpage';
import { FunctionComponent, useState } from 'react';
import { Typewriter } from 'react-simple-typewriter';

import 'fullpage.js/vendors/scrolloverflow';

interface FullpageWrapperProps {
  api?: fullpageApi;
  state?: any;
  skipStory?: boolean;
}

const FullpageWrapper: FunctionComponent<FullpageWrapperProps> = ({ skipStory = false }) => {
  const [ended1, setEnded1] = useState<boolean>(false);
  const [ended2, setEnded2] = useState<boolean>(false);
  const [ended3, setEnded3] = useState<boolean>(false);
  const [ended4, setEnded4] = useState<boolean>(false);
  return (
    <ReactFullpage.Wrapper>
      {!skipStory && (
        <div className="section" style={{ display: 'flex' }}>
          <div className="flex flex-col mt-2 p-5">
            <div className="flex flex-col mb-5">
              <p className="font-chi text-white text-3xl" style={{ margin: 0 }}>
                追光者
              </p>
              <p
                className="font-bmonument text-white text-2xl tracking-wider"
                style={{ margin: 0 }}
              >
                Light Chaser
              </p>
            </div>
            <p className="font-bold whitespace-pre-wrap text-console text-lg">
              <Typewriter
                typeSpeed={100}
                words={[
                  '此刻太阳的寿命还剩4个小时。\n\n4小时后，地球将变得一片漆黑而一切都走向灭亡。唯一解救的方法，需要从神秘基地收集光的能量来重启。人类已经崛起并聚集成为无数的小队克服障碍找寻能量。\n\n光的能量足够供应给一个小队\n其他的小队将面对灭亡。',
                ]}
                loop={1}
                cursor
                cursorStyle="█"
              />
            </p>
          </div>
        </div>
      )}
      <div className="section" style={{ display: 'flex' }}>
        <div className="flex flex-col mt-2 p-5">
          <div className="flex flex-col mb-5">
            <p className="font-chi text-white text-3xl " style={{ margin: 0 }}>
              斗技场
            </p>
            <p className="font-bmonument text-white text-2xl tracking-wider" style={{ margin: 0 }}>
              Chaos Arena
            </p>
          </div>
          <p className="font-bold whitespace-pre-wrap  text-console text-lg mb-5 leading-tight">
            <Typewriter
              typeSpeed={100}
              words={[
                '光的能量四处散发。\n\n只有兼具勇气信心的勇士们\n方能获取光的能量。\n重重的考验，\n将会筛选出最有能力的人。\n\n你是那个被拣选\n恢复太阳的勇士吗?',
              ]}
              loop={1}
              cursor
              cursorStyle="█"
              onLoopDone={() => setEnded1(true)}
            />
          </p>
          {ended1 ? (
            <div className="flex justify-center items-center">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/light-chaser.appspot.com/o/chaosArena.png?alt=media&token=3f277ea9-fa53-456f-808a-cb044b892e2d"
                alt="Chaos Arena Map"
                className="rounded-[2rem] border-2  object-cover w-[300px] border-console p-2"
              />
            </div>
          ) : null}
        </div>
      </div>
      <div className="section" style={{ display: 'flex' }}>
        <div className="flex flex-col mt-2 p-5">
          <div className="flex flex-col  mb-5">
            <p className="font-chi text-white text-3xl " style={{ margin: 0 }}>
              黑市
            </p>
            <p className="font-bmonument text-white text-2xl tracking-wider" style={{ margin: 0 }}>
              Black Market
            </p>
          </div>
          <p className="font-bold whitespace-pre-wrap text-console text-lg mb-5 leading-tight">
            <Typewriter
              typeSpeed={100}
              words={[
                '在这不被任何规矩束缚下的地带，\n猖狂的非法买卖正在进行当中。\n\n消息指出光的能量曾经出现在黑市里，可是这罪案泛滥的地方，将会带来什么危险?\n\n而你，\n能够在这个地方成功进入富人区获得光能量吗?',
              ]}
              loop={1}
              cursor
              cursorStyle="█"
              onLoopDone={() => setEnded2(true)}
            />
          </p>
          {ended2 ? (
            <div className="flex justify-center items-center">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/light-chaser.appspot.com/o/blackMarket.png?alt=media&token=3f277ea9-fa53-456f-808a-cb044b892e2d"
                alt="Black Market Map"
                className="rounded-[2rem] border-2  object-cover w-[300px] border-console p-2"
              />
            </div>
          ) : null}
        </div>
      </div>
      <div className="section" style={{ display: 'flex' }}>
        <div className="flex flex-col mt-2 p-5">
          <div className="flex flex-col  mb-5">
            <p className="font-chi text-white text-3xl " style={{ margin: 0 }}>
              遗忘领域
            </p>
            <p className="font-bmonument text-white text-2xl tracking-wider" style={{ margin: 0 }}>
              Lost Zone
            </p>
          </div>
          <p className="font-bold whitespace-pre-wrap text-console text-lg mb-5 leading-tight">
            <Typewriter
              typeSpeed={100}
              words={[
                '曾经的曾经，这里是辉煌的地方\n这里的人每日活在明媚的太阳下。\n\n但是却因为如此也被其他势力针对\n导致这个地方完全的被遗忘了\n\n最近有研究报告显示，\n能量电波从这地方发出。\n你被差派前往这地方获取光能量\n你能够安全地完成任务吗?',
              ]}
              loop={1}
              cursor
              cursorStyle="█"
              onLoopDone={() => setEnded3(true)}
            />
          </p>
          {ended3 ? (
            <div className="flex justify-center items-center">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/light-chaser.appspot.com/o/lostZone.png?alt=media&token=3f277ea9-fa53-456f-808a-cb044b892e2d"
                alt="Lost Zone Map"
                className="rounded-[2rem] border-2  object-cover w-[300px] border-console p-2"
              />
            </div>
          ) : null}
        </div>
      </div>
      <div className="section" style={{ display: 'flex' }}>
        <div className="flex flex-col mt-2 p-5">
          <div className="flex flex-col  mb-5">
            <p className="font-chi text-white text-3xl " style={{ margin: 0 }}>
              无限城市
            </p>
            <p className="font-bmonument text-white text-2xl tracking-wider" style={{ margin: 0 }}>
              Infinity City
            </p>
          </div>
          <p className="font-bold whitespace-pre-wrap text-console text-lg mb-5 leading-tight">
            <Typewriter
              typeSpeed={100}
              words={[
                '梦想盼望，繁忙辉煌，\n这是人们形容这个地方用的词汇。\n可偏偏，繁忙也带来的麻烦。\n\n黑暗势力已经发现了光能量的存在\n并且利用了多重密码锁了起来\n\n你能够扭转这个局面吗?\n你可以能够成为这个时代的英雄吗?',
              ]}
              loop={1}
              cursor
              cursorStyle="█"
              onLoopDone={() => setEnded4(true)}
            />
          </p>
          {ended4 ? (
            <div className="flex justify-center items-center">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/light-chaser.appspot.com/o/infinityCity.png?alt=media&token=3f277ea9-fa53-456f-808a-cb044b892e2d"
                alt="Infinity City Map"
                className="rounded-[2rem] border-2  object-cover w-[300px] border-console p-2"
              />
            </div>
          ) : null}
        </div>
      </div>
    </ReactFullpage.Wrapper>
  );
};

interface HomePageProps {
  topBar?: boolean;
  skipStory?: boolean;
}

export const HomePage: FunctionComponent<HomePageProps> = ({
  topBar = true,
  skipStory = false,
}) => {
  return (
    <>
      {topBar && (
        <div className="sticky bg-black top-0 border-b-2 border-console flex h-[60px] items-center px-7 justify-between z-10">
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
      )}
      <ReactFullpage
        autoScrolling
        scrollBar={false}
        keyboardScrolling
        scrollOverflow={false}
        debug
        anchors={['Title', 'ChaosArena', 'BlackMarket', 'LostZone', 'InfinityCity']}
        licenseKey="596092E9-41624545-A1E5A2C7-C11E8634"
        render={({ fullpageApi, state }) => (
          <FullpageWrapper api={fullpageApi} state={state} skipStory={skipStory} />
        )}
      />
    </>
  );
};
