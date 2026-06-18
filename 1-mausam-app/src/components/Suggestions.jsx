function Suggestions({
    suggestions,
    activeIndex,
    onSelect,
}) {
    if (!suggestions.length) {
        return null;
    }

    return (
        <ul
            className="suggestions-list"
            role="listbox"
        >
            {suggestions.map(
                (suggestion, index) => (
                    <li
                        key={`${suggestion.lat}-${suggestion.lon}`}
                        role="option"
                        aria-selected={
                            activeIndex === index
                        }
                        className={`suggestion-item ${activeIndex === index
                                ? "active"
                                : ""
                            }`}
                        onMouseDown={(event) =>
                            event.preventDefault()
                        }
                        onClick={() =>
                            onSelect(suggestion)
                        }
                    >
                        <span>
                            {suggestion.name}
                        </span>

                        <span>
                            {suggestion.state
                                ? `, ${suggestion.state}`
                                : ""}
                            {`, ${suggestion.country}`}
                        </span>
                    </li>
                )
            )}
        </ul>
    );
}

export default Suggestions;
