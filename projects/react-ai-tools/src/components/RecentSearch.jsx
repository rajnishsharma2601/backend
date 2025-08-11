function RecentSearch({
  recentHistory,
  setRecentHistory,
  setSelectHistory,
  setSearchInput,
  handleSearch,
}) {
  const clearHistory = () => {
    localStorage.clear();
    setRecentHistory([]);
  };

  const handleRecentClick = (item) => {
    setSelectHistory(item);
    setSearchInput(item);
    handleSearch();
  };

  return (
    <div className="col-span-1 bg-zinc-800 p-3 h-full">
      <h1 className="text-xl text-white flex justify-between items-center">
        Recent Search
        <button className="text-white cursor-pointer" onClick={clearHistory}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="22px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="white"
          >
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
          </svg>
        </button>
      </h1>

      <ul className="text-left overflow-y-auto text-sm mt-2 space-y-1 max-h-[400px]">
        {recentHistory.map((item, index) => (
          <li
          
            onClick={() => handleRecentClick(item)}
            key={index}
            title={item}
            className="p-1 pl-3 text-zinc-400 cursor-pointer hover:bg-zinc-700 hover:text-white text-base overflow-hidden whitespace-nowrap truncate w-full"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentSearch;

