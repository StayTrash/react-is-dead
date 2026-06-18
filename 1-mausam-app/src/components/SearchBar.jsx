function SearchBar({
    city,
    setCity,
    handleSearch,
    handleKeyDown,
    loading,
}) {
    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="Enter city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={handleKeyDown}
                className="search-input"
                aria-label="City name"
                autoComplete="off"
            />

            <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="search-button"
            >
                {loading ? "Searching..." : "Search"}
            </button>
        </div>
    );
}

export default SearchBar;
