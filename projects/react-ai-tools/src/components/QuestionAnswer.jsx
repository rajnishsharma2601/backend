// src/components/QuestionAnswer.jsx
import React from "react";
import Answer from "./Answers";

function QuestionAnswer({ result }) {
  return (
    <>
      {result.map((item, index) => (
        <React.Fragment key={index}>
          <li className="text-right p-1 font-bold  border-8  dark:bg-zinc-300--700   rounded-tl-3xl rounded-br-3xl rounded-bl-3xl  w-fit ml-auto w-0.5">
            <Answer ans={item.question} index={index} />
          </li>
          <li className="text-left p-3">
            <Answer ans={item.answer} index={index} />
          </li>
        </React.Fragment>
      ))}
    </>
  );
}

export default QuestionAnswer;
