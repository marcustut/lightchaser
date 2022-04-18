import { Icon } from '@iconify/react';
import {
  Button,
  Col,
  Input,
  Loading,
  Modal,
  Row,
  Spacer,
  Table,
  Text,
  Textarea,
  Tooltip,
  useInput,
  useTheme,
} from '@nextui-org/react';
import type { Contact } from '@opening/server/dist/entity/contact';
import { FunctionComponent, useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { AppLayout, Center } from '@/components';
import { trpc } from '@/lib/trpc';

type ColumnUID = 'name' | 'description' | 'contactNumber' | 'actions';
type Column = { column: string; uid: ColumnUID };

export const Help: FunctionComponent = () => {
  const [modal, setModal] = useState({ edit: false, add: false, delete: false });
  const [currentContactNumber, setCurrentContactNumber] = useState<string>();
  const { value: name, setValue: setName, bindings: nameBindings } = useInput('');
  const {
    value: description,
    setValue: setDescription,
    bindings: descriptionBindings,
  } = useInput('');
  const {
    value: contactNumber,
    setValue: setContactNumber,
    bindings: contactNumberBindings,
  } = useInput('');
  const { theme } = useTheme();
  const contacts = trpc.useQuery(['contact.all']);
  const addContact = trpc.useMutation(['contact.add']);
  const deleteContact = trpc.useMutation(['contact.delete']);
  const updateContact = trpc.useMutation(['contact.update']);

  if (!theme) throw new Error('Theme is not loaded');

  const deleteHandler = useCallback(async () => {
    if (!currentContactNumber) return;
    try {
      await deleteContact.mutateAsync(currentContactNumber);
    } catch (e) {
      console.error(e);
      toast('failed to delete contact', { type: 'error' });
      return;
    }
    setModal((p) => ({ ...p, delete: false }));
    contacts.refetch();
    toast('contact deleted successfully', { type: 'success' });
  }, [contacts, currentContactNumber, deleteContact]);

  const addHandler = useCallback(async () => {
    if (name === '' || contactNumber === '' || description === '') {
      toast('required fields are not filled', { type: 'error' });
      return;
    }
    try {
      await addContact.mutateAsync({ name, description, contactNumber });
    } catch (e) {
      console.error(e);
      toast('failed to add contact', { type: 'error' });
      return;
    }
    setName('');
    setContactNumber('');
    setDescription('');
    setModal((p) => ({ ...p, add: false }));
    contacts.refetch();
    toast('contact added successfully', { type: 'success' });
  }, [
    addContact,
    contactNumber,
    contacts,
    description,
    name,
    setContactNumber,
    setDescription,
    setName,
  ]);

  const updateHandler = useCallback(async () => {
    if (!currentContactNumber) return;
    if (name === '' || contactNumber === '' || description === '') {
      toast('required fields are not filled', { type: 'error' });
      return;
    }
    try {
      await updateContact.mutateAsync({
        contactNumber: currentContactNumber,
        newContactNumber: contactNumber,
        newDescription: description,
        newName: name,
      });
    } catch (e) {
      console.error(e);
      toast('failed to update contact', { type: 'error' });
      return;
    }
    setName('');
    setContactNumber('');
    setDescription('');
    setModal((p) => ({ ...p, edit: false }));
    contacts.refetch();
    toast('contact updated successfully', { type: 'success' });
  }, [
    contactNumber,
    contacts,
    currentContactNumber,
    description,
    name,
    setContactNumber,
    setDescription,
    setName,
    updateContact,
  ]);

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
            <Col css={{ d: 'flex' }}>
              <Tooltip
                content="Edit"
                onClick={() => {
                  setCurrentContactNumber(contact.contactNumber);
                  setName(contact.name);
                  setDescription(contact.description);
                  setContactNumber(contact.contactNumber);
                  setModal((p) => ({ ...p, edit: true }));
                }}
              >
                <Icon icon="heroicons-outline:pencil-alt" color={theme.colors.accents6.value} />
              </Tooltip>
            </Col>
            <Col css={{ d: 'flex' }}>
              <Tooltip
                content="Delete"
                color="error"
                onClick={() => {
                  setCurrentContactNumber(contact.contactNumber);
                  setModal((p) => ({ ...p, delete: true }));
                }}
              >
                <Icon icon="heroicons-outline:trash" style={{ color: theme.colors.red500.value }} />
              </Tooltip>
            </Col>
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
        <>
          {contacts.data.length !== 0 ? (
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
              <Table.Body items={contacts.data}>
                {(item) => (
                  <Table.Row key={item.contactNumber}>
                    {(columnKey) => (
                      <Table.Cell>{renderCell(item, columnKey as ColumnUID)}</Table.Cell>
                    )}
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          ) : (
            <Text css={{ mb: '$2' }}>no contacts to show</Text>
          )}
          <Button
            flat
            color="success"
            css={{ alignSelf: contacts.data.length !== 0 ? 'flex-end' : 'auto' }}
            onClick={() => setModal((p) => ({ ...p, add: true }))}
          >
            <Icon
              icon="heroicons-outline:user-add"
              width={theme.space[8].value}
              style={{ marginRight: theme.space[2].value }}
            />
            Add Contact
          </Button>

          <Modal
            closeButton
            open={modal.delete}
            onClose={() => setModal((p) => ({ ...p, delete: false }))}
          >
            <Modal.Header>
              <Text h1 size="large" weight="bold">
                Are you sure you want to delete?
              </Text>
            </Modal.Header>
            <Modal.Footer>
              <Row justify="center">
                <Button
                  flat
                  color="error"
                  size="sm"
                  onClick={() => setModal((p) => ({ ...p, delete: false }))}
                >
                  No
                </Button>
                <Spacer x={0.5} />
                <Button color="success" size="sm" onClick={deleteHandler}>
                  Yes
                </Button>
              </Row>
            </Modal.Footer>
          </Modal>

          <Modal
            closeButton
            open={modal.add}
            onClose={() => setModal((p) => ({ ...p, add: false }))}
          >
            <Modal.Header>
              <Text h1 size="large" weight="bold">
                New Contact
              </Text>
            </Modal.Header>
            <Modal.Body>
              <Spacer y={2} />
              <Input bordered labelPlaceholder="Name" {...nameBindings} />
              <Spacer y={0.5} />
              <Textarea bordered labelPlaceholder="Description" {...descriptionBindings} />
              <Spacer y={0.5} />
              <Input bordered labelPlaceholder="Contact Number" {...contactNumberBindings} />
              <Spacer y={0.5} />
              <Button onClick={addHandler}>Submit</Button>
            </Modal.Body>
          </Modal>

          <Modal
            closeButton
            open={modal.edit}
            onClose={() => setModal((p) => ({ ...p, edit: false }))}
          >
            <Modal.Header>
              <Text h1 size="large" weight="bold">
                Edit Contact
              </Text>
            </Modal.Header>
            <Modal.Body>
              <Spacer y={2} />
              <Input bordered labelPlaceholder="Name" {...nameBindings} />
              <Spacer y={0.5} />
              <Textarea bordered labelPlaceholder="Description" {...descriptionBindings} />
              <Spacer y={0.5} />
              <Input bordered labelPlaceholder="Contact Number" {...contactNumberBindings} />
              <Spacer y={0.5} />
              <Button onClick={updateHandler}>Update</Button>
            </Modal.Body>
          </Modal>
        </>
      )}
    </AppLayout>
  );
};
