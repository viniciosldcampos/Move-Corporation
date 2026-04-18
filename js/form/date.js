/* Impede selecionar datas passadas no campo de input de data */
export const date = document.addEventListener("DOMContentLoaded", () => {
    const hoje = new Date().toISOString().split("T")[0];

    document.querySelectorAll(".date-input").forEach(input => {
        input.min = hoje;
    });
});
