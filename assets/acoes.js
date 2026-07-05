// ==========================================================================
// Ações Customizadas — armazenamento local (localStorage) compartilhado
// entre criar-acao.html e ficha.html
// ==========================================================================

const CHAVE_ACOES = "rpg_acoes_customizadas";

function getAcoes() {
    try {
        const dados = localStorage.getItem(CHAVE_ACOES);
        return dados ? JSON.parse(dados) : [];
    } catch (e) {
        console.error("Erro ao ler ações salvas:", e);
        return [];
    }
}

function salvarListaAcoes(lista) {
    try {
        localStorage.setItem(CHAVE_ACOES, JSON.stringify(lista));
        return true;
    } catch (e) {
        console.error("Erro ao salvar ações:", e);
        alert("Não foi possível salvar. O armazenamento do navegador pode estar cheio.");
        return false;
    }
}

function rolarDados(qtd, lados) {
    let total = 0;
    const rolagens = [];
    for (let i = 0; i < qtd; i++) {
        const r = Math.floor(Math.random() * lados) + 1;
        rolagens.push(r);
        total += r;
    }
    return { total, rolagens };
}

function calcularBonusAtributo(valorAtributo) {
    return Math.floor((parseInt(valorAtributo) || 0) / 5);
}

// ---------------------------------------------------------------------
// Lógica exclusiva da página criar-acao.html
// ---------------------------------------------------------------------
if (document.getElementById("galeria-acoes")) {

    const previewImg = document.getElementById("preview");
    const uploadTexto = document.getElementById("upload-texto");

    document.getElementById("f-imagem").addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (ev) {
            previewImg.src = ev.target.result;
            previewImg.style.display = "block";
            uploadTexto.textContent = "📷 " + file.name;
        };
        reader.readAsDataURL(file);
    });

    window.limparFormulario = function () {
        document.getElementById("f-nome").value = "";
        document.getElementById("f-tipo").value = "Ativa";
        document.getElementById("f-qtd").value = "1";
        document.getElementById("f-dado").value = "6";
        document.getElementById("f-atributo").value = "Nenhum";
        document.getElementById("f-custo-tipo").value = "Nenhum";
        document.getElementById("f-custo-valor").value = "0";
        document.getElementById("f-descricao").value = "";
        document.getElementById("f-imagem").value = "";
        previewImg.src = "";
        previewImg.style.display = "none";
        uploadTexto.textContent = "📷 Clique para escolher uma imagem";
    };

    window.salvarAcao = function () {
        const nome = document.getElementById("f-nome").value.trim();
        if (!nome) {
            alert("Dê um nome para a ação antes de salvar.");
            return;
        }

        const acao = {
            id: "acao_" + Date.now(),
            nome: nome,
            tipo: document.getElementById("f-tipo").value,
            qtdDados: parseInt(document.getElementById("f-qtd").value) || 0,
            ladosDado: parseInt(document.getElementById("f-dado").value) || 0,
            atributo: document.getElementById("f-atributo").value,
            custoTipo: document.getElementById("f-custo-tipo").value,
            custoValor: parseInt(document.getElementById("f-custo-valor").value) || 0,
            descricao: document.getElementById("f-descricao").value.trim(),
            imagem: previewImg.src && previewImg.style.display !== "none" ? previewImg.src : null,
        };

        const lista = getAcoes();
        lista.push(acao);
        if (salvarListaAcoes(lista)) {
            limparFormulario();
            renderizarGaleria();
        }
    };

    window.excluirAcao = function (id) {
        if (!confirm("Excluir esta ação? Isso não pode ser desfeito.")) return;
        const lista = getAcoes().filter(a => a.id !== id);
        salvarListaAcoes(lista);
        renderizarGaleria();
    };

    window.exportarAcoes = function () {
        const lista = getAcoes();
        if (lista.length === 0) {
            alert("Você ainda não tem nenhuma ação para exportar.");
            return;
        }
        const blob = new Blob([JSON.stringify(lista, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "acoes-rpg.json";
        a.click();
    };

    window.importarAcoes = function (event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const novas = JSON.parse(e.target.result);
                if (!Array.isArray(novas)) throw new Error("Formato inválido");
                const atual = getAcoes();
                const idsAtuais = new Set(atual.map(a => a.id));
                novas.forEach(a => {
                    if (!idsAtuais.has(a.id)) atual.push(a);
                });
                salvarListaAcoes(atual);
                renderizarGaleria();
                alert("Ações importadas com sucesso!");
            } catch (err) {
                alert("Não foi possível ler esse arquivo. Verifique se é um .json exportado daqui mesmo.");
            }
        };
        reader.readAsText(file);
        event.target.value = "";
    };

    function formulaTexto(acao) {
        let partes = [];
        if (acao.qtdDados > 0 && acao.ladosDado > 0) partes.push(`${acao.qtdDados}d${acao.ladosDado}`);
        if (acao.atributo && acao.atributo !== "Nenhum") partes.push(acao.atributo);
        let formula = partes.length > 0 ? partes.join(" + ") : "Sem rolagem";
        let custo = acao.custoTipo !== "Nenhum" ? ` · Custo: ${acao.custoValor} ${acao.custoTipo}` : "";
        return formula + custo;
    }

    function renderizarGaleria() {
        const lista = getAcoes();
        const galeria = document.getElementById("galeria-acoes");
        const vazio = document.getElementById("galeria-vazia");

        if (lista.length === 0) {
            galeria.innerHTML = "";
            vazio.style.display = "block";
            return;
        }
        vazio.style.display = "none";

        galeria.innerHTML = lista.map(acao => `
            <div class="acao-card">
                ${acao.imagem
                    ? `<img class="acao-card-img" src="${acao.imagem}" alt="${acao.nome}">`
                    : `<div class="acao-card-img-placeholder">${acao.tipo === "Ativa" ? "⚔️" : "🛡️"}</div>`}
                <div class="acao-card-body">
                    <h4>${acao.nome}</h4>
                    <span class="acao-meta">${acao.tipo} · ${formulaTexto(acao)}</span>
                    <p>${acao.descricao || "<em>Sem descrição.</em>"}</p>
                    <div class="acao-card-acoes">
                        <button class="btn-grimorio vermelho" onclick="excluirAcao('${acao.id}')">🗑️ Excluir</button>
                    </div>
                </div>
            </div>
        `).join("");
    }

    renderizarGaleria();
}
