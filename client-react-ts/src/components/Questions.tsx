import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import loader from "../loader.svg";
export interface QuestionsResponse {
  views: number;
  _id: string;
  question: string;
}

export const Questions = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [questions, setQuestions] = useState<QuestionsResponse[]>([]);
  const pages = new Array(numberOfPages).fill(null).map((v, i) => i);
  const getAllQuestions = () => {
    setIsFetching(true);
    axios.get(`https://qnafabr.herokuapp.com/api/question?page=${pageNumber}`).then((response) => {
      setQuestions(response.data.questions);
      setNumberOfPages(response.data.totalPages);
      setIsFetching(false);
    });
  };

  useEffect(() => {
    getAllQuestions();
  }, [pageNumber]);

  const gotoPrevious = () => {
    setPageNumber(Math.max(0, pageNumber - 1));
  };

  const gotoNext = () => {
    setPageNumber(Math.min(numberOfPages - 1, pageNumber + 1));
  };
  return (
    <div className="container">
      {isFetching ? (
        <div className="container center-align">
          <img src={loader} alt="loading..." className="loader" />
        </div>
      ) : (
        <>
          <div className="collection">
            <h3>Страница {pageNumber + 1}</h3>
            {questions.map((item) => {
              const { _id, views, question } = item;
              return (
                <Link key={_id} to={`/q/${_id}`} className="collection-item">
                  <span className="badge" key={_id}>
                    {views} просмотров
                  </span>
                  {question}
                </Link>
              );
            })}
          </div>
          <div className="container center-align">
            <ul className="pagination">
              <li className="waves-effect">
                <a onClick={() => gotoPrevious()}>
                  <i className="material-icons">chevron_left</i>
                </a>
              </li>
              {pages.map((pageIndex) => {
                return (
                  <>
                    <li className="waves-effect" key={pageIndex}>
                      <a
                        onClick={() => setPageNumber(pageIndex)}
                        key={pageIndex}
                      >
                        {pageIndex + 1}
                      </a>
                    </li>
                  </>
                );
              })}
              <li className="waves-effect">
                <a onClick={() => gotoNext()}>
                  <i className="material-icons">chevron_right</i>
                </a>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
