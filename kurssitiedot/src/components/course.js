const Header = ({ course }) => {
    return (
      <div>
          <h2>{course.name}</h2>
      </div>
    )
  };
  
  const Part = ({ name, exercises }) => {
    return (
      <div>
        <p>
          {name} {exercises}
        </p>
      </div>
    );
  };
  
  const Content = ({ course }) => {
    return (
      <div>
        {/* Each element in an array (created by map-function) should have a unique key */}
        {course.parts.map((part) => (
          <Part key={part.id} name={part.name} exercises={part.exercises} />
        ))}
      </div>
    );
  };
  
  const Course = ({ course }) => {
    console.log('course :>> ', course);
    return (
      <div>
        <Header course={course} />
        <Content course={course} />
        <Total course={course} />
      </div>
    );
  };
  
  const Total = ({ course }) => {
    const exerciseArray = course.parts.map((part) => part.exercises);
    const total = exerciseArray.reduce(
      (previousValue, currentValue) => previousValue + currentValue
    );
    return (
      <div>
        <p style={{ fontWeight: 'bold' }}>Number of exercises {total}</p>
      </div>
    );
  };

  export default Course;