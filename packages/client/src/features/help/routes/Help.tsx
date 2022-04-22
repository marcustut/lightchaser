import { Card, CSS, Link, Loading, Text } from '@nextui-org/react';
import { FunctionComponent } from 'react';

import { AppLayout, Center } from '@/components';
import { trpc } from '@/lib/trpc';

interface ContactCardProps {
  name: string;
  description: string;
  contactNumber: string;
  css?: CSS;
}

const ContactCard: FunctionComponent<ContactCardProps> = ({
  name,
  description,
  contactNumber,
  css,
}) => {
  return (
    <Card hoverable css={{ borderWidth: '0', ...css }}>
      <Text h3 weight="semibold" size="large">
        {name}
      </Text>
      <Text color="$accents4" css={{ whiteSpace: 'pre-wrap' }}>
        {description}
      </Text>
      <Card.Footer>
        <Link css={{ color: '$blue500' }} href={`tel:${contactNumber}`}>
          📞 Open in Caller
        </Link>
        <Link
          css={{ color: '$green500', marginLeft: '$4' }}
          href={`https://wa.me/${contactNumber}`}
          target="_blank"
        >
          💬 Open in WhatsApp
        </Link>
      </Card.Footer>
    </Card>
  );
};

export const Help: FunctionComponent = () => {
  const contacts = trpc.useQuery(['contact.all']);

  return (
    <AppLayout css={{ py: '$4' }}>
      <Text h1 color="primary" weight="bold" size="xx-large">
        Emergency Contacts
      </Text>
      {contacts.isFetching ? (
        <Center style={{ height: 'calc(100vh - 84px)' }}>
          <Loading />
        </Center>
      ) : !contacts.data ? (
        <Text color="error">Something went wrong</Text>
      ) : contacts.data.length === 0 ? (
        <Center style={{ height: 'calc(100vh - 84px)' }}>
          <Text color="error" css={{ textAlign: 'center' }}>
            No contacts found 🥲
          </Text>
        </Center>
      ) : (
        contacts.data
          .sort((a, b) =>
            b.description > a.description ? 1 : a.description > b.description ? -1 : 0
          )
          .map(({ name, description, contactNumber }) => (
            <ContactCard
              key={name}
              name={name}
              description={description}
              contactNumber={contactNumber}
              css={{ mt: '$6' }}
            />
          ))
      )}
    </AppLayout>
  );
};
