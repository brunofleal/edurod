import type Option from "../../../interfaces/option";

export const MenuLabels = {
    Occurrence: "Tipo de Ocorrência*",
    Source: "Origem*",
    Driver: "Motorista*",
    Line: "Linha*",
};

export const sourceOptions: Option[] = [
    { label: "CTTU", value: "cttu" },
    { label: "Reclamação SAC", value: "sac" },
    { label: "Reclamação interna", value: "interna" },
    { label: "Filmagem", value: "filmagem" },
];
