import { Col, Loading, Row, Table, Text } from '@nextui-org/react';
import type { Contact } from '@opening/server/dist/entity/contact';
import { FunctionComponent } from 'react';

import { AppLayout, Center } from '@/components';
import { trpc } from '@/lib/trpc';

type ColumnUID = 'name' | 'description' | 'contactNumber' | 'actions';
type Column = { column: string; uid: ColumnUID };

export const Help: FunctionComponent = () => {
  const contacts = trpc.useQuery(['contact.all']);

  const columns: Column[] = [
    { column: 'NAME', uid: 'name' },
    { column: 'DESCRIPTION', uid: 'description' },
    { column: 'CONTACT NUMBER', uid: 'contactNumber' },
    { column: 'ACTIONS', uid: 'actions' },
  ];

  const renderCell = (contact: Contact, columnKey: ColumnUID) => {
    switch (columnKey) {
      case 'name':
        return <Text>{contact.name}</Text>;
      case 'description':
        return <Text>{contact.description}</Text>;
      case 'contactNumber':
        return <Text>{contact.contactNumber}</Text>;
      case 'actions':
        return (
          <Row justify="center" align="center">
            <Col css={{ d: 'flex' }}>actions</Col>
          </Row>
        );
    }
  };

  return (
    <AppLayout
      bottomAppBarProps={{
        options: [
          {
            href: '/admin/timer',
            icon: 'heroicons-outline:clock',
            text: 'Timer (Admin)',
          },
          {
            href: '/admin/help',
            icon: 'heroicons-outline:phone-outgoing',
            text: 'Help (Admin)',
          },
        ],
      }}
      css={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 84px)',
      }}
    >
      {contacts.isFetching ? (
        <Center style={{ height: 'calc(100vh - 84px)' }}>
          <Loading />
        </Center>
      ) : !contacts.data ? (
        <Text color="error">Something went wrong</Text>
      ) : (
        <Table
          aria-label="CRUD Table for contacts"
          containerCss={{ height: 'auto', minWidth: '100%', borderWidth: '0' }}
        >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column
                key={column.uid}
                hideHeader={column.uid === 'actions'}
                align={column.uid === 'actions' ? 'center' : 'start'}
              >
                {column.column}
              </Table.Column>
            )}
          </Table.Header>
          {contacts.data.length === 0 ? (
            <Text>No data at the moment</Text>
          ) : (
            <Table.Body items={contacts.data}>
              {(item) => (
                <Table.Row key={item.contactNumber}>
                  {(columnKey) => (
                    <Table.Cell>{renderCell(item, columnKey as ColumnUID)}</Table.Cell>
                  )}
                </Table.Row>
              )}
            </Table.Body>
          )}
        </Table>
      )}
    </AppLayout>
  );
};
