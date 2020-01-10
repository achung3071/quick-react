import React, { useState } from "react";
import "rbx/index.css";
import { Button } from "rbx";
import { getCourseTerm, terms } from "./Course/times";
import Course from "./Course";

// custom hook utilizing useState() that does not require
// rewriting the array on every course select / deselect
const useSelection = () => {
  const [selected, setSelected] = useState([]);
  const toggle = x => {
    setSelected(
      selected.includes(x)
        ? selected.filter(y => y !== x)
        : [x].concat(selected)
    );
  };
  return [selected, toggle];
};

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

const CourseList = ({ user, courses }) => {
  const [term, setTerm] = useState("Fall");
  const [selected, toggle] = useSelection();
  const termCourses = courses.filter(course => term === getCourseTerm(course));
  // Fragment groups into one element w/o using unnecessary HTML
  return (
    <React.Fragment>
      <TermSelector state={{ term, setTerm }} />
      <Button.Group>
        {termCourses.map(course => (
          <Course
            key={course.id}
            course={course}
            state={{ selected, toggle }}
            user={user}
          />
        ))}
      </Button.Group>
    </React.Fragment>
  );
};

export default CourseList;
