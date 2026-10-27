export function simularK(a, b, K0, S_array) {
  const K = [K0];
  for (let j = 0; j < S_array.length; j++) {
    const S = S_array[j];
    const K_star = a * S / (a * S + b);
    const K_next = K_star + (K[j] - K_star) * Math.exp(-(a * S + b));
    K.push(K_next);
  }
  return K;
}

export function rmse(observado, predicho) {
  let sum = 0;
  let count = 0;
  for (let i = 0; i < observado.length; i++) {
    if (observado[i] !== null && predicho[i] !== undefined) {
      sum += (observado[i] - predicho[i]) ** 2;
      count++;
    }
  }
  return count > 0 ? Math.sqrt(sum / count) : 0;
}

export function r2(observado, predicho) {
  const pares = observado.map((obs, i) => ({ obs, pred: predicho[i] }))
    .filter(p => p.obs !== null && p.pred !== undefined);
  if (pares.length === 0) return 0;
  const media = pares.reduce((sum, p) => sum + p.obs, 0) / pares.length;
  const ss_tot = pares.reduce((sum, p) => sum + (p.obs - media) ** 2, 0);
  const ss_res = pares.reduce((sum, p) => sum + (p.obs - p.pred) ** 2, 0);
  return ss_tot > 0 ? 1 - ss_res / ss_tot : 0;
}

export function equilibrio(a, S, b) {
  return a * S / (a * S + b);
}
