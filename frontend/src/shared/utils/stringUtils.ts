/**
 * Capitalizes the first letter of each word in a name string.
 * Handles complex name structures including multiple surnames, prefixes, and compound names.
 * Preserves common name particles like "de", "van", "von", "da", "del", etc.
 * @param name - The name string to capitalize
 * @returns The name with proper capitalization for each component
 */
export function capitalizeName(name: string): string {
    if (!name || typeof name !== "string") {
        return "";
    }

    // Common name particles that should remain lowercase (unless at the beginning)
    const lowercaseParticles = new Set([
        "de",
        "del",
        "della",
        "da",
        "dos",
        "das",
        "di",
        "do",
        "van",
        "von",
        "der",
        "den",
        "ter",
        "te",
        "la",
        "le",
        "el",
        "y",
        "e",
        "et",
        "and",
        "mc",
        "mac",
        "o'",
        "al",
    ]);

    return name
        .trim()
        .split(/\s+/)
        .map((word, index) => {
            if (word.length === 0) return word;

            const lowerWord = word.toLowerCase();

            // Handle hyphenated names (compound surnames)
            if (word.includes("-")) {
                return word
                    .split("-")
                    .map((part) => {
                        if (part.length === 0) return part;
                        return (
                            part.charAt(0).toUpperCase() +
                            part.slice(1).toLowerCase()
                        );
                    })
                    .join("-");
            }

            // Handle apostrophes (O'Connor, D'Angelo, etc.)
            if (word.includes("'")) {
                return word
                    .split("'")
                    .map((part) => {
                        if (part.length === 0) return part;
                        return (
                            part.charAt(0).toUpperCase() +
                            part.slice(1).toLowerCase()
                        );
                    })
                    .join("'");
            }

            // Keep particles lowercase (except if it's the first word)
            if (index > 0 && lowercaseParticles.has(lowerWord)) {
                return lowerWord;
            }

            // Standard capitalization
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");
}
