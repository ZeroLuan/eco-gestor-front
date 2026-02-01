// Remove tudo que não é dígito
export const apenasNumeros = (valor: string): string => {
    return valor.replace(/\D/g, '');
};

export const formatarCNPJ = (valor: string): string => {
    // Remove tudo que não é dígito
    const apenasDigitos = valor.replace(/\D/g, '');

    // Limita a 14 dígitos
    const truncado = apenasDigitos.substring(0, 14);

    // Aplica a máscara: 00.000.000/0000-00
    return truncado
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
};

export const formatarTelefone = (valor: string): string => {
    // Remove tudo que não é dígito
    const apenasDigitos = valor.replace(/\D/g, '');

    // Limita a 11 dígitos
    const truncado = apenasDigitos.substring(0, 11);

    // Aplica a máscara: (00) 00000-0000 ou (00) 0000-0000
    if (truncado.length <= 10) {
        return truncado
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        return truncado
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2');
    }
};

export const formatarCNAE = (valor: string): string => {
    return apenasNumeros(valor).substring(0, 7);
};

export const formatarNaturezaJuridica = (valor: string): string => {
    // Remove tudo que não é dígito
    const apenasDigitos = valor.replace(/\D/g, '');

    // Limita a 4 dígitos (XXX-X)
    const truncado = apenasDigitos.substring(0, 4);

    // Aplica a máscara: XXX-X
    if (truncado.length <= 3) {
        return truncado;
    }
    return truncado.replace(/^(\d{3})(\d)/, '$1-$2');
};
