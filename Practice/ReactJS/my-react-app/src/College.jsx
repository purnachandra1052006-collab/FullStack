function College({ name, city }) {

  function handleSubmit(event) {
    event.preventDefault();
    alert(`Your Form has been submitted`);
  }

  function handleChange(event) {
    console.log(event.target.value);
  }

  return (
    <>
      <ul>
        <li>College Name: {name}</li>
        <li>College City: {city}</li>
      </ul>

      <form onSubmit={handleSubmit}>
        <label>Name: </label>
        <input type="text" onChange={handleChange} />

        <label>Roll No: </label>
        <input type="text" onChange={handleChange} />

        <label>Year: </label>
        <input type="text" onChange={handleChange} />

        <button type="submit">Submit</button>
      </form>

    </>
  );
}

export default College;