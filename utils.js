export const getJobDetailsDescriptions = (location, job) => {
  if (location === "Milano") {
    if (job === "Cuoco primi") {
      return "Requisito: almeno 5 anni di esperienza nei primi piatti della cucina milanese";
    }
    if (job === "Cuoco secondi") {
      return "Requisito: almeno 2 anni di esperienza nei secondi piatti della cucina milanese";
    }
  }
  if (location === "Roma") {
    if (job === "Cuoco primi") {
      return "Requisito: almeno 2 anni di esperienza nei primi piatti della cucina romana";
    }
  }
  if (job === "Cameriere di sala") {
    return "Requisito: almeno 2 anni di esperienza";
  }
  if (job === "Maître") {
    return "Requisito: esperienza decennale";
  }
  if (location === "Qualsiasi") {
    if (job === "Cuoco primi") {
      return "Requisito sede di Milano: almeno 5 anni di esperienza nei primi piatti della cucina milanese\nRequisito sede di Roma: almeno 2 anni di esperienza nei primi piatti della cucina romana";
    }
    if (job === "Cuoco secondi") {
      return "Requisito sede di Milano: almeno 2 anni di esperienza nei secondi piatti della cucina milanese";
    }
  }
  return "";
};
