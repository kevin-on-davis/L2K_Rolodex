import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./rolodex.css";
import Card from "./Card/card.js";

function Rolodex() {
  const filterRef = useRef(null);
  const clauseRef = useRef(null);
  const valueRef = useRef(null);
  const [empState, setEmployeeState] = useState({
    employee: [],
    sortlist: [],
    filterlist: []
  });

  const [mapResult, setMapResult] = useState({
    liElement: [],
    sortKeys: [],
    filterKey: "gender"
  });

  useEffect(() => {
    (async function dummyFunc() {
      const rolodexContents = await axios.get(
        "https://randomuser.me/api/?results=50"
      );
      var spreadResult = [...rolodexContents.data.results];
      spreadResult.map(spreadRec => {
        spreadRec.firstname = spreadRec.name.first;
        spreadRec.lastname = spreadRec.name.last;
        spreadRec.title = spreadRec.name.title;
        spreadRec.age = spreadRec.dob.age;
        spreadRec.birthdate = spreadRec.dob.date;
        spreadRec.idtype = spreadRec.id.name;
        spreadRec.idnumber = spreadRec.id.value;
        spreadRec.country = spreadRec.location.country;
        spreadRec.city = spreadRec.location.city;
        spreadRec.streetno = spreadRec.location.street.number;
        spreadRec.streetname = spreadRec.location.street.name;
        spreadRec.postalcode = spreadRec.location.postcode;
        spreadRec.state = spreadRec.location.state;
        spreadRec.hiredate = spreadRec.registered.date;
        spreadRec.serviceyears = spreadRec.registered.age;
      });
      setEmployeeState({
        employee: spreadResult,
        sortlist: spreadResult
      });
    })();
  }, []);

  useEffect(() => {
    if (empState.employee.length > 0) {
      var liEle = empState.employee.map(empRec => (
        <li key={empRec.login.uuid}>
          <Card empRec={empRec} />
        </li>
      ));
      var optnEle = Object.keys(empState.employee[0]).map(empKey => {
        const excludeList = ["name", "dob", "id", "location", "registered"];
        if (excludeList.indexOf(empKey) == -1) {
          return (
            <option key={empKey} value={empKey}>
              {empKey}
            </option>
          );
        }
      });
      setMapResult({
        liElement: liEle,
        sortKeys: optnEle
      });
    }
  }, [empState.employee]);

  function sortEmp(key, order = "asc") {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === "desc" ? comparison * -1 : comparison;
    };
  }

  function handleSortOp(event) {
    const currSortState = empState.sortlist;
    let newState = [...currSortState];
    if (newState.length > 0) {
      setEmployeeState({
        employee: newState.sort(sortEmp(event.target.value)),
        sortlist: newState.sort(sortEmp(event.target.value))
      });
    }
  }

  function setFilterClause(props, filterCat, filterRel, filterVal) {
    if (props[filterCat] == filterVal) {
    }
    switch (filterRel) {
      case "equal to":
        return props[filterCat] == filterVal;
      case "greater than or equal to":
        return props[filterCat] >= filterVal;
      case "less than or equal to":
        return props[filterCat] <= filterVal;
      case "not equal to":
        return props[filterCat] != filterVal;
      default:
        return false;
    }
  }

  function handleFilterOp(event) {
    const currSortState = empState.sortlist;
    let newState = [...currSortState];
    console.log("B4 I am here");
    if (newState.length > 0) {
      setEmployeeState({
        employee: newState.filter(rec => {
          console.log(
            "in setting state",
            filterRef.current.value,
            clauseRef.current.value,
            valueRef.current.value
          );
          if (
            setFilterClause(
              rec,
              filterRef.current.value,
              clauseRef.current.value,
              valueRef.current.value
            )
          ) {
            console.log("I am here");
            return rec;
          }
        }),
        sortlist: newState.sort(sortEmp(event.target.value))
      });
    }
  }

  function handleWhereInput(event) {
    // clauseRef.current.innerText = `where ${event.target.value} =`;
    valueRef.current.type = handleInputType(event);
  }

  function handleInputType(event) {
    switch (event.target.value) {
      case "age":
      case "serviceyears":
        return "number";
      case "birthdate":
      case "hiredate":
        break;
      case "email":
        return "email";
      default:
        return "text";
    }
  }

  return (
    <div className="btnBar">
      <span>
        <div className="btnContent">
          <select id="sortby" defaultValue="" onChange={handleSortOp}>
            {mapResult.sortKeys}
          </select>
          <span> Filter By </span>
          <select
            id="filter_category"
            ref={filterRef}
            defaultValue=""
            onChange={handleWhereInput}
          >
            {mapResult.sortKeys}
          </select>
          <span id="where_clause"> where gender = </span>
          <span style={{ width: "3px" }}></span>
          <select id="filter_relationship" ref={clauseRef} defaultValue="">
            <option> equal to </option>
            <option> greater than or equal to </option>
            <option> less than or equal to </option>
            <option> not equal to </option>
          </select>
          <span style={{ width: "3px" }}></span>
          <input
            type="text"
            id="filter_value"
            ref={valueRef}
            name="filter_input"
            placeholder="Enter value to filter list by"
          ></input>
          <button onClick={handleFilterOp}>Filter</button>
        </div>
      </span>
      <ul>{mapResult.liElement}</ul>
    </div>
  );
}

export default Rolodex;
