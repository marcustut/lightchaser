import { Icon } from '@iconify/react';
import { Button, Card, Col, Container, Input, Row, Text, Loading } from '@nextui-org/react';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { toast } from 'react-toastify';

import { trpc } from '@/lib/trpc';
import { useUser } from '@/store/useUser';
import { fade } from '@/utils/animation';

export const Posts: FunctionComponent = () => {
  const [scrolling, setScrolling] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [content, setContent] = useState<string>('');
  const { user } = useUser();
  const mutation = trpc.useMutation('post.add');
  const likeMutation = trpc.useMutation('post.like');
  const unlikeMutation = trpc.useMutation('post.unlike');
  const posts = trpc.useQuery(['post.all']);

  const submitHandler = useCallback(async () => {
    if (!user) {
      toast('You have to sign in first', { type: 'error' });
      return;
    }
    if (content.length === 0) {
      toast('You cannot submit nothing', { type: 'error' });
      return;
    }
    await mutation.mutateAsync({ content, identityCardNumber: user.identityCardNumber });
    toast('Post submitted', { type: 'success' });
    posts.refetch();
  }, [content, mutation, posts, user]);

  const likePost = useCallback(
    async (postId: number) => {
      if (!user) {
        toast('You have to sign in first', { type: 'error' });
        return;
      }
      await likeMutation.mutateAsync({ postId, identityCardNumber: user.identityCardNumber });
      if (likeMutation.error) {
        toast('error liking post', { type: 'error' });
        return;
      }
      posts.refetch();
    },
    [likeMutation, posts, user]
  );

  const unlikePost = useCallback(
    async (postId: number) => {
      if (!user) {
        toast('You have to sign in first', { type: 'error' });
        return;
      }
      await unlikeMutation.mutateAsync({ postId, identityCardNumber: user.identityCardNumber });
      if (unlikeMutation.error) {
        toast('error liking post', { type: 'error' });
        return;
      }
      posts.refetch();
    },
    [posts, unlikeMutation, user]
  );

  const scrollHandler = useCallback(() => {
    setScrolling(true);
    if (!timer) clearTimeout(timer);
    setTimer(setTimeout(() => setScrolling(false), 1000));
  }, [timer]);

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [scrollHandler]);

  const inner = (
    <div style={{ paddingBottom: '70px', fontFamily: "'JetBrains Mono', 'ui-monospace'" }}>
      <div
        className="sticky bg-black top-0 border-b-2 border-console flex h-[60px] items-center px-7 justify-between mb-4"
        style={{ zIndex: 1000 }}
      >
        <div className="bg-black text-console font-jbmono text-lg font-extrabold tracking-[0.015em]">
          <Typewriter
            typeSpeed={150}
            words={['你有什么想对制作团队说？']}
            loop={1}
            cursor
            cursorStyle="█"
          />
        </div>
        <span className="text-lg font-jbmono text-console">{'>'}</span>
      </div>
      {!posts.data ? (
        <Loading type="points" />
      ) : posts.data.length === 0 ? (
        <Text
          color="success"
          weight="semibold"
          css={{
            mx: '$10',
            letterSpacing: '$normal',
            fontFamily: "'JetBrains Mono', 'ui-monospace'",
          }}
        >
          No posts yet
        </Text>
      ) : (
        posts.data
          .sort((a, b) => b.PostLike.length - a.PostLike.length)
          .map(({ id, content, Onwer, PostLike }) => (
            <Card key={id} css={{ borderWidth: '0', background: 'transparent' }}>
              <Text
                as="div"
                color="primary"
                weight="medium"
                css={{ fontFamily: "'JetBrains Mono', 'ui-monospace'" }}
              >
                <Text
                  color="primary"
                  weight="bold"
                  css={{ display: 'inline', fontFamily: "'JetBrains Mono', 'ui-monospace'" }}
                >
                  {`${Onwer.name} (LIGHT${Onwer.teamId}): `}
                </Text>
                {content}
              </Text>
              <Row justify="flex-end" align="center" css={{ marginTop: '$4' }}>
                <Col style={{ marginRight: 'auto' }}>
                  <Text color="warning" weight="black">
                    + {PostLike.length}
                  </Text>
                </Col>
                {user && PostLike.find((pl) => pl.userId === user.identityCardNumber) ? (
                  <Button color="success" rounded shadow auto onClick={() => unlikePost(id)}>
                    <Icon icon="heroicons-outline:thumb-up" />
                  </Button>
                ) : (
                  <Button color="success" rounded flat auto onClick={() => likePost(id)}>
                    <Icon icon="heroicons-outline:thumb-up" />
                  </Button>
                )}
              </Row>
            </Card>
          ))
      )}
      <Container css={{ position: 'fixed', bottom: '$10', zIndex: '$2' }}>
        {user ? (
          <Input
            aria-label="message-input-box"
            placeholder="Type your message..."
            fullWidth
            rounded
            contentLeftStyling={false}
            contentLeft={
              <Text
                color="primary"
                css={{ marginLeft: '$8', fontFamily: "'JetBrains Mono', 'ui-monospace'" }}
              >
                {'>'}
              </Text>
            }
            contentRightStyling={false}
            contentRight={
              <Button color="success" flat rounded auto onClick={submitHandler}>
                <Icon icon="cil:send" />
              </Button>
            }
            onChange={(e) => setContent(e.target.value)}
            css={{
              animation: `${
                !scrolling
                  ? fade({ x: 0, y: 50, opacity: 0 }, { x: 0, y: 0, opacity: 1 })
                  : fade({ x: 0, y: 0, opacity: 1 }, { x: 0, y: 100, opacity: 0 })
              } 0.5s ease forwards`,
            }}
          />
        ) : (
          <Row
            css={{
              background: '$accents1',
              paddingTop: '$3',
              paddingBottom: '$3',
              paddingLeft: '$6',
              paddingRight: '$6',
              borderRadius: '$md',
              animation: `${
                !scrolling
                  ? fade({ x: 0, y: 50, opacity: 0 }, { x: 0, y: 0, opacity: 1 })
                  : fade({ x: 0, y: 0, opacity: 1 }, { x: 0, y: 100, opacity: 0 })
              } 0.5s ease forwards`,
            }}
          >
            <Text weight="medium" color="warning">
              Sign in to like and create post
            </Text>
          </Row>
        )}
      </Container>
    </div>
  );

  return inner;
};
