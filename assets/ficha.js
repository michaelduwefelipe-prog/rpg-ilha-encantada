// ==========================================================================
// Ficha de Personagem — lógica de interação, auto-save e ações
// Depende de: acoes.js (getAcoes, rolarDados, calcularBonusAtributo)
// ==========================================================================

const CHAVE_AUTOSAVE = "rpg_ficha_autosave";
const CHAVE_ACOES_EQUIPADAS = "rpg_ficha_acoes_equipadas"; // array de IDs de ações "instaladas" nesta ficha

// ---------------------------------------------------------------------
// Utilitários de HP/Energia/Essência no formato "atual/máximo"
// ---------------------------------------------------------------------
function lerParFicha(valor) {
    const partes = String(valor || "0/0").split("/");
    const atual = parseInt(partes[0]) || 0;
    const max = partes.length > 1 ? (parseInt(partes[1]) || atual) : atual;
    return { atual, max };
}

function ajustarStat(id, sinal) {
    const input = document.getElementById(id);
    if (!input) return;

    const nomes = { hp: "HP", eng: "Energia", ess: "Essência" };
    const padrao = sinal > 0 ? "Recuperar quanto de" : "Perder quanto de";
    const valorTexto = prompt(`${padrao} ${nomes[id] || id}?`, "1");
    if (valorTexto === null) return;
    const quantidade = parseInt(valorTexto);
    if (isNaN(quantidade) || quantidade < 0) return;

    const { atual, max } = lerParFicha(input.value);
    let novo = atual + sinal * quantidade;
    if (novo < 0) novo = 0;
    if (max > 0 && novo > max) novo = max;

    input.value = max > 0 ? `${novo}/${max}` : `${novo}`;
    piscarStat(input);
    autoSalvar();
}

function piscarStat(input) {
    input.style.transition = "none";
    input.style.color = "#c0392b";
    requestAnimationFrame(() => {
        input.style.transition = "color 0.6s ease";
        input.style.color = "";
    });
}

function ajustarSaciamento() {
    const estados = ["Saciado", "Levemente Faminto", "Faminto", "Faminto Crítico"];
    const input = document.getElementById("fome");
    const atualIdx = Math.max(0, estados.indexOf(input.value));
    input.value = estados[(atualIdx + 1) % estados.length];
    autoSalvar();
}

// ---------------------------------------------------------------------
// Atributos e bônus (+[Atributo / 5])
// ---------------------------------------------------------------------
function updateAllBonus() {
    ["obs", "ref", "des", "for", "car", "fur"].forEach(chave => {
        const valorInput = document.getElementById("v_" + chave);
        const bonusSpan = document.getElementById("b_" + chave);
        if (!valorInput || !bonusSpan) return;
        const valor = parseInt(valorInput.value) || 0;
        const bonus = Math.floor(valor / 5);
        bonusSpan.textContent = (bonus >= 0 ? "+" : "") + bonus;
    });
    autoSalvar();
}

function valorAtributoPorNome(nome) {
    const mapa = {
        "Percepção": "v_obs", "Reflexo": "v_ref", "Destreza": "v_des",
        "Força": "v_for", "Carisma": "v_car", "Furtividade": "v_fur",
    };
    const id = mapa[nome];
    if (!id) return 0;
    const el = document.getElementById(id);
    return el ? (parseInt(el.value) || 0) : 0;
}

// ---------------------------------------------------------------------
// Ações Manuais (linhas livres)
// ---------------------------------------------------------------------
function addAtaque(dados) {
    dados = dados || {};
    const container = document.getElementById("lista-ataques");
    const linha = document.createElement("div");
    linha.className = "dynamic-item-ficha";
    linha.innerHTML = `
        <input type="text" class="nome-ataque" placeholder="Ex: Golpe de Espada" value="${dados.nome || ""}">
        <input type="text" class="dano-ataque" placeholder="1d8+FOR" value="${dados.dano || ""}">
        <input type="text" class="tipo-ataque" placeholder="Corte" value="${dados.tipo || ""}">
        <input type="text" class="custo-ataque" placeholder="0 Energia" value="${dados.custo || ""}">
        <button class="btn-del-ficha" onclick="this.parentElement.remove(); autoSalvar();">✕</button>
    `;
    container.appendChild(linha);
    autoSalvar();
}

function coletarAtaques() {
    return Array.from(document.querySelectorAll("#lista-ataques .dynamic-item-ficha")).map(linha => ({
        nome: linha.querySelector(".nome-ataque").value,
        dano: linha.querySelector(".dano-ataque").value,
        tipo: linha.querySelector(".tipo-ataque").value,
        custo: linha.querySelector(".custo-ataque").value,
    }));
}

// ---------------------------------------------------------------------
// Inventário
// ---------------------------------------------------------------------
function addItem(dados) {
    dados = dados || {};
    const container = document.getElementById("lista-itens");
    const linha = document.createElement("div");
    linha.className = "dynamic-item-ficha";
    linha.style.gridTemplateColumns = "2fr 0.6fr 1.4fr 30px";
    linha.innerHTML = `
        <input type="text" class="nome-item" placeholder="Ex: Poção de Cura" value="${dados.nome || ""}">
        <input type="text" class="qtd-item" placeholder="1x" value="${dados.qtd || ""}">
        <input type="text" class="obs-item" placeholder="Observação" value="${dados.obs || ""}">
        <button class="btn-del-ficha" onclick="this.parentElement.remove(); autoSalvar();">✕</button>
    `;
    container.appendChild(linha);
    autoSalvar();
}

function coletarItens() {
    return Array.from(document.querySelectorAll("#lista-itens .dynamic-item-ficha")).map(linha => ({
        nome: linha.querySelector(".nome-item").value,
        qtd: linha.querySelector(".qtd-item").value,
        obs: linha.querySelector(".obs-item").value,
    }));
}

// ---------------------------------------------------------------------
// Ações Salvas (vindas da tela Criar Ação, via localStorage)
// ---------------------------------------------------------------------
function getAcoesEquipadas() {
    try {
        const dados = localStorage.getItem(CHAVE_ACOES_EQUIPADAS);
        return dados ? JSON.parse(dados) : [];
    } catch (e) {
        return [];
    }
}

function salvarAcoesEquipadas(lista) {
    localStorage.setItem(CHAVE_ACOES_EQUIPADAS, JSON.stringify(lista));
}

function formulaAcaoTexto(acao) {
    let partes = [];
    if (acao.qtdDados > 0 && acao.ladosDado > 0) partes.push(`${acao.qtdDados}d${acao.ladosDado}`);
    if (acao.atributo && acao.atributo !== "Nenhum") partes.push(acao.atributo);
    let formula = partes.length > 0 ? partes.join(" + ") : "Sem rolagem";
    let custo = acao.custoTipo !== "Nenhum" ? ` · ${acao.custoValor} ${acao.custoTipo}` : "";
    return formula + custo;
}

function renderizarAcoesEquipadas() {
    const idsEquipados = getAcoesEquipadas();
    const todasAcoes = getAcoes();
    const container = document.getElementById("lista-acoes-custom");

    const equipadas = idsEquipados
        .map(id => todasAcoes.find(a => a.id === id))
        .filter(Boolean);

    if (equipadas.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#999; font-style:italic; font-size:0.85rem;">Nenhuma ação salva adicionada ainda.</p>`;
        return;
    }

    container.innerHTML = equipadas.map(acao => `
        <div class="acao-card-ficha" data-id="${acao.id}">
            ${acao.imagem
                ? `<img src="${acao.imagem}" alt="${acao.nome}">`
                : `<div class="acao-ph">${acao.tipo === "Ativa" ? "⚔️" : "🛡️"}</div>`}
            <div class="acao-info">
                <strong>${acao.nome}</strong>
                <span>${formulaAcaoTexto(acao)}</span>
                <span class="acao-resultado" id="resultado-${acao.id}"></span>
            </div>
            <div class="acao-botoes">
                <button class="btn-ativar" onclick="ativarAcao('${acao.id}')">🎲 Ativar</button>
                <button class="btn-remover" onclick="removerAcaoEquipada('${acao.id}')">Remover</button>
            </div>
        </div>
    `).join("");
}

function ativarAcao(id) {
    const acao = getAcoes().find(a => a.id === id);
    if (!acao) return;

    // Cobra o custo, se houver
    if (acao.custoTipo === "Energia" && acao.custoValor > 0) {
        ajustarStatSilencioso("eng", -acao.custoValor);
    } else if (acao.custoTipo === "Essência" && acao.custoValor > 0) {
        ajustarStatSilencioso("ess", -acao.custoValor);
    }

    let texto = "";
    if (acao.qtdDados > 0 && acao.ladosDado > 0) {
        const { total, rolagens } = rolarDados(acao.qtdDados, acao.ladosDado);
        const bonus = acao.atributo !== "Nenhum" ? calcularBonusAtributo(valorAtributoPorNomeCompleto(acao.atributo)) : 0;
        texto = `🎲 [${rolagens.join(", ")}] ${bonus !== 0 ? (bonus > 0 ? "+" + bonus : bonus) : ""} = ${total + bonus}`;
    } else if (acao.atributo !== "Nenhum") {
        texto = `Bônus de ${acao.atributo}: +${calcularBonusAtributo(valorAtributoPorNomeCompleto(acao.atributo))}`;
    } else {
        texto = "Ativada!";
    }

    const resultadoSpan = document.getElementById(`resultado-${id}`);
    if (resultadoSpan) resultadoSpan.textContent = texto;
}

function valorAtributoPorNomeCompleto(nome) {
    return valorAtributoPorNome(nome);
}

function ajustarStatSilencioso(id, delta) {
    const input = document.getElementById(id);
    if (!input) return;
    const { atual, max } = lerParFicha(input.value);
    let novo = atual + delta;
    if (novo < 0) novo = 0;
    if (max > 0 && novo > max) novo = max;
    input.value = max > 0 ? `${novo}/${max}` : `${novo}`;
    autoSalvar();
}

function removerAcaoEquipada(id) {
    const lista = getAcoesEquipadas().filter(existente => existente !== id);
    salvarAcoesEquipadas(lista);
    renderizarAcoesEquipadas();
}

// ---------------------------------------------------------------------
// Modal: escolher uma ação salva para adicionar à ficha
// ---------------------------------------------------------------------
function abrirModalAcoes() {
    const todasAcoes = getAcoes();
    const equipadas = new Set(getAcoesEquipadas());
    const listaModal = document.getElementById("modal-lista-acoes");
    const vazio = document.getElementById("modal-vazio");

    if (todasAcoes.length === 0) {
        listaModal.innerHTML = "";
        vazio.style.display = "block";
    } else {
        vazio.style.display = "none";
        listaModal.innerHTML = todasAcoes.map(acao => `
            <div class="acao-card">
                ${acao.imagem
                    ? `<img class="acao-card-img" src="${acao.imagem}" alt="${acao.nome}">`
                    : `<div class="acao-card-img-placeholder">${acao.tipo === "Ativa" ? "⚔️" : "🛡️"}</div>`}
                <div class="acao-card-body">
                    <h4>${acao.nome}</h4>
                    <span class="acao-meta">${acao.tipo} · ${formulaAcaoTexto(acao)}</span>
                    <p>${acao.descricao || "<em>Sem descrição.</em>"}</p>
                    <div class="acao-card-acoes">
                        <button class="btn-grimorio ${equipadas.has(acao.id) ? "secundario" : ""}"
                                onclick="adicionarAcaoNaFicha('${acao.id}')"
                                ${equipadas.has(acao.id) ? "disabled" : ""}>
                            ${equipadas.has(acao.id) ? "✔️ Já adicionada" : "➕ Adicionar"}
                        </button>
                    </div>
                </div>
            </div>
        `).join("");
    }

    document.getElementById("modal-acoes").classList.add("aberto");
}

function fecharModalAcoes() {
    document.getElementById("modal-acoes").classList.remove("aberto");
}

function adicionarAcaoNaFicha(id) {
    const lista = getAcoesEquipadas();
    if (!lista.includes(id)) lista.push(id);
    salvarAcoesEquipadas(lista);
    renderizarAcoesEquipadas();
    fecharModalAcoes();
}

// ---------------------------------------------------------------------
// Salvar / Carregar Ficha (arquivo .json + auto-save no navegador)
// ---------------------------------------------------------------------
function montarObjetoFicha() {
    const objeto = { campos: {}, checks: {}, ataques: [], itens: [] };

    document.querySelectorAll(".save-data").forEach(el => {
        if (el.id) objeto.campos[el.id] = el.value;
    });
    document.querySelectorAll(".save-data-check").forEach(el => {
        if (el.id) objeto.checks[el.id] = el.checked;
    });
    objeto.ataques = coletarAtaques();
    objeto.itens = coletarItens();
    objeto.acoesEquipadas = getAcoesEquipadas();

    return objeto;
}

function aplicarObjetoFicha(objeto) {
    if (!objeto) return;

    Object.entries(objeto.campos || {}).forEach(([id, valor]) => {
        const el = document.getElementById(id);
        if (el) el.value = valor;
    });
    Object.entries(objeto.checks || {}).forEach(([id, marcado]) => {
        const el = document.getElementById(id);
        if (el) el.checked = marcado;
    });

    document.getElementById("lista-ataques").innerHTML = "";
    (objeto.ataques || []).forEach(a => addAtaque(a));

    document.getElementById("lista-itens").innerHTML = "";
    (objeto.itens || []).forEach(i => addItem(i));

    if (objeto.acoesEquipadas) {
        salvarAcoesEquipadas(objeto.acoesEquipadas);
    }

    updateAllBonus();
    renderizarAcoesEquipadas();
}

function autoSalvar() {
    try {
        localStorage.setItem(CHAVE_AUTOSAVE, JSON.stringify(montarObjetoFicha()));
    } catch (e) {
        console.error("Não foi possível salvar automaticamente:", e);
    }
}

function salvarFicha() {
    autoSalvar();
    const objeto = montarObjetoFicha();
    const nome = objeto.campos.nome ? objeto.campos.nome.trim().replace(/\s+/g, "_") : "personagem";
    const blob = new Blob([JSON.stringify(objeto, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ficha-${nome || "personagem"}.json`;
    a.click();
}

function carregarFicha(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const objeto = JSON.parse(e.target.result);
            aplicarObjetoFicha(objeto);
            autoSalvar();
            alert("Ficha carregada com sucesso!");
        } catch (err) {
            alert("Não foi possível ler esse arquivo. Verifique se é um .json de ficha exportado daqui mesmo.");
        }
    };
    reader.readAsText(file);
    event.target.value = "";
}

// ---------------------------------------------------------------------
// Inicialização
// ---------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // Tenta restaurar a última ficha usada neste navegador
    try {
        const salvo = localStorage.getItem(CHAVE_AUTOSAVE);
        if (salvo) aplicarObjetoFicha(JSON.parse(salvo));
    } catch (e) {
        console.error("Não foi possível restaurar a ficha salva:", e);
    }

    updateAllBonus();
    renderizarAcoesEquipadas();

    // Auto-save contínuo para qualquer campo editado manualmente
    document.querySelectorAll(".save-data, .save-data-check").forEach(el => {
        el.addEventListener("input", autoSalvar);
        el.addEventListener("change", autoSalvar);
    });

    // Fecha o modal clicando fora da caixa
    document.getElementById("modal-acoes").addEventListener("click", (e) => {
        if (e.target.id === "modal-acoes") fecharModalAcoes();
    });
});
