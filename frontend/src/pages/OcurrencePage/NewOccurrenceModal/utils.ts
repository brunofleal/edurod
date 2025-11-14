import type Option from "../../../interfaces/option";

const getNestedValue = (obj: any, path: string) => {
    return path
        .split(".")
        .reduce(
            (acc, part) => (acc && acc[part] !== undefined ? acc[part] : ""),
            obj
        );
};

export const fromDataToOption = (
    data: any,
    labelKeys: string[],
    valueKey: string
) => {
    const SEPARATOR = " | ";
    let label = "";
    for (const labelKey of labelKeys) {
        const value = getNestedValue(data, labelKey);
        if (label === "") {
            label = value;
        } else {
            label += SEPARATOR + value;
        }
    }
    return { label, value: getNestedValue(data, valueKey) };
};

export const fromDataArrayToOption = (
    data: any[],
    labelKeys: string[],
    valueKey: string
) => {
    const optionArray = [];
    for (const dataElement of data) {
        optionArray.push(fromDataToOption(dataElement, labelKeys, valueKey));
    }
    return optionArray.sort((a, b) => (a.label > b.label ? 1 : -1));
};

export const getOptionFromValue = (options: Option[], value?: string) => {
    for (const option of options) {
        if (option.value == value) {
            return [option];
        }
    }
    return undefined;
};
