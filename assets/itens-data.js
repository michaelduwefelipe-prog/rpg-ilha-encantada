// ==========================================================================
// Dataset de Itens — Ilha Encantada
// Ordem de raridade (pior -> melhor)
// ==========================================================================

const ORDEM_RARIDADE = ["Comum", "Incomum", "Raro", "Épico", "Lendário", "Mítica"];

const ITENS = [
    // ---------- LÂMINA ----------
    { nome: "Faca de Carne", categoria: "Lâmina", raridade: "Comum", efeito: "1d4" },
    { nome: "Adaga de Bronze", categoria: "Lâmina", raridade: "Comum", efeito: "1d6" },
    { nome: "Cutelo de Açougueiro", categoria: "Lâmina", raridade: "Incomum", efeito: "1d6 + Sangramento" },
    { nome: "Espada Curta", categoria: "Lâmina", raridade: "Incomum", efeito: "1d8" },
    { nome: "Cimitarra do Deserto", categoria: "Lâmina", raridade: "Incomum", efeito: "Ignora escudos de madeira" },
    { nome: "Sabre de Pirata", categoria: "Lâmina", raridade: "Incomum", efeito: "+2 Reflexo em Contragolpe" },
    { nome: "Florete de Duelo", categoria: "Lâmina", raridade: "Raro", efeito: "1d8 + Reflexo em dobro" },
    { nome: "Espada Longa de Aço", categoria: "Lâmina", raridade: "Raro", efeito: "1d10" },
    { nome: "Katar de Vidro", categoria: "Lâmina", raridade: "Raro", efeito: "Sangramento severo · quebra ao tirar 1" },
    { nome: "Lâmina de Prata", categoria: "Lâmina", raridade: "Raro", efeito: "Dano dobrado vs. lobos/monstros" },
    { nome: "Montante de Cavaleiro", categoria: "Lâmina", raridade: "Épico", efeito: "2d8 (área)" },
    { nome: "Excalibur de Madeira", categoria: "Lâmina", raridade: "Mítica", efeito: "1d20 · nocauteia, não mata" },

    // ---------- IMPACTO ----------
    { nome: "Cajado de Pastor", categoria: "Impacto", raridade: "Comum", efeito: "1d6" },
    { nome: "Clava de Madeira", categoria: "Impacto", raridade: "Comum", efeito: "1d6 + chance de atordoar" },
    { nome: "Pedreta Grande", categoria: "Impacto", raridade: "Comum", efeito: "1d4 (arma improvisada)" },
    { nome: "Martelo de Carpinteiro", categoria: "Impacto", raridade: "Incomum", efeito: "1d6" },
    { nome: "Rolo de Massa de Ferro", categoria: "Impacto", raridade: "Incomum", efeito: "1d6 · skill de Cozinheiro" },
    { nome: "Remo de Carvalho", categoria: "Impacto", raridade: "Incomum", efeito: "Empurra 2 passos" },
    { nome: "Frigideira de Ferro", categoria: "Impacto", raridade: "Incomum", efeito: "Barulho alto que atordoa" },
    { nome: "Soco Inglês de Latão", categoria: "Impacto", raridade: "Incomum", efeito: "Soco vira 1d6" },
    { nome: "Malho de Ferro", categoria: "Impacto", raridade: "Raro", efeito: "1d12 · quebra armaduras" },
    { nome: "Mangual de Correntes", categoria: "Impacto", raridade: "Raro", efeito: "1d10 · difícil de desviar" },
    { nome: "Mastro de Navio", categoria: "Impacto", raridade: "Épico", efeito: "2d10 · exige 15 de Força" },
    { nome: "Bigorna com Corrente", categoria: "Impacto", raridade: "Lendário", efeito: "4d10 · lenta, gasta toda a Energia" },

    // ---------- HASTE ----------
    { nome: "Forquilha de Fazenda", categoria: "Haste", raridade: "Comum", efeito: "1d6 · três pontas, difícil de desviar" },
    { nome: "Vassoura de Palha", categoria: "Haste", raridade: "Comum", efeito: "Cegueira por Poeira (1 turno)" },
    { nome: "Lança de Caça", categoria: "Haste", raridade: "Incomum", efeito: "1d8 · perfura à distância" },
    { nome: "Foice de Colheita", categoria: "Haste", raridade: "Incomum", efeito: "1d8 · puxa o pescoço do inimigo" },
    { nome: "Alabarda", categoria: "Haste", raridade: "Raro", efeito: "1d10 · corta ou perfura" },
    { nome: "Tridente de Pescador", categoria: "Haste", raridade: "Raro", efeito: "1d10 · triplicado na água" },
    { nome: "Bastão de Ferro", categoria: "Haste", raridade: "Raro", efeito: "Aumenta o movimento (salto)" },
    { nome: "Lança de Torneio", categoria: "Haste", raridade: "Épico", efeito: "Dano dobrado montado" },

    // ---------- À DISTÂNCIA ----------
    { nome: "Estilingue de Couro", categoria: "À Distância", raridade: "Comum", efeito: "1d6 · usa pedras" },
    { nome: "Arco Curto", categoria: "À Distância", raridade: "Incomum", efeito: "1d6 · rápido de disparar" },
    { nome: "Zarabatana", categoria: "À Distância", raridade: "Incomum", efeito: "1d4 + veneno/sono" },
    { nome: "Rede de Pescador", categoria: "À Distância", raridade: "Incomum", efeito: "Sem dano · prende (Imóvel)" },
    { nome: "Bomba de Fumaça", categoria: "À Distância", raridade: "Incomum", efeito: "Nuvem 3×3 · item de Alquimista" },
    { nome: "Frasco de Ácido", categoria: "À Distância", raridade: "Incomum", efeito: "1d6 por 3 turnos" },
    { nome: "Arco Longo", categoria: "À Distância", raridade: "Raro", efeito: "1d10 · grande alcance" },
    { nome: "Besta Pesada", categoria: "À Distância", raridade: "Raro", efeito: "1d12 · perfura armadura, recarrega em 1 turno" },
    { nome: "Pistola de Pederneira", categoria: "À Distância", raridade: "Épico", efeito: "2d6 · barulhenta" },
    { nome: "Bacamarte / Escopeta", categoria: "À Distância", raridade: "Lendário", efeito: "2d10 · dano em cone" },

    // ---------- CONTOS DE FADAS ----------
    { nome: "Cesto de Doces (Chapeuzinho)", categoria: "Contos de Fadas", raridade: "Comum", efeito: "Recupera Saciamento do grupo" },
    { nome: "Nariz de Madeira Reserva", categoria: "Contos de Fadas", raridade: "Comum", efeito: "Porrete · cresce se mentir" },
    { nome: "Pente Envenenado (Bruxa)", categoria: "Contos de Fadas", raridade: "Incomum", efeito: "Reduz HP máx. até cura de Médico" },
    { nome: "Espelho de Mão", categoria: "Contos de Fadas", raridade: "Incomum", efeito: "Reflete 1 feitiço mágico" },
    { nome: "Maçã Vermelha", categoria: "Contos de Fadas", raridade: "Incomum", efeito: "Recupera toda Energia · nocauteia 1 dia" },
    { nome: "Sapatinho de Cristal", categoria: "Contos de Fadas", raridade: "Raro", efeito: "1d10 arremesso · quebra após o uso" },
    { nome: "Pena de Ganso de Ouro", categoria: "Contos de Fadas", raridade: "Raro", efeito: "Vendida por 50 moedas de ouro" },
    { nome: "Fuso da Bela Adormecida", categoria: "Contos de Fadas", raridade: "Raro", efeito: "Sono por 1d10 turnos ao perfurar" },
    { nome: "Lâmpada de Azeite", categoria: "Contos de Fadas", raridade: "Raro", efeito: "Ilumina área enorme por 1h" },
    { nome: "Capa de Invisibilidade", categoria: "Contos de Fadas", raridade: "Lendário", efeito: "+20 Furtividade parado" },
];

const ITENS_TRABALHO = [
    { nome: "Machado de Lenhador Antigo", raridade: "Incomum", efeito: "+5 dano em árvores/objetos" },
    { nome: "Picareta de Minerador", raridade: "Comum", efeito: "1d8 como arma" },
    { nome: "Bisturi de Médico", raridade: "Comum", efeito: "1d4 · ignora bônus de Reflexo" },
    { nome: "Martelo de Ferradura (Ferreiro)", raridade: "Comum", efeito: "Bônus vs. armadura de ferro" },
    { nome: "Agulha de Prata (Alfaiate)", raridade: "Incomum", efeito: "Ataque difícil de notar" },
    { nome: "Pá de Coveiro", raridade: "Incomum", efeito: "Enterra itens / cria buracos" },
    { nome: "Flauta Mágica (Músico)", raridade: "Raro", efeito: "Gasta 2 de Essência para tocar" },
    { nome: "Anzol de Ouro (Pescador)", raridade: "Raro", efeito: "Nunca erra fisgada em peixes raros" },
];

// ---------- Normalização para busca (ignora acentos e caixa) ----------
function normalizar(txt) {
    return txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function badgeRaridade(raridade) {
    const slug = normalizar(raridade).replace(/[^a-z]/g, "");
    return `<span class="item-raridade badge-${slug}" style="color:#fff; padding:2px 8px; border-radius:10px;">${raridade}</span>`;
}

let filtroRaridadeAtual = "todos";

function renderizarItens() {
    const termo = normalizar(document.getElementById("busca").value.trim());
    const container = document.getElementById("resultado-itens");
    const semResultados = document.getElementById("sem-resultados");
    const contador = document.getElementById("contador");

    const filtrados = ITENS.filter(item => {
        const bateBusca = !termo || normalizar(item.nome).includes(termo);
        const bateRaridade = filtroRaridadeAtual === "todos" || item.raridade === filtroRaridadeAtual;
        return bateBusca && bateRaridade;
    });

    contador.textContent = `${filtrados.length} de ${ITENS.length} itens`;

    if (filtrados.length === 0) {
        container.innerHTML = "";
        semResultados.style.display = "block";
        return;
    }
    semResultados.style.display = "none";

    let html = "";
    ORDEM_RARIDADE.forEach(raridade => {
        const doGrupo = filtrados.filter(i => i.raridade === raridade);
        if (doGrupo.length === 0) return;
        const slug = normalizar(raridade).replace(/[^a-z]/g, "");
        html += `<div class="grupo-raridade grupo-${slug}">`;
        html += `<div class="grupo-raridade-titulo">${raridade} (${doGrupo.length})</div>`;
        doGrupo.forEach(item => {
            html += `
                <div class="item-lista">
                    <span class="item-nome">${item.nome}</span>
                    <span class="item-categoria">${item.categoria}</span>
                    <span class="item-dano">${item.efeito}</span>
                </div>`;
        });
        html += `</div>`;
    });
    container.innerHTML = html;
}

function renderizarTrabalho() {
    const container = document.getElementById("lista-trabalho");
    let html = "";
    ITENS_TRABALHO.forEach(item => {
        html += `
            <div class="item-lista">
                <span class="item-nome">${item.nome}</span>
                ${badgeRaridade(item.raridade)}
                <span class="item-dano">${item.efeito}</span>
            </div>`;
    });
    container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarItens();
    renderizarTrabalho();

    document.getElementById("busca").addEventListener("input", renderizarItens);

    document.querySelectorAll("#filtros .chip").forEach(chip => {
        chip.addEventListener("click", () => {
            document.querySelectorAll("#filtros .chip").forEach(c => c.classList.remove("ativo"));
            chip.classList.add("ativo");
            filtroRaridadeAtual = chip.dataset.raridade;
            renderizarItens();
        });
    });
});
