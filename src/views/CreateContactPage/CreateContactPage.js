import { useState } from 'react';
import { useCreateContactMutation } from 'redux/contacts/contacts.api';
import Section from 'components/Section';
import Container from 'components/Container/Container';
import {
  FormStyled,
  LabelStyled,
  InputStyled,
} from './CreateContactPage.style';
import Button from '@mui/material/Button';

export default function CreateContactPage() {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  const [createContact] = useCreateContactMutation();

  function handleSubmit(e) {
    e.preventDefault();
    createContact({ name, number });
    console.log({ name, number });
    reset();
  }
  function reset() {
    setName('');
    setNumber('');
  }
  function handleChange(e) {
    switch (e.target.name) {
      case 'name':
        setName(e.target.value);
        break;
      case 'number':
        setNumber(e.target.value);
        break;
      default:
        return;
    }
  }
  return (
    <Section style={{ paddingTop: '400px' }}>
      <Container>
        <FormStyled onSubmit={handleSubmit}>
          <LabelStyled>
            name
            <InputStyled
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              pattern="^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$"
              title="Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan"
              required
              placeholder="Sylvester Block"
            />
          </LabelStyled>
          <LabelStyled>
            phone
            <InputStyled
              type="tel"
              name="number"
              value={number}
              onChange={handleChange}
              pattern="\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}"
              title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
              required
              placeholder="777-777-7777"
            />
          </LabelStyled>
          <Button type="submit" variant="contained">
            Go
          </Button>
        </FormStyled>
      </Container>
    </Section>
  );
}