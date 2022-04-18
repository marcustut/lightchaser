import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useS2 } from '@/store/useS2';
import { useTech } from '@/store/useTech';
import { toast } from '@/utils/toast';

const items = [
  {
    name: 'ak',
    imgSrc: 'https://qph.cf2.quoracdn.net/main-qimg-a91f33388a0973cbf30589bd42dfe0f8',
    price: 39.0,
  },
  {
    name: 'm4a4',
    imgSrc:
      'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhh3szLeC9B-dWilo-KhfPLILLdgG5D18l4jeHVyoD0mlOx5UQ9YDv7IoacdABvZl-CqQO2wOzr1JTvv5Wan3YxuiQm7CmJmhG100lSLrs4MXikTMk/360fx360f',
    price: 27.0,
  },
  {
    name: 'hegrenade',
    imgSrc:
      'https://preview.redd.it/9q7buaor6f621.png?auto=webp&s=1ac1cdde854851ae586b98cc2bbf01034f8981e2',
    price: 13.0,
  },
  {
    name: 'awm',
    imgSrc: 'https://lite.pubg.com/guide/img/sr_awm.a543c81f.png',
    price: 38.0,
  },
  {
    name: 'scarL',
    imgSrc: 'https://i.pinimg.com/originals/0d/ce/dc/0dcedc02f5ce44c1440e4139eb7928cf.png',
    price: 13.0,
  },
  {
    name: 'm416',
    imgSrc:
      'https://community.cloudflare.steamstatic.com/economy/image/-8zOYQcPJoBYU7uKzjw0RZajjFiA_AojfFoacglhStOfdn6gbpcbDuuPIxAI88oRKiDop4odQy9UTOmvsw_2W9ArPI-2F4HcTWrmNvupvSy_mQ/360fx360f',
    price: 12.0,
  },
  {
    name: 'revolver',
    imgSrc:
      'https://purepng.com/public/uploads/large/purepng.com-classic-western-revolvermetaldangergunmodernshoot-401520458353lqhcu.png',
    price: 65.0,
  },
];

export const S2: FunctionComponent = () => {
  const { amount } = useS2();
  const navigate = useNavigate();
  const { pass } = useTech();

  return (
    <div className="w-screen h-screen px-5 pb-5 overflow-x-hidden">
      <div className="sticky top-0 bg-black py-3 z-[10]">
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-xl tracking-wider text-console">Wallet Amount: </p>
          <div className="rounded-xl border-[2px] border-console text-console font-mono text-xl w-[130px] text-center bg-black">
            RM 500.00
          </div>
        </div>
        <div className="flex justify-between">
          <p className="font-mono text-3xl tracking-wider text-console">Items</p>
          <button
            onClick={() => {
              console.log(amount);
              if (amount !== 0) {
                toast(false);
              } else {
                toast(true);
                navigate('/tech');
                pass(2);
              }
            }}
            className="text-white bg-console rounded-xl w-[150px] py-1"
          >
            Buy
          </button>
        </div>
      </div>
      <div>
        {items.map((i, key) => (
          <ItemCard key={key} price={i.price} imgSrc={i.imgSrc} amount={amount} />
        ))}
      </div>
    </div>
  );
};

interface ItemCardProps {
  imgSrc: string;
  price: number;
  amount: number;
}

const ItemCard: FunctionComponent<ItemCardProps> = ({ imgSrc, price }) => {
  const { amount, setAmount } = useS2();
  const [quantity, setQuantity] = useState(0);

  const handleIncrement = () => {
    if (quantity !== 10) {
      setQuantity((prev) => prev + 1);
      setAmount(amount - price);
    }
  };

  const handleDecrement = () => {
    if (quantity !== 0) {
      setQuantity((prev) => prev - 1);
      setAmount(amount + price);
    }
  };

  return (
    <div className="flex w-full items-center rounded-lg border-2 border-console p-2 relative mb-2">
      <img
        className="rounded-lg border-[2px] border-console w-[100px] h-[100px] object-contain"
        src={imgSrc}
        alt={imgSrc}
      />
      <div className="flex-col mx-auto">
        <p className="font-mono text-2xl text-console">Price: RM{price.toFixed(2)}</p>
        <div className="flex justify-around ml-5 rounded-lg border-[2px] p-2 border-console mt-1">
          <button onClick={handleDecrement} className="font-mono text-2xl text-console">
            -
          </button>
          <p className="font-mono text-2xl text-console w-[30px] text-center">{quantity}</p>
          <button onClick={handleIncrement} className="font-mono text-2xl text-console">
            +
          </button>
        </div>
      </div>
    </div>
  );
};
