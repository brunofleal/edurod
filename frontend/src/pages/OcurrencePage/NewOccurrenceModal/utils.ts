import type Option from "../../../interfaces/option";

export const fromDataToOption = (
    data: any,
    labelKeys: string[],
    valueKey: string
) => {
    const SEPARATOR = " | ";
    let label = "";
    for (const labelKey of labelKeys) {
        if (label === "") {
            label = data[labelKey];
        } else {
            label += SEPARATOR + data[labelKey];
        }
    }
    return { label, value: data[valueKey] };
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
