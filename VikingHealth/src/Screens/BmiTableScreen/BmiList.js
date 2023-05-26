import React from "react";
import BmiCard from "./BmiCard";

const BmiList = ({ BmiData, onCardClicked, bmi }) => {
  return (
    <React.Fragment>
      {BmiData.map((data, index) => {
        return (
          <BmiCard
            bmi={bmi}
            key={data.name}
            index={index}
            data={data}
            onCardClicked={onCardClicked}
          />
        );
      })}
    </React.Fragment>
  );
};

export default BmiList;
