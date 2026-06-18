function RecentSearches({ searches, onSelect }) {
    if (!searches.length) {
        return null;
    }

    return (
        <div className="recent-searches" aria-label="Recent searches">
            <p>Recent</p>

            <div className="recent-list">
                {searches.map((search) => (
                    <button
                        key={search}
                        type="button"
                        className="recent-button"
                        onClick={() => onSelect(search)}
                    >
                        {search}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default RecentSearches;
