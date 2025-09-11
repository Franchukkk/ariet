export function formatPrice(num: number) {
    return Number(num).toLocaleString('en-US').replace(',', ' ');
}