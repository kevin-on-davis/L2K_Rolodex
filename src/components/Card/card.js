import React from "react";
import "./style.css";
import Moment from "react-moment";

function Card(props) {
  return (
    <div className="row ">
      <div className="col-sm-2 empCard">
        <img
          className="profileImage"
          src={props.empRec.picture.large}
          alt=""
        ></img>
      </div>
      <div className="col-sm-4 empCharCard">
        <h3>
          {props.empRec.lastname}, {props.empRec.firstname} (
          {props.empRec.title})
        </h3>
        <h5>Age : {props.empRec.age}</h5>
        <h5>
          D.O.B : <Moment format="YYYY/MM/DD">{props.empRec.birthdate}</Moment>
        </h5>
        <h5>
          Employment Date :{" "}
          <Moment format="YYYY/MM/DD">{props.empRec.hiredate}</Moment>
        </h5>
        <h5>Years of Service : {props.empRec.serviceyears}</h5>
        <h5>
          {" Phone:" + props.empRec.phone}
          {"/"}
          {" Cell:" + props.empRec.cell}
        </h5>
        <h5>{props.empRec.email}</h5>
      </div>
      <div className="col-sm-4 empAddressCard">
        <h3> Address </h3>
        <h5>
          {props.empRec.streetno} {props.empRec.streetname}
        </h5>
        <h5>{props.empRec.city}</h5>
        <h5>
          {props.empRec.state}, {props.empRec.postalcode}
        </h5>
        <h5>{props.empRec.country}</h5>
      </div>
    </div>
  );
}

export default Card;
