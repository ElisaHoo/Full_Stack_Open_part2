const Filter = ({ newFilter, handleFilterChange }) => (
    <div>
      Search countries: <input value={newFilter} onChange={handleFilterChange} />
    </div>
  );

  export default Filter;