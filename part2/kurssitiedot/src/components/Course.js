const Header = ({ name }) => {

  return (
    <h1>{name}</h1>
  )
}

const Content = ({ parts }) => {

  const total = parts.reduce((s, p) => s + p.exercises, 0)

  return (
    <div>
      {parts.map(part =>
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      )}
      <Part name='Total exercises ' exercises={total} />
    </div>
  )
}

const Part = ({ name, exercises }) => {

  return (
    <p>{name + ' ' + exercises}</p>
  )
}

const Course = ({ course }) => {

  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
    </div>
  )
}

export default Course