import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {searchSchema, type SearchTermType} from "@/types";

interface UseSearchParams<T> {
    initialData: T[];
    searchKeys: (keyof T)[];
    debounceDelay?: number;
}

export const useSearch = <T>({initialData, searchKeys, debounceDelay = 500}: UseSearchParams<T>) => {
    const [filteredData, setFilteredData] = useState<T[]>(initialData);
    const prevJsonRef = useRef<string | null>(null);

    // Guard to avoid it re-running when `initialData` is referentially new but content-identical
    useEffect(() => {
        const json = JSON.stringify(initialData || []);

        if (prevJsonRef.current === json) return;

        prevJsonRef.current = json;

        setFilteredData(initialData);
    }, [initialData]);

    const {control, handleSubmit, watch} = useForm({
        defaultValues: {
            search: "",
        },
        resolver: yupResolver(searchSchema),
    });

    const searchTerm = watch("search");

    const handleSearch = (data: SearchTermType) => {
        // This will be used for an explicit search action, e.g. on form submitted.
        // The live search is handled by the useEffect below.
        alert(`Searching for: ${data.search}`);
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchTerm && searchTerm.length >= 2) {
                const lowercasedFilter = searchTerm.toLowerCase();
                const filtered = initialData.filter((item) =>
                    searchKeys.some((key) => {
                        const value = item[key];
                        return typeof value === "string" && value.toLowerCase().includes(lowercasedFilter);
                    }),
                );
                setFilteredData(filtered);
            } else {
                setFilteredData(initialData);
            }
        }, debounceDelay);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, initialData, searchKeys, debounceDelay]);

    useEffect(() => {
        setFilteredData(initialData);
    }, [initialData]);

    return {
        searchControl: control,
        searchSubmit: handleSubmit,
        handleSearch,
        filteredData,
    };
};