import { nanoid } from 'nanoid';
import { React, Component } from 'react';
import { ContactsForm } from './contactsForm/ContactsForm';
import { ContactsList } from './contactsList/ContactsList';
import { Filter } from './filter/Filter';
import css from './App.module.css';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  addContact = data => {
    const newContact = {
      id: nanoid(),
      ...data,
    };
    if (this.state.contacts.find(contact => contact.name === newContact.name)) {
      alert('This contact already exist');
    } else {
      this.setState(({ contacts }) => {
        return { contacts: [...contacts, newContact] };
      });
    }
  };
  componentDidUpdate(prevState, prevProps) {
    if (prevProps.contacts.length < this.state.contacts.length) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
    if (prevProps.contacts.length > this.state.contacts.length) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }
  componentDidMount() {
    const localStorageContacts = localStorage.getItem('contacts');
    if (localStorageContacts) {
      this.setState({ contacts: JSON.parse(localStorageContacts) });
    }
  }
  deleteContact = currentId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== currentId),
    }));
  };

  filterChange = e => {
    this.setState({
      filter: e.target.value.toLowerCase(),
    });
  };
  filterContacts = () => {
    const { contacts, filter } = this.state;
    const filteredContacts = contacts.filter(({ name }) =>
      name.toLowerCase().includes(filter)
    );
    return filteredContacts.sort((a, b) => a.name.localeCompare(b.name));
  };

  render() {
    return (
      <div className={css.container}>
        <h2>Phonebook</h2>
        <ContactsForm onSubmit={this.addContact} />
        <Filter onChange={this.filterChange} />
        <h2>Contacts</h2>
        <ContactsList
          contacts={this.filterContacts()}
          deleteContact={this.deleteContact}
        />
      </div>
    );
  }
}
