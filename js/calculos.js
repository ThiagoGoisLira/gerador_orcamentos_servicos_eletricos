/**
 * Formata um número para Real Brasileiro (R$ 0,00)
 */
export function formatCurrency(value) {
    const num = parseFloat(value) || 0;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Limpa a formatação (R$ e pontos) e devolve um número decimal para a Base de Dados
 */
export function parseCurrency(text) {
    return parseFloat(text.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
}