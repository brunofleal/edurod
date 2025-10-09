import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";

interface OccurrenceContextType {
    refetch: () => void;
}

const OccurrenceContext = createContext<OccurrenceContextType | undefined>(
    undefined
);

interface OccurrenceProviderProps {
    children: ReactNode;
    refetch: () => void;
}

export const OccurrenceProvider: React.FC<OccurrenceProviderProps> = ({
    children,
    refetch,
}) => {
    return (
        <OccurrenceContext.Provider value={{ refetch }}>
            {children}
        </OccurrenceContext.Provider>
    );
};

export const useOccurrenceContext = () => {
    const context = useContext(OccurrenceContext);
    if (context === undefined) {
        throw new Error(
            "useOccurrenceContext must be used within an OccurrenceProvider"
        );
    }
    return context;
};
