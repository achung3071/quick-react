import React from "react";
import "rbx/index.css";
import { Button } from "rbx";
import { hasConflict, moveCourse, getCourseTerm } from "./times";

const buttonColor = selected => (selected ? "success" : null);
const getCourseNumber = course => course.id.slice(1, 4);

const Course = ({ course, state, user }) => (
  <Button
    color={buttonColor(state.selected.includes(course))}
    onClick={() => state.toggle(course)}
    onDoubleClick={user ? () => moveCourse(course) : null}
    disabled={hasConflict(course, state.selected)}
  >
    {getCourseTerm(course)} CS {getCourseNumber(course)}: {course.title}
  </Button>
);

export default Course;
