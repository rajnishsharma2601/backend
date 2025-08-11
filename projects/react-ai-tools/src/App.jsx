import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { URL } from "./constants";
import Answer from "./components/Answers";
import RecentSearch from "./components/RecentSearch";
import QuestionAnswer from "./components/QuestionAnswer";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(() => {
    const stored = localStorage.getItem("history");
    return stored ? JSON.parse(stored) : [];
  });
  const [selectHistory, setSelectHistory] = useState("");
  const [loader, setLoader] = useState(false);
  const scrollToAns = useRef(null);

  useEffect(() => {
    if (scrollToAns.current) {
      scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
    }
    setLoader(false);
  }, [result]);

  useEffect(() => {
    if (selectHistory) {
      askQuestion(selectHistory);
    }
  }, [selectHistory]);

  const isSimpleMath = (input) => /^[0-9+\-*/().\s]+$/.test(input);

  const askQuestion = async (inputText) => {
    const userInput = (inputText || question || selectHistory).trim();
    if (!userInput) return;

    if (isSimpleMath(userInput)) {
      try {
        // eslint-disable-next-line no-eval
        const resultValue = eval(userInput);
        setResult((prev) => [
          ...prev,
          { question: userInput, answer: `${userInput} = ${resultValue}` },
        ]);
      } catch {
        setResult((prev) => [
          ...prev,
          { question: userInput, answer: "Invalid math expression." },
        ]);
      }
      setQuestion("");
      setSelectHistory("");
      setLoader(false);
      return;
    }

    // Save history only if it's a new manual question
    if (!inputText && question) {
      const updatedHistory = [
        userInput,
        ...recentHistory.filter((item) => item !== userInput),
      ].slice(0, 20);
      localStorage.setItem("history", JSON.stringify(updatedHistory));
      setRecentHistory(updatedHistory);
    }

    const payload = {
      contents: [{ parts: [{ text: userInput }] }],
    };

    setLoader(true);

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      let dataString = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!dataString) {
        dataString = "No answer found.";
      }

      if (Array.isArray(dataString)) {
        dataString = dataString.join(" ");
      }

      setResult((prev) => [
        ...prev,
        { question: userInput, answer: dataString },
      ]);
    } catch (error) {
      console.error(error);
      setResult((prev) => [
        ...prev,
        { question: userInput, answer: "Error fetching answer." },
      ]);
    } finally {
      setQuestion("");
      setSelectHistory("");
      setLoader(false);
    }
  };

  const isEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      askQuestion();
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("history");
    setRecentHistory([]);
  };

  return (
    <div className="grid grid-cols-5 h-screen text-center">
      <RecentSearch
        recentHistory={recentHistory}
        setRecentHistory={setRecentHistory}
        setSelectHistory={setSelectHistory}
        setSearchInput={setQuestion}
        handleSearch={askQuestion}
      />

      <div className="col-span-4 p-10">
        <h1 className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700 m-auto">
          Hello User, Ask me Anything
        </h1>

        {loader && (
          <div role="status" className="mt-4">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M93.97 39.04C96.39 38.33 97.86 35.74 96.99 33.43C95.1 28.82 92.39 24.6 88.99 21C85.15 16.83 80.48 13.5 75.3 11.14C70.12 8.78 64.57 7.41 59 7.1C55.9 6.93 53.9 9.98 54.6 12.95C55.3 15.91 58.3 17.79 61.38 18C65.6 18.27 69.73 19.24 73.52 20.91C77.31 22.58 80.68 24.93 83.43 27.84C85.7 30.09 87.57 32.71 89 35.6C90.12 37.87 91.55 39.75 93.97 39.04Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}

        <div
          ref={scrollToAns}
          className="container h-[65vh] overflow-y-auto text-white mt-6"
        >
          <ul>
            <QuestionAnswer result={result} />
          </ul>
        </div>

         {/* /// ouestio input section */}

        <div className="bg-zinc-800 p-1 w-1/2 pr-5 text-white m-auto rounded-3xl border-zinc-300 border flex h-16 mt-5">
          <input
            type="text"
            onKeyDown={isEnter}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full h-full p-3 outline-none bg-transparent"
            placeholder="Ask me anything..."
            value={question}
          />
          <button
            onClick={() => askQuestion()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
