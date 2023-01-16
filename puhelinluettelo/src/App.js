import { useState, useEffect } from "react";
import Persons from "./components/Persons";
import AddingForm from "./components/AddingForm";
import Filter from "./components/Filter";
import personService from "./services/persons";
import "./index.css";
import ErrorNotification from "./components/ErrorNotification";
import AttentionNotification from "./components/AttentionNotification";

// Start JSON server: npm run server
// Start React Developer server: npm start

const App = () => {
  // Adding React state to function components by using State-hook
  const [persons, setPersons] = useState([]); // controls person information
  const [newName, setNewName] = useState(""); // controls name-input field
  const [newNumber, setNewNumber] = useState(""); // controls number-input field
  const [newFilter, setNewFilter] = useState(""); // controls filtering-input field
  const [attentionMessage, setAttentionMessage] = useState(""); // controls messages
  const [errorMessage, setErrorMessage] = useState("");

  // Getting data from the server with Axios-library by using Effect-hook
  // check ./services/persons where is kept the code that communicates with the server
  useEffect(() => {
    personService.getAll().then((response_allPersons) => {
      setPersons(response_allPersons.data);
    });
  }, []);

  const addPerson = (event) => {
    // Prevents submitting the form, which would cause reloading the page
    event.preventDefault();

    if (newName === "") {
      setAttentionMessage("Please enter the person's name");

      // Check if the person already exists at the phonebook and user tries to add the same number:
    } else if (
      persons.find(
        (person) => person.name === newName && person.number === newNumber
      )
    ) {
      setAttentionMessage(`${newName} is already added to the phonebook`);

      // If the number is changed, user can update it
    } else if (
      persons.find(
        (person) => person.name === newName && person.number !== newNumber
      )
    ) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with the new one?`
        )
      ) {
        const findObject = persons.find(({ name }) => name === newName); // Find the object that is wanted to change
        const updateNumber = { ...findObject, number: newNumber }; // Update only phone number, keep the rest of the data unchangeable
        personService
          .update(findObject["id"], updateNumber)
          .then((response) => {
            // update the number to the persons state and to the screen
            setPersons(
              persons.map((person) =>
                person.id !== findObject["id"] ? person : response.data
              )
            );
            setAttentionMessage(
              `${findObject["name"]}'s telephone number is updated`
            );
          })
          .catch((error) => {
            setErrorMessage(
              `${findObject["name"]} has already been removed from server`
            );
          });
      }

      // If the person doesn't exist in the phone book....
    } else {
      // creates an object, that corresponds to the new person
      const personObject = {
        name: newName,
        number: newNumber,
      };
      // Sends personObject to the server using Axios method post
      // check ./services/persons where is kept the code that communicates with the server
      personService
        .create(personObject)
        // Adds the new person to persons-state and renders it to screen.
        // Do not modify React component's state directly ->  use concat -not push!
        .then((response) => {
          setPersons(persons.concat(response.data));
        });
      setAttentionMessage(`${newName} is added to the phonebook`);
    }
    // Message shows 5 seconds on the screen
    setTimeout(() => {
      setAttentionMessage(null);
      setErrorMessage(null);
    }, 5000);
    // Clears the states (and input fields)
    setNewName("");
    setNewNumber("");
  };

  // event listeners are called every time when something happens at the input field
  const handleNameChange = (event) => setNewName(event.target.value);

  const handleNumberChange = (event) => setNewNumber(event.target.value);

  const handleFilterChange = (event) => setNewFilter(event.target.value);

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      // Creates a new persons list where the person to be deleted has been filtered out
      const updatedList = persons.filter((person) => person.id !== id);
      personService.remove(id).then(() => {
        setAttentionMessage(`${name} is deleded`);
      });
      setPersons(updatedList); // updates the screen with the new person list
      setTimeout(() => {
        setAttentionMessage(null);
      }, 5000);
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <ErrorNotification message={errorMessage} />
      <AttentionNotification message={attentionMessage} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>
      <AddingForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(newFilter.toLowerCase())
        )
        .map((person) => (
          <Persons
            key={person.id}
            person={person}
            handleDelete={handleDelete}
          />
        ))}
    </div>
  );
};

export default App;