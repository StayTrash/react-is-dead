import { useCallback, useState } from "react";

function getInitialValue(key, initialValue) {
    const fallback =
        typeof initialValue === "function" ? initialValue() : initialValue;

    try {
        const savedValue = window.localStorage.getItem(key);
        return savedValue ? JSON.parse(savedValue) : fallback;
    } catch {
        return fallback;
    }
}

function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() =>
        getInitialValue(key, initialValue)
    );

    const setValue = useCallback((value) => {
        setStoredValue((currentValue) => {
            const nextValue =
                typeof value === "function" ? value(currentValue) : value;

            try {
                window.localStorage.setItem(key, JSON.stringify(nextValue));
            } catch {
                // Keep React state working even if storage is unavailable.
            }

            return nextValue;
        });
    }, [key]);

    return [storedValue, setValue];
}

export default useLocalStorage;
