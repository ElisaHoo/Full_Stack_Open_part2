const Persons = ({ person, handleDelete }) => (
  <div>
    {person.name} {person.number} {"  "}
    <DeleteButton person={person} handleDelete={handleDelete} />
  </div>
);

const DeleteButton = ({ person, handleDelete }) => {
  return (
  <>
    <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
  </>
  )
}

export default Persons
