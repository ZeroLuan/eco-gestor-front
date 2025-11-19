// ===========================
// TYPES PARA ENDEREÇO
// ===========================

/**
 * Interface para criação de endereço
 */
export class EnderecoRequest {
    constructor(data = {}) {
        // Garante que todos os campos sejam strings, mesmo se vierem undefined
        this.cep = (data.cep || '').toString();
        this.logradouro = (data.logradouro || '').toString();
        this.numero = (data.numero || '').toString();
        this.complemento = (data.complemento || '').toString();
        this.bairro = (data.bairro || '').toString();
        this.cidade = (data.cidade || '').toString();
        this.estado = (data.estado || '').toString();
    }

    /**
     * Valida os dados obrigatórios
     * @returns {Object} {isValid: boolean, errors: string[]}
     */
    validar() {
        const errors = [];

        // Verifica se os campos existem e são strings
        if (!this.cep || typeof this.cep !== 'string') {
            errors.push('CEP é obrigatório');
        } else if (!this.cep.trim()) {
            errors.push('CEP é obrigatório');
        } else if (!/^\d{5}-?\d{3}$/.test(this.cep.replace(/\D/g, ''))) {
            errors.push('CEP inválido');
        }

        if (!this.logradouro || typeof this.logradouro !== 'string') {
            errors.push('Logradouro é obrigatório');
        } else if (!this.logradouro.trim()) {
            errors.push('Logradouro é obrigatório');
        }

        if (!this.numero || typeof this.numero !== 'string') {
            errors.push('Número é obrigatório');
        } else if (!this.numero.trim()) {
            errors.push('Número é obrigatório');
        }

        if (!this.bairro || typeof this.bairro !== 'string') {
            errors.push('Bairro é obrigatório');
        } else if (!this.bairro.trim()) {
            errors.push('Bairro é obrigatório');
        }

        if (!this.cidade || typeof this.cidade !== 'string') {
            errors.push('Cidade é obrigatória');
        } else if (!this.cidade.trim()) {
            errors.push('Cidade é obrigatória');
        }

        if (!this.estado || typeof this.estado !== 'string') {
            errors.push('Estado é obrigatório');
        } else if (!this.estado.trim()) {
            errors.push('Estado é obrigatório');
        } else if (this.estado.trim().length !== 2) {
            errors.push('Estado deve ter 2 caracteres (UF)');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Converte para JSON para envio à API
     */
    toJSON() {
        return {
            cep: this.cep.replace(/\D/g, ''), // Remove formatação do CEP
            logradouro: this.logradouro,
            numero: this.numero,
            complemento: this.complemento,
            bairro: this.bairro,
            cidade: this.cidade,
            estado: this.estado.toUpperCase()
        };
    }
}

/**
 * Interface para resposta da API de endereço
 */
export class EnderecoResponse {
    constructor(data = {}) {
        this.id = data.id || null;
        this.cep = data.cep || '';
        this.logradouro = data.logradouro || '';
        this.numero = data.numero || '';
        this.complemento = data.complemento || '';
        this.bairro = data.bairro || '';
        this.cidade = data.cidade || '';
        this.estado = data.estado || '';
        this.dataCriacao = data.dataCriacao || null;
        this.dataAtualizacao = data.dataAtualizacao || null;
    }

    /**
     * Converte dados da API para o formato usado no frontend
     * @param {Object} apiData - Dados vindos da API
     * @returns {EnderecoResponse}
     */
    static fromAPI(apiData) {
        if (!apiData || typeof apiData !== 'object') {
            console.warn('Dados da API inválidos:', apiData);
            return new EnderecoResponse();
        }

        return new EnderecoResponse({
            ...apiData,
            // Formata o CEP se vier sem formatação
            cep: apiData.cep ? apiData.cep.toString().replace(/(\d{5})(\d{3})/, '$1-$2') : ''
        });
    }

    /**
     * Retorna endereço formatado como string
     */
    toString() {
        const partes = [
            this.logradouro,
            this.numero,
            this.complemento,
            this.bairro,
            this.cidade,
            this.estado
        ].filter(p => p && p.trim());
        
        return partes.join(', ');
    }

    /**
     * Retorna endereço completo formatado
     */
    getEnderecoCompleto() {
        return {
            linha1: `${this.logradouro}, ${this.numero}${this.complemento ? ' - ' + this.complemento : ''}`,
            linha2: `${this.bairro} - ${this.cidade}/${this.estado}`,
            linha3: `CEP: ${this.cep}`
        };
    }
}
