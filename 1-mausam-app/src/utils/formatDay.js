function formatDay(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
        weekday: "short",
    });
}

export default formatDay;