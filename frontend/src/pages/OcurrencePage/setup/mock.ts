import type { OccurrenceRegistry } from "../../../interfaces/occurrenceRegistry";

export const occurrencesMock: OccurrenceRegistry[] = [
  {
    occurrence: {
      name: "Atraso na partida",
      type: "Atraso",
    },
    driver: {
      name: "João da Silva",
      code: "12345",
    },
    line: {
      name: "Maranguape",
      code: "1001",
    },
    createdAt: new Date(2025, 7, 24, 10, 30, 0).toISOString(),
    isResolved: false,
  },
  {
    occurrence: {
      name: "Veículo quebrou",
      type: "Quebra de veículo",
    },
    driver: {
      name: "Maria Oliveira",
      code: "54321",
    },
    line: {
      name: "Fortaleza x Canindé",
      code: "1002",
    },
    createdAt: new Date(2025, 7, 24, 11, 0, 0).toISOString(),
    isResolved: false,
  },
  {
    occurrence: {
      name: "Pneu furado",
      type: "Manutenção",
    },
    driver: {
      name: "José Santos",
      code: "67890",
    },
    line: {
      name: "Caucaia x Pecém",
      code: "1003",
    },
    createdAt: new Date(2025, 7, 24, 12, 15, 0).toISOString(),
    isResolved: false,
  },
];
