// hooks/useDebounce.ts
import { useState, useEffect } from "react"

/**
 * A custom hook that returns a debounced value after a specified delay
 * @param value The value to be debounced
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export default function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up the timeout if the value changes before the delay expires
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}