/*================================================================*/
    /* Lista de Departament com os Centros de Custo de cada setor */
export const departaments = [
    {
        code: "10000",
        name: "Gestão de Pessoas",
        costCenters: [
            { code: "10000-01", name: "Recrutamento e Seleção" },
            { code: "10000-02", name: "Treinamento e Desenvolvimento" },
            { code: "10000-03", name: "Administração de Pessoal" },
            { code: "10000-04", name: "Benefícios" }
        ]
    },
    {
        code: "20000",
        name: "Departamento Financeiro",
        costCenters: [
            { code: "20000-01", name: "Contas a Pagar" },
            { code: "20000-02", name: "Contas a Receber" },
            { code: "20000-03", name: "Tesouraria" },
            { code: "20000-04", name: "Controladoria" },
            { code: "20000-05", name: "Faturamento" }
        ]
    },
    {
        code: "30000",
        name: "Departamento Serviços Gerais",
        costCenters: [
            { code: "30000-01", name: "Limpeza e Conservação" },
            { code: "30000-02", name: "Manutenção Predial" },
            { code: "30000-03", name: "Recepção" },
            { code: "30000-04", name: "Portaria" }
        ]
    },
    {
        code: "40000",
        name: "Segurança do Trabalho",
        costCenters: [
            { code: "40000-01", name: "Prevenção de Acidentes" },
            { code: "40000-02", name: "Treinamentos de Segurança" },
            { code: "40000-03", name: "Equipamentos de Proteção Individual" },
            { code: "40000-04", name: "Inspeções de Segurança" }
        ]
    }
];
