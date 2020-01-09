import React, { useState, useEffect } from "react";
import "./App.css";
import "rbx/index.css";
import { Button, Container, Title } from "rbx";

const terms = { F: "Fall", W: "Winter", S: "Spring" };
const Banner = ({ title }) => <Title>{title || "[loading...]"}</Title>;
const buttonColor = selected => (selected ? "success" : null);
const TermSelector = ({ state }) => (
  <Button.Group hasAddons>
    {Object.values(terms).map(value => (
      <Button
        key={value}
        color={buttonColor(value === state.term)}
        onClick={() => state.setTerm(value)}
      >
        {value}
      </Button>
    ))}
  </Button.Group>
);
const getCourseTerm = course => terms[course.id.charAt(0)];
const getCourseNumber = course => course.id.slice(1, 4);
const Course = ({ course }) => (
  <Button>
    {getCourseTerm(course)} CS {getCourseNumber(course)}: {course.title}
  </Button>
);
const CourseList = ({ courses }) => {
  const [term, setTerm] = useState("Fall");
  const termCourses = courses.filter(course => term === getCourseTerm(course));
  // Fragment groups into one element w/o using unnecessary HTML
  return (
    <React.Fragment>
      <TermSelector state={{ term, setTerm }} />
      <Button.Group>
        {termCourses.map(course => (
          <Course key={course.id} course={course} />
        ))}
      </Button.Group>
    </React.Fragment>
  );
};

const App = () => {
  // initializes trackable state as schedule var, and function to update the state
  const [schedule, setSchedule] = useState({ title: "", courses: [] });
  const url = "https://courses.cs.northwestern.edu/394/data/cs-courses.php";
  //useEffect usually runs on every render, but w/empty list, only runs on mount
  useEffect(() => {
    const fetchSchedule = async () => {
      const response = await fetch(url);
      if (!response.ok) throw response;
      const json = await response.json();
      setSchedule(json);
    };
    fetchSchedule();
  }, []);
  return (
    <Container>
      <Banner title={schedule.title} />
      <CourseList courses={schedule.courses} />
    </Container>
  );
};

export default App;
