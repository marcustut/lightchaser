import { FunctionComponent, useState } from 'react';

const colors = ['#8ae234', '#ef2929', '#fce94f', '#32afff', '#ad7fa8', '#34e2e2'];
const emojis = ['🚀', '✨', '💕', '👽', '👾', '🐙', '💣'];
const fakeUsers = ['Adam', 'Eve', 'Cain', 'Abel'];

export const L5Screen: FunctionComponent = () => {
  const [users, setUsers] = useState(fakeUsers);
  return (
    <div className="flex w-full h-screen">
      <div className="w-full h-screen bg-[url('/images/grid.png')] bg-cover text-console font-mono border-2 border-console p-10 rounded-3xl relative">
        <button
          className="rounded-xl border-console border-2 mb-2 px-5"
          onClick={() => setUsers([...users, fakeUsers[Math.floor(Math.random() * (3 + 1))]])}
        >
          Add User
        </button>
        <p className="text-[6rem] mb-10">Welcome to YW Light Chaser 🚀✨</p>
        <div className="h-4/5 overflow-hidden">
          {users.map((s) => (
            <p
              key={s}
              className="text-[2.5rem] mb-1"
              style={{
                color: colors[Math.floor(Math.random() * (5 + 1))],
              }}
            >
              {s} has joined the chat. {emojis[Math.floor(Math.random() * emojis.length)]}
            </p>
          ))}
        </div>
      </div>
      {/* <div className="w-1/5 h-screen border-console border-2">XD</div> */}
    </div>
  );
};
