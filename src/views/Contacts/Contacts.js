import { useState } from 'react';
import { useSelector } from 'react-redux';
import authSelectors from 'redux/auth/auth-selectors';
import contactsSelectors from 'redux/contacts/contacts-selectors';
import { useGetContactsQuery } from 'redux/contacts/contacts-api';
import ContactsList from 'components/ContactsList';
import ContactItem from 'components/ContactItem';
import Filter from 'components/Filter';
import {
  ContainerStyled,
  FlexStyled,
  NoContactsImageStyled,
  NoContactsText,
  SectionStyled,
  NoContactsStyled,
} from './ContactsStyles';
import { Fab, Skeleton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BasicModal from 'components/Modal/Modal';
import CreateContact from 'components/CreateContact';
import ContactsBookImage from 'image/book-contacts.png';

export default function ContactsPage() {
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState('standart');

  const { data: contacts, isLoading } = useGetContactsQuery();
  const nameFilter = useSelector(contactsSelectors.getFilter);
  const isFetchingCurrentUser = useSelector(
    authSelectors.getIsFetchingCurrentUser
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const sortByParameter = () => {
    switch (sort) {
      case 'standart':
        setSort('A-Z');
        break;
      case 'A-Z':
        setSort('Z-A');
        break;
      case 'Z-A':
        setSort('standart');
        break;
      default:
        return;
    }
  };

  const getVisibleContacts = () => {
    const normalizedFilter = nameFilter?.toLowerCase();
    return contacts?.filter(({ name }) =>
      name.toLowerCase().includes(normalizedFilter)
    );
  };

  const getSortContacts = contacts => {
    if (sort === 'standart') return contacts();
    if (sort === 'A-Z')
      return [...contacts()].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'Z-A')
      return [...contacts()].sort((a, b) => b.name.localeCompare(a.name));
  };

  return (
    <SectionStyled>
      <ContainerStyled>
        {!isFetchingCurrentUser && contacts ? (
          <>
            <Filter />
            <ContactsList onClick={sortByParameter} sort={sort}>
              <>
                {!isLoading && getVisibleContacts()?.length > 0 ? (
                  getSortContacts(getVisibleContacts).map(
                    ({ id, name, number }, index) => {
                      return (
                        <ContactItem
                          key={id}
                          name={name}
                          number={number}
                          id={id}
                          position={index}
                        />
                      );
                    }
                  )
                ) : (
                  <NoContactsStyled>
                    <NoContactsText>You have no contacts...</NoContactsText>
                    <NoContactsImageStyled
                      src={ContactsBookImage}
                      alt="contacts book"
                    />
                  </NoContactsStyled>
                )}
              </>
            </ContactsList>
            <Fab
              onClick={handleOpen}
              color="secondary"
              aria-label="add"
              style={{
                position: 'fixed',
                top: '85%',
                left: '85%',
                zIndex: '1',
              }}
            >
              <AddIcon />
            </Fab>
          </>
        ) : (
          <>
            <FlexStyled>
              <Skeleton
                variant="rectangular"
                width={250}
                height={32}
                sx={{ bgcolor: '#1b3a59' }}
              />
              <Skeleton
                variant="rectangular"
                width={220}
                height={32}
                sx={{ bgcolor: '#1b3a59', margin: '0 0 0 15px' }}
              />
            </FlexStyled>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={500}
              sx={{ bgcolor: '#1b3a59', margin: '0 0 0 15px' }}
            />
          </>
        )}
      </ContainerStyled>

      <BasicModal open={open} handleClose={handleClose}>
        <CreateContact setOpen={setOpen} />
      </BasicModal>
    </SectionStyled>
  );
}
