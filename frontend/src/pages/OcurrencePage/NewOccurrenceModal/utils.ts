export const fromDataToOption = (
    data: any,
    labelKeys: string[],
    valueKey: string
) => {
    const SEPARATOR = " - ";
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
    return optionArray;
};
