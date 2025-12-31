/**
 * Utilitários para paginação
 */

/**
 * Constrói os parâmetros de query para paginação no formato Spring Boot
 * @param {Object} params - Parâmetros de paginação (page, size, sort)
 * @param {string} defaultSort - Ordenação padrão se não especificada
 * @returns {URLSearchParams} Query params prontos para uso
 */
export function buildPaginationParams(params = {}, defaultSort = 'id,asc') {
    const page = params.page || 0;
    const size = params.size || 10;
    const sort = params.sort || defaultSort;

    return new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort: sort
    });
}