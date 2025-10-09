import type Option from "../../../interfaces/option";

export const mockedDriverOptions: Option[] = [
    { label: "João da Silva", value: "1" },
    { label: "Carlos de Souza", value: "2" },
    { label: "Pedro Oliveira", value: "3" },
    { label: "Lucas Martins", value: "4" },
    { label: "Matheus Pereira", value: "5" },
    { label: "Gabriel Alves", value: "6" },
    { label: "Felipe Lima", value: "7" },
    { label: "Marcos Rocha", value: "8" },
    { label: "Rafael Costa", value: "9" },
    { label: "Bruno Santos", value: "10" },
];

export const mockedOccurrenceOptions: Option[] = [
    { label: "Atraso na linha", value: "atraso_linha" },
    { label: "Acidente na via", value: "acidente_via" },
    { label: "Problema mecânico", value: "problema_mecanico" },
    { label: "Congestionamento", value: "congestionamento" },
    { label: "Assalto no ônibus", value: "assalto_onibus" },
    { label: "Manutenção não programada", value: "manutencao_nao_programada" },
    { label: "Pneu furado", value: "pneu_furado" },
    { label: "Falta de combustível", value: "falta_combustivel" },
    { label: "Motorista passou mal", value: "motorista_passou_mal" },
    { label: "Passageiro passou mal", value: "passageiro_passou_mal" },
];

export const mockedLineOptions: Option[] = [
    { label: "Linha 101 - Centro", value: "101" },
    { label: "Linha 102 - Bairro Novo", value: "102" },
    { label: "Linha 203 - Circular", value: "203" },
    { label: "Linha 304 - Terminal Sul", value: "304" },
    { label: "Linha 405 - Terminal Norte", value: "405" },
    { label: "Linha 506 - Universidade", value: "506" },
    { label: "Linha 607 - Aeroporto", value: "607" },
    { label: "Linha 708 - Shopping", value: "708" },
    { label: "Linha 809 - Noturna", value: "809" },
    { label: "Linha 910 - Expresso", value: "910" },
];

export const mockedSource: Option[] = [
    { label: "Reclamação SAC", value: "sac" },
    { label: "CTTU", value: "cttu" },
    { label: "Reclamação interna", value: "interna" },
];
