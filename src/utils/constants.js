// ===========================
// CONSTANTES E ENUMS DO SISTEMA
// ===========================

/**
 * Tipos de Resíduos - Deve corresponder aos enums do backend
 */
export const TIPOS_RESIDUO = {
    PLASTICO: { value: 'PLASTICO', label: 'Plástico', cor: 'danger' },
    PAPEL: { value: 'PAPEL', label: 'Papel', cor: 'primary' },
    VIDRO: { value: 'VIDRO', label: 'Vidro', cor: 'info' },
    METAL: { value: 'METAL', label: 'Metal', cor: 'secondary' },
    ORGANICO: { value: 'ORGANICO', label: 'Orgânico', cor: 'success' },
    ELETRONICO: { value: 'ELETRONICO', label: 'Eletrônico', cor: 'warning' },
    MISTO: { value: 'MISTO', label: 'Misto', cor: 'dark' }
};

/**
 * Estados do Brasil
 */
export const ESTADOS_BRASIL = {
    AC: { value: 'AC', label: 'Acre' },
    AL: { value: 'AL', label: 'Alagoas' },
    AP: { value: 'AP', label: 'Amapá' },
    AM: { value: 'AM', label: 'Amazonas' },
    BA: { value: 'BA', label: 'Bahia' },
    CE: { value: 'CE', label: 'Ceará' },
    DF: { value: 'DF', label: 'Distrito Federal' },
    ES: { value: 'ES', label: 'Espírito Santo' },
    GO: { value: 'GO', label: 'Goiás' },
    MA: { value: 'MA', label: 'Maranhão' },
    MT: { value: 'MT', label: 'Mato Grosso' },
    MS: { value: 'MS', label: 'Mato Grosso do Sul' },
    MG: { value: 'MG', label: 'Minas Gerais' },
    PA: { value: 'PA', label: 'Pará' },
    PB: { value: 'PB', label: 'Paraíba' },
    PR: { value: 'PR', label: 'Paraná' },
    PE: { value: 'PE', label: 'Pernambuco' },
    PI: { value: 'PI', label: 'Piauí' },
    RJ: { value: 'RJ', label: 'Rio de Janeiro' },
    RN: { value: 'RN', label: 'Rio Grande do Norte' },
    RS: { value: 'RS', label: 'Rio Grande do Sul' },
    RO: { value: 'RO', label: 'Rondônia' },
    RR: { value: 'RR', label: 'Roraima' },
    SC: { value: 'SC', label: 'Santa Catarina' },
    SP: { value: 'SP', label: 'São Paulo' },
    SE: { value: 'SE', label: 'Sergipe' },
    TO: { value: 'TO', label: 'Tocantins' }
};

/**
 * Status do Ponto de Coleta
 */
export const STATUS_PONTO_COLETA = {
    ATIVO: { value: true, label: 'Ativo' },
    INATIVO: { value: false, label: 'Inativo' }
};

/**
 * Funções utilitárias para trabalhar com os enums
 */
export class EnumUtils {

    /**
     * Converte um enum para array de opções para select
     * @param {Object} enumObj - O objeto enum
     * @returns {Array} Array de opções {value, label}
     */
    static toSelectOptions(enumObj) {
        return Object.values(enumObj);
    }

    /**
     * Busca um item do enum pelo valor
     * @param {Object} enumObj - O objeto enum
     * @param {string} value - Valor a buscar
     * @returns {Object|null} Item encontrado ou null
     */
    static getByValue(enumObj, value) {
        return Object.values(enumObj).find(item => item.value === value) || null;
    }

    /**
     * Busca um item do enum pelo label
     * @param {Object} enumObj - O objeto enum
     * @param {string} label - Label a buscar
     * @returns {Object|null} Item encontrado ou null
     */
    static getByLabel(enumObj, label) {
        return Object.values(enumObj).find(item => item.label === label) || null;
    }

    /**
     * Formata o tipo de resíduo para exibição
     * @param {string} tipo - Valor do tipo
     * @returns {string} Label formatado
     */
    static formatarTipoResiduo(tipo) {
        const item = this.getByValue(TIPOS_RESIDUO, tipo);
        return item ? item.label : tipo;
    }

    /**
     * Retorna a cor do badge para o tipo de resíduo
     * @param {string} tipo - Valor do tipo
     * @returns {string} Classe CSS da cor
     */
    static getCorTipoResiduo(tipo) {
        const item = this.getByValue(TIPOS_RESIDUO, tipo);
        return item ? item.cor : 'secondary';
    }
}