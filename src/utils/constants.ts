export const TIPOS_RESIDUO = {
    PLASTICO: { value: "PLASTICO", label: "Plástico", cor: "danger" },
    PAPEL: { value: "PAPEL", label: "Papel", cor: "primary" },
    VIDRO: { value: "VIDRO", label: "Vidro", cor: "info" },
    METAL: { value: "METAL", label: "Metal", cor: "secondary" },
    ORGANICO: { value: "ORGANICO", label: "Orgânico", cor: "success" },
    ELETRONICO: { value: "ELETRONICO", label: "Eletrônico", cor: "warning" },
    MISTO: { value: "MISTO", label: "Misto", cor: "dark" },
};

export const ESTADOS_BRASIL = {
    AC: { value: "AC", label: "Acre" },
    AL: { value: "AL", label: "Alagoas" },
    AP: { value: "AP", label: "Amapá" },
    AM: { value: "AM", label: "Amazonas" },
    BA: { value: "BA", label: "Bahia" },
    CE: { value: "CE", label: "Ceará" },
    DF: { value: "DF", label: "Distrito Federal" },
    ES: { value: "ES", label: "Espírito Santo" },
    GO: { value: "GO", label: "Goiás" },
    MA: { value: "MA", label: "Maranhão" },
    MT: { value: "MT", label: "Mato Grosso" },
    MS: { value: "MS", label: "Mato Grosso do Sul" },
    MG: { value: "MG", label: "Minas Gerais" },
    PA: { value: "PA", label: "Pará" },
    PB: { value: "PB", label: "Paraíba" },
    PR: { value: "PR", label: "Paraná" },
    PE: { value: "PE", label: "Pernambuco" },
    PI: { value: "PI", label: "Piauí" },
    RJ: { value: "RJ", label: "Rio de Janeiro" },
    RN: { value: "RN", label: "Rio Grande do Norte" },
    RS: { value: "RS", label: "Rio Grande do Sul" },
    RO: { value: "RO", label: "Rondônia" },
    RR: { value: "RR", label: "Roraima" },
    SC: { value: "SC", label: "Santa Catarina" },
    SP: { value: "SP", label: "São Paulo" },
    SE: { value: "SE", label: "Sergipe" },
    TO: { value: "TO", label: "Tocantins" },
};

export const STATUS_PONTO_COLETA = {
    ATIVO: { value: true, label: "Ativo" },
    INATIVO: { value: false, label: "Inativo" },
};

export const TIPOS_LICENCA = {
    LP: { value: "LP", label: "Licença Prévia (LP)" },
    LI: { value: "LI", label: "Licença de Instalação (LI)" },
    L0: { value: "L0", label: "Licença de Operação (L0)" },
};

export const STATUS_LICENCA = {
    ATIVA: { value: "ATIVA", label: "Ativa", cor: "success" },
    VENCIDA: { value: "VENCIDA", label: "Vencida", cor: "danger" },
    PENDENTE: { value: "PENDENTE", label: "Pendente", cor: "warning" },
    INATIVA: { value: "INATIVA", label: "Inativa", cor: "secondary" },
};

export class EnumUtils {
    static toSelectOptions(enumObj: any) {
        return Object.values(enumObj);
    }

    static getByValue(enumObj: any, value: any): any {
        return Object.values(enumObj).find((item: any) => item.value === value) || null;
    }

    static getByLabel(enumObj: any, label: any) {
        return Object.values(enumObj).find((item: any) => item.label === label) || null;
    }

    static formatarTipoResiduo(tipo: string) {
        const item = this.getByValue(TIPOS_RESIDUO, tipo);
        return item ? item.label : tipo;
    }

    static getCorTipoResiduo(tipo: string) {
        const item = this.getByValue(TIPOS_RESIDUO, tipo);
        return item ? item.cor : "secondary";
    }
}
