// =========================================================================
// 0. DICIONÁRIO DE SIGLAS E TOOLTIP INTERATIVO AO PASSAR O MOUSE
// =========================================================================
const ACRONYM_DICTIONARY = {
    'SUS': 'Sistema Único de Saúde — sistema público e universal de saúde do Brasil.',
    'IBGE': 'Instituto Brasileiro de Geografia e Estatística — provedor oficial de dados territoriais (UFs e municípios).',
    'DataSUS': 'Departamento de Informação e Informática do SUS — órgão gestor das bases nacionais de saúde.',
    'OpenDataSUS': 'Portal de Dados Abertos do Ministério da Saúde.',
    'CNES': 'Cadastro Nacional de Estabelecimentos de Saúde — base oficial de unidades e infraestrutura física.',
    'SIA': 'Sistema de Informações Ambulatoriais do SUS — registra atendimentos, consultas e exames ambulatoriais.',
    'SIH': 'Sistema de Informações Hospitalares do SUS — registra internações e procedimentos hospitalares.',
    'FNS': 'Fundo Nacional de Saúde — gestor financeiro dos repasses federais para estados e municípios.',
    'CNS': 'Cartão Nacional de Saúde (Cartão do SUS) — identificador único longitudinal do cidadão no SUS.',
    'CPF': 'Cadastro de Pessoas Físicas — documento de identificação civil vinculado ao cadastro nacional.',
    'RNDS': 'Rede Nacional de Dados em Saúde — plataforma nacional de interoperabilidade em saúde (padrão HL7 FHIR).',
    'SISREG': 'Sistema Nacional de Regulação — plataforma web para agendamento e regulação de consultas e exames.',
    'SER': 'Sistema Estadual de Regulação — central estadual de regulação de leitos e procedimentos especializados.',
    'CROSS': 'Central de Regulação de Ofertas de Serviços de Saúde — sistema estadual de regulação de São Paulo.',
    'SIGA': 'Sistema Integrado de Gestão Assistencial — plataforma municipal de agendamento e regulação em saúde.',
    'e-SUS': 'Estratégia de Informatização do SUS — ecossistema digital de atenção primária e regulação do Ministério da Saúde.',
    'SIGTAP': 'Sistema de Gerenciamento da Tabela de Procedimentos, Medicamentos e OPM do SUS.',
    'UF': 'Unidade Federativa — estado brasileiro ou Distrito Federal.',
    'SES': 'Secretaria Estadual de Saúde — órgão gestor do SUS na esfera estadual.',
    'SMS': 'Secretaria Municipal de Saúde — órgão gestor do SUS na esfera municipal.',
    'CSV': 'Comma-Separated Values — formato de planilha tabular com valores separados por vírgula ou ponto e vírgula.',
    'JSON': 'JavaScript Object Notation — formato leve de intercâmbio estruturado de dados entre sistemas.',
    'KPIs': 'Key Performance Indicators — Indicadores-Chave de Desempenho assistencial e financeiro.',
    'EBSERH': 'Empresa Brasileira de Serviços Hospitalares — gestora da rede de hospitais universitários federais.',
    'AMEs': 'Ambulatórios Médicos de Especialidades — unidades estaduais de diagnóstico e atenção especializada.',
    'UPAs': 'Unidades de Pronto Atendimento — estabelecimentos de urgência e emergência 24 horas.',
    'FHEMIG': 'Fundação Hospitalar do Estado de Minas Gerais.',
    'SESAB': 'Secretaria da Saúde do Estado da Bahia.',
    'SESAI': 'Secretaria de Saúde Indígena — responsável pelo subsistema de atenção à saúde indígena.',
    'SESA': 'Secretaria de Estado da Saúde.',
    'SESPA': 'Secretaria de Estado de Saúde Pública do Pará.',
    'ECG': 'Eletrocardiograma — exame diagnóstico da atividade elétrica cardíaca.',
    'MS': 'Ministério da Saúde — órgão gestor federal do SUS.'
};

function annotateAcronyms(text) {
    if (!text) return '';
    const keys = Object.keys(ACRONYM_DICTIONARY).sort((a, b) => b.length - a.length);
    const escapedKeys = keys.map(k => k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const regex = new RegExp('(^|[^A-Za-zÀ-ÿ0-9_-])(' + escapedKeys.join('|') + ')(?=$|[^A-Za-zÀ-ÿ0-9_-])', 'g');
    return String(text).replace(regex, function(_, prefix, match) {
        return prefix + '<abbr data-acronym="' + match + '">' + match + '</abbr>';
    });
}

function initAcronymTooltips() {
    const tooltip = document.getElementById('acronymTooltip');
    const keyEl = document.getElementById('acronymTooltipKey');
    const descEl = document.getElementById('acronymTooltipDesc');
    if (!tooltip || !keyEl || !descEl) return;

    document.querySelectorAll('abbr[data-acronym]').forEach(el => {
        const sigla = el.getAttribute('data-acronym');
        if (ACRONYM_DICTIONARY[sigla] && !el.getAttribute('aria-label')) {
            el.setAttribute('aria-label', `${sigla}: ${ACRONYM_DICTIONARY[sigla]}`);
        }
    });

    function showAcronymTooltip(target) {
        const sigla = target.getAttribute('data-acronym');
        const fullDesc = ACRONYM_DICTIONARY[sigla];
        if (!fullDesc) return;

        keyEl.textContent = sigla;
        descEl.textContent = fullDesc;
        tooltip.classList.remove('hidden');

        const rect = target.getBoundingClientRect();
        const tipRect = tooltip.getBoundingClientRect();
        const margin = 8;

        let left = rect.left + rect.width / 2 - tipRect.width / 2;
        left = Math.max(margin, Math.min(left, window.innerWidth - tipRect.width - margin));

        let top = rect.top - tipRect.height - margin;
        if (top < margin) {
            top = rect.bottom + margin;
        }

        tooltip.style.left = `${Math.round(left)}px`;
        tooltip.style.top = `${Math.round(top)}px`;
    }

    function hideAcronymTooltip() {
        tooltip.classList.add('hidden');
    }

    document.addEventListener('mouseover', e => {
        const abbr = e.target.closest('abbr[data-acronym]');
        if (abbr) showAcronymTooltip(abbr);
    });

    document.addEventListener('mouseout', e => {
        const abbr = e.target.closest('abbr[data-acronym]');
        if (abbr && (!e.relatedTarget || !abbr.contains(e.relatedTarget))) {
            hideAcronymTooltip();
        }
    });

    document.addEventListener('focusin', e => {
        const abbr = e.target.closest('abbr[data-acronym]');
        if (abbr) showAcronymTooltip(abbr);
    });

    document.addEventListener('focusout', e => {
        const abbr = e.target.closest('abbr[data-acronym]');
        if (abbr) hideAcronymTooltip();
    });

    window.addEventListener('scroll', hideAcronymTooltip, { passive: true });
}

// =========================================================================
// 1. ESTADO GLOBAL DA APLICAÇÃO
// =========================================================================
let state = {
    estadosIBGE: [],
    municipiosIBGE: [],
    apiRecords: [],
    uploadedRecords: [],
    filteredRecords: [],
    patientJourneys: [],
    selectedPatientCns: '700.0482.9184.0001',
    currentPage: 1,
    rowsPerPage: 8,
    mobileFiltersOpen: false,
    rndsResizeObserver: null,
    rndsRafId: null,
    charts: {
        bar: null,
        doughnut: null,
        sparklines: []
    }
};

// =========================================================================
// 2. INICIALIZAÇÃO E CHAMADAS DE API (IBGE REAL + BASE SINTÉTICA DATASUS)
// =========================================================================
document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();
    initAcronymTooltips();
    setupDragAndDrop('inlineDropZone');
    setupDragAndDrop('modalDropZone');
    initCharts();
    initSparklines();
    initPatientJourneys();
    renderPatientTracking(state.selectedPatientCns);

    window.addEventListener('resize', scheduleRndsFlowLinesUpdate, { passive: true });
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(scheduleRndsFlowLinesUpdate);
    }

    await loadIBGEStates();
    await syncApis();
});

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function focusSearch() {
    const input = document.getElementById('tableSearch');
    if (input) {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => input.focus(), 300);
    }
}

function toggleMobileFilters() {
    state.mobileFiltersOpen = !state.mobileFiltersOpen;
    const container = document.getElementById('filtersContainer');
    const chevron = document.getElementById('mobileFilterChevron');
    if (state.mobileFiltersOpen) {
        container.classList.remove('hidden');
        container.classList.add('grid');
        chevron.classList.add('rotate-180');
    } else {
        container.classList.add('hidden');
        container.classList.remove('grid');
        chevron.classList.remove('rotate-180');
    }
}

async function loadIBGEStates() {
    try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
        if (!response.ok) throw new Error('Falha na API IBGE Estados');
        state.estadosIBGE = await response.json();
        populateEstadoSelect(state.estadosIBGE);
    } catch (error) {
        console.warn('Usando fallback de estados:', error);
    }
}

function populateEstadoSelect(estados) {
    const select = document.getElementById('filterEstado');
    const regiaoSelecionada = document.getElementById('filterRegiao').value;
    select.innerHTML = '<option value="ALL">Todos os Estados</option>';

    estados
        .filter(uf => regiaoSelecionada === 'BR' || uf.regiao.nome === regiaoSelecionada)
        .forEach(uf => {
            const opt = document.createElement('option');
            opt.value = uf.sigla;
            opt.textContent = `${uf.nome} (${uf.sigla})`;
            select.appendChild(opt);
        });
}

function handleRegiaoChange() {
    populateEstadoSelect(state.estadosIBGE);
    document.getElementById('filterEstado').value = 'ALL';
    handleEstadoChange();
}

async function handleEstadoChange() {
    const uf = document.getElementById('filterEstado').value;
    const munSelect = document.getElementById('filterMunicipio');

    if (uf === 'ALL') {
        munSelect.innerHTML = '<option value="ALL">Todos os Municípios</option>';
        munSelect.disabled = true;
        munSelect.classList.add('text-slate-400');
        munSelect.classList.remove('text-slate-700');
        applyFilters();
        return;
    }

    munSelect.disabled = false;
    munSelect.classList.remove('text-slate-400');
    munSelect.classList.add('text-slate-700');
    munSelect.innerHTML = '<option value="ALL">Carregando municípios...</option>';

    try {
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`);
        const municipios = await res.json();
        state.municipiosIBGE = municipios;

        munSelect.innerHTML = `<option value="ALL">Todos (${municipios.length} municípios)</option>`;
        municipios.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.nome;
            opt.textContent = m.nome;
            munSelect.appendChild(opt);
        });
    } catch (e) {
        munSelect.innerHTML = '<option value="ALL">Todos os Municípios</option>';
    }

    applyFilters();
}

async function syncApis() {
    const icon = document.getElementById('syncIcon');
    if (icon) icon.classList.add('animate-spin');

    try {
        await new Promise(resolve => setTimeout(resolve, 400));

        // Base sintética estruturada em memória simulando indicadores DataSUS / SES
        state.apiRecords = [
            { id: 'FED-01', fonte: 'API_FEDERAL', esfera: 'Federal', regiao: 'Nacional', uf: 'BR', municipio: 'Brasília (Rede Federal)', unidade: 'Ministério da Saúde - Hospitais Universitários (EBSERH)', estabelecimentos: 45, leitos: 9850, atendimentos: 642000, repasse: 485000000 },
            { id: 'EST-SP', fonte: 'API_ESTADUAL', esfera: 'Estadual', regiao: 'Sudeste', uf: 'SP', municipio: 'São Paulo', unidade: 'SES-SP - Complexo Hospitalar das Clínicas & AMEs', estabelecimentos: 312, leitos: 14200, atendimentos: 1280000, repasse: 620000000 },
            { id: 'FED-SP', fonte: 'API_FEDERAL', esfera: 'Federal', regiao: 'Sudeste', uf: 'SP', municipio: 'Campinas', unidade: 'DataSUS / CNES - Rede Regional de Urgência', estabelecimentos: 94, leitos: 3150, atendimentos: 310000, repasse: 142000000 },
            { id: 'EST-RJ', fonte: 'API_ESTADUAL', esfera: 'Estadual', regiao: 'Sudeste', uf: 'RJ', municipio: 'Rio de Janeiro', unidade: 'SES-RJ - Hospitais Estaduais & UPAs 24h', estabelecimentos: 188, leitos: 8900, atendimentos: 795000, repasse: 390000000 },
            { id: 'FED-RJ', fonte: 'API_FEDERAL', esfera: 'Federal', regiao: 'Sudeste', uf: 'RJ', municipio: 'Rio de Janeiro', unidade: 'Rede Federal RJ (Bonsucesso, Lagoa, Ipanema, Andaraí)', estabelecimentos: 16, leitos: 2450, atendimentos: 248000, repasse: 215000000 },
            { id: 'EST-MG', fonte: 'API_ESTADUAL', esfera: 'Estadual', regiao: 'Sudeste', uf: 'MG', municipio: 'Belo Horizonte', unidade: 'SES-MG / FHEMIG - Rede Hospitalar Estadual', estabelecimentos: 210, leitos: 9400, atendimentos: 830000, repasse: 410000000 },
            { id: 'EST-BA', fonte: 'API_ESTADUAL', esfera: 'Estadual', regiao: 'Nordeste', uf: 'BA', municipio: 'Salvador', unidade: 'SESAB - Hospitais Gerais e Policlínicas Regionais', estabelecimentos: 175, leitos: 7600, atendimentos: 690000, repasse: 345000000 },
            { id: 'FED-PE', fonte: 'API_FEDERAL', esfera: 'Federal', regiao: 'Nordeste', uf: 'PE', municipio: 'Recife', unidade: 'OpenDataSUS - Polo Médico do Nordeste', estabelecimentos: 132, leitos: 6100, atendimentos: 540000, repasse: 278000000 },
            { id: 'EST-RS', fonte: 'API_ESTADUAL', esfera: 'Estadual', regiao: 'Sul', uf: 'RS', municipio: 'Porto Alegre', unidade: 'SES-RS - Rede Hospitalar e Atenção Especializada', estabelecimentos: 164, leitos: 7200, atendimentos: 615000, repasse: 312000000 },
            { id: 'EST-PR', fonte: 'API_ESTADUAL', esfera: 'Estadual', regiao: 'Sul', uf: 'PR', municipio: 'Curitiba', unidade: 'SESA-PR - Complexos Hospitalares Regionais', estabelecimentos: 158, leitos: 6850, atendimentos: 590000, repasse: 298000000 },
            { id: 'FED-AM', fonte: 'API_FEDERAL', esfera: 'Federal', regiao: 'Norte', uf: 'AM', municipio: 'Manaus', unidade: 'DataSUS / SESAI - Saúde Indígena e Rede Fluvial', estabelecimentos: 98, leitos: 3800, atendimentos: 340000, repasse: 195000000 },
            { id: 'EST-PA', fonte: 'API_ESTADUAL', esfera: 'Estadual', regiao: 'Norte', uf: 'PA', municipio: 'Belém', unidade: 'SESPA - Hospitais Regionais do Pará', estabelecimentos: 124, leitos: 4950, atendimentos: 425000, repasse: 230000000 },
            { id: 'EST-GO', fonte: 'API_ESTADUAL', esfera: 'Estadual', regiao: 'Centro-Oeste', uf: 'GO', municipio: 'Goiânia', unidade: 'SES-GO - Rede Estadual de Alta Complexidade', estabelecimentos: 118, leitos: 5100, atendimentos: 460000, repasse: 245000000 }
        ];

        const now = new Date();
        const timeFormatted = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('lastUpdateTime').textContent = timeFormatted;
        const mobileTime = document.getElementById('mobileSyncTime');
        if (mobileTime) mobileTime.textContent = timeFormatted;

        applyFilters();
        showToast('API IBGE sincronizada e base sintética DataSUS atualizada!', 'success');
    } catch (err) {
        showToast('Erro ao sincronizar fontes de dados.', 'error');
    } finally {
        if (icon) icon.classList.remove('animate-spin');
    }
}

// =========================================================================
// 3. UPLOAD, DRAG-AND-DROP E NORMALIZAÇÃO DE DADOS
// =========================================================================
function openUploadModal() {
    const modal = document.getElementById('uploadModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function setupDragAndDrop(elementId) {
    const dropZone = document.getElementById(elementId);
    if (!dropZone) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, e => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('border-teal-600', 'bg-teal-50/70');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('border-teal-600', 'bg-teal-50/70');
        });
    });

    dropZone.addEventListener('drop', e => {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) processUploadedFile(files[0]);
    });
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processUploadedFile(file);
        event.target.value = '';
    }
}

function processUploadedFile(file) {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.csv')) {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: results => {
                if (results.data && results.data.length > 0) {
                    ingestNormalizedData(results.data, file.name);
                } else {
                    showToast('O arquivo CSV está vazio ou inválido.', 'warning');
                }
            },
            error: () => showToast('Erro ao processar o arquivo CSV.', 'error')
        });
    } else if (fileName.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const parsed = JSON.parse(e.target.result);
                const rows = Array.isArray(parsed) ? parsed : (parsed.registros || parsed.data || [parsed]);
                ingestNormalizedData(rows, file.name);
            } catch (err) {
                showToast('Arquivo JSON malformado.', 'error');
            }
        };
        reader.readAsText(file);
    } else {
        showToast('Formato não suportado. Envie um arquivo .CSV ou .JSON.', 'warning');
    }
}

function ingestNormalizedData(rawRows, sourceFileName) {
    const normalized = rawRows.map((row, index) => {
        const clean = {};
        Object.keys(row).forEach(k => {
            const normKey = k.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            clean[normKey] = row[k];
        });

        return {
            id: `UPL-${Date.now()}-${index}`,
            fonte: 'UPLOAD_LOCAL',
            esfera: clean.esfera || 'Municipal',
            regiao: clean.regiao || 'Sudeste',
            uf: (clean.uf || clean.estado || 'SP').toString().toUpperCase().slice(0, 2),
            municipio: clean.municipio || clean.cidade || 'Município Importado',
            unidade: clean.unidade || clean.estabelecimento || `Importado (${sourceFileName})`,
            estabelecimentos: Number(clean.estabelecimentos || clean.unidades || 1) || 1,
            leitos: Number(clean.leitos || 0) || 0,
            atendimentos: Number(clean.atendimentos || clean.procedimentos || 0) || 0,
            repasse: Number(String(clean.repasse || clean.valor || 0).replace(/[^\d.-]/g, '')) || 0
        };
    });

    state.uploadedRecords = [...normalized, ...state.uploadedRecords];
    document.getElementById('uploadCountBadge').textContent = `${state.uploadedRecords.length} registros locais`;

    const headline = document.getElementById('uploadStatusHeadline');
    const subtext = document.getElementById('uploadStatusSubtext');
    if (headline && subtext) {
        headline.textContent = 'Arquivo Importado com Sucesso!';
        headline.className = 'text-xs font-bold text-emerald-600';
        subtext.textContent = `+ ${normalized.length} registro(s) unificado(s) de "${sourceFileName}"`;
    }

    closeUploadModal();
    applyFilters();
    showToast(`${normalized.length} registro(s) unificados ao painel!`, 'success');
}

function downloadSampleCSV() {
    const sample = [
        { esfera: 'Municipal', regiao: 'Sudeste', uf: 'SP', municipio: 'Guarulhos', unidade: 'SMS Guarulhos - Hospital Municipal Pimentas', estabelecimentos: 42, leitos: 380, atendimentos: 34500, repasse: 16200000 },
        { esfera: 'Municipal', regiao: 'Sul', uf: 'SC', municipio: 'Joinville', unidade: 'SMS Joinville - Hospital Municipal São José', estabelecimentos: 36, leitos: 310, atendimentos: 29800, repasse: 14100000 },
        { esfera: 'Estadual', regiao: 'Nordeste', uf: 'CE', municipio: 'Fortaleza', unidade: 'SESA-CE - Hospital Geral de Fortaleza', estabelecimentos: 64, leitos: 620, atendimentos: 58900, repasse: 28400000 }
    ];
    const csv = Papa.unparse(sample);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo_importacao_sus.csv';
    a.click();
    URL.revokeObjectURL(url);
}

function injectSampleUpload() {
    const sampleRows = [
        { esfera: 'Municipal', regiao: 'Sudeste', uf: 'RJ', municipio: 'Duque de Caxias', unidade: 'CSV Local - Hospital Moacyr Rodrigues', estabelecimentos: 48, leitos: 420, atendimentos: 38500, repasse: 18500000 },
        { esfera: 'Municipal', regiao: 'Sudeste', uf: 'SP', municipio: 'Santos', unidade: 'CSV Local - Complexo Hospitalar Zona Noroeste', estabelecimentos: 52, leitos: 490, atendimentos: 44200, repasse: 22100000 },
        { esfera: 'Municipal', regiao: 'Nordeste', uf: 'BA', municipio: 'Feira de Santana', unidade: 'CSV Local - Policlínicas Municipais', estabelecimentos: 39, leitos: 340, atendimentos: 31800, repasse: 15400000 }
    ];
    ingestNormalizedData(sampleRows, 'Secretarias_Municipais_2026.csv');
}

// =========================================================================
// 4. RASTREIO LONGITUDINAL DO PACIENTE (RESPONSIVO MOBILE + DESKTOP)
// =========================================================================
function initPatientJourneys() {
    state.patientJourneys = [
        {
            cns: '700.0482.9184.0001',
            cpf: '***.412.897-**',
            nome: 'Maria Helena S.',
            idade: 54,
            municipioResidencia: 'Rio de Janeiro - RJ',
            alocacoes: [
                {
                    id: 'ALOC-MUN-901',
                    esfera: 'Municipal',
                    sistema: 'SISREG Municipal (SMS-RJ)',
                    procedimento: 'Exame de Ultrassonografia',
                    codigoSigtap: '02.05.02.004-6',
                    unidade: 'Policlínica Rodolpho Rocco',
                    horario: '08:30h',
                    dataAgendada: '24/11/2026',
                    status: 'Agendado',
                    protocolo: 'MUN-2026-88412'
                },
                {
                    id: 'ALOC-EST-442',
                    esfera: 'Estadual',
                    sistema: 'SER Estadual (SES-RJ)',
                    procedimento: 'Exame de Ultrassonografia',
                    codigoSigtap: '02.05.02.004-6',
                    unidade: 'Hospital Estadual Getúlio Vargas',
                    horario: '14:00h',
                    dataAgendada: '02/12/2026',
                    status: 'Fila Regulada',
                    protocolo: 'EST-2026-19034'
                },
                {
                    id: 'ALOC-FED-118',
                    esfera: 'Federal',
                    sistema: 'e-SUS Regulação (MS)',
                    procedimento: 'Exame de Ultrassonografia',
                    codigoSigtap: '02.05.02.004-6',
                    unidade: 'Hospital Federal de Bonsucesso',
                    horario: '16:30h',
                    dataAgendada: '10/12/2026',
                    status: 'Solicitação Ativa',
                    protocolo: 'FED-2026-55209'
                }
            ]
        },
        {
            cns: '704.9912.3340.0008',
            cpf: '***.883.104-**',
            nome: 'Carlos Eduardo M.',
            idade: 62,
            municipioResidencia: 'São Paulo - SP',
            alocacoes: [
                {
                    id: 'ALOC-MUN-310',
                    esfera: 'Municipal',
                    sistema: 'SIGA Saúde (SMS-SP)',
                    procedimento: 'Ressonância Magnética de Crânio',
                    codigoSigtap: '02.07.01.006-4',
                    unidade: 'Hosp. Municipal Dr. Carmino Caricchio',
                    horario: '09:00h',
                    dataAgendada: '28/11/2026',
                    status: 'Agendado',
                    protocolo: 'SP-MUN-77310'
                },
                {
                    id: 'ALOC-EST-789',
                    esfera: 'Estadual',
                    sistema: 'CROSS Estadual (SES-SP)',
                    procedimento: 'Ressonância Magnética de Crânio',
                    codigoSigtap: '02.07.01.006-4',
                    unidade: 'AME Maria Zélia (Rede Estadual)',
                    horario: '11:30h',
                    dataAgendada: '05/12/2026',
                    status: 'Agendado',
                    protocolo: 'SP-CROSS-44012'
                }
            ]
        },
        {
            cns: '898.0014.7721.0003',
            cpf: '***.219.650-**',
            nome: 'Ana Beatriz R.',
            idade: 31,
            municipioResidencia: 'Belo Horizonte - MG',
            alocacoes: [
                {
                    id: 'ALOC-MUN-502',
                    esfera: 'Municipal',
                    sistema: 'SUS-BH Regulação',
                    procedimento: 'Consulta em Cardiologia + ECG',
                    codigoSigtap: '03.01.01.007-2',
                    unidade: 'Centro de Especialidades Médicas BH',
                    horario: '15:00h',
                    dataAgendada: '21/11/2026',
                    status: 'Agendamento Consolidado',
                    protocolo: 'BH-2026-30911'
                }
            ]
        }
    ];
}

function selectSamplePatient(cns) {
    document.getElementById('patientSearchInput').value = cns;
    state.selectedPatientCns = cns;
    renderPatientTracking(cns);
}

function searchPatientJourney() {
    const query = document.getElementById('patientSearchInput').value.trim().toLowerCase();
    if (!query) {
        renderPatientTracking(state.selectedPatientCns);
        return;
    }
    const found = state.patientJourneys.find(p =>
        p.cns.toLowerCase().includes(query) ||
        p.cpf.toLowerCase().includes(query) ||
        p.nome.toLowerCase().includes(query)
    );
    if (found) {
        state.selectedPatientCns = found.cns;
        renderPatientTracking(found.cns);
    } else {
        showToast('Paciente não localizado na base simulada RNDS/SISREG.', 'warning');
    }
}

function detectMultiSphereOverlap(alocacoes) {
    const byProcedure = {};
    alocacoes.forEach(a => {
        if (!byProcedure[a.codigoSigtap]) byProcedure[a.codigoSigtap] = [];
        byProcedure[a.codigoSigtap].push(a);
    });

    const conflicts = [];
    Object.entries(byProcedure).forEach(([sigtap, items]) => {
        const distinctSpheres = [...new Set(items.map(i => i.esfera))];
        if (distinctSpheres.length > 1) {
            conflicts.push({
                codigoSigtap: sigtap,
                procedimento: items[0].procedimento,
                esferas: distinctSpheres,
                totalAlocacoes: items.length
            });
        }
    });
    return conflicts;
}

function scheduleRndsFlowLinesUpdate() {
    if (state.rndsRafId) cancelAnimationFrame(state.rndsRafId);
    state.rndsRafId = requestAnimationFrame(() => {
        state.rndsRafId = null;
        updateRndsFlowLines();
    });
}

function updateRndsFlowLines() {
    const diagram = document.getElementById('rndsFlowDiagram');
    const svg = document.getElementById('rndsFlowSvg');
    const originNode = document.getElementById('rndsOriginNode');
    if (!diagram || !svg || !originNode) return;

    // No layout mobile (< 640px) o SVG horizontal fica oculto
    if (window.getComputedStyle(svg).display === 'none') {
        svg.innerHTML = '';
        return;
    }

    const diagramRect = diagram.getBoundingClientRect();
    if (diagramRect.width === 0 || diagramRect.height === 0) return;

    const originAnchor = document.getElementById('rndsOriginAnchor');
    const originRect = originAnchor ? originAnchor.getBoundingClientRect() : originNode.getBoundingClientRect();

    const startX = originAnchor
        ? (originRect.left + originRect.width / 2) - diagramRect.left
        : originRect.right - diagramRect.left;
    const startY = (originRect.top + originRect.height / 2) - diagramRect.top;

    const cards = diagram.querySelectorAll('.rnds-aloc-card');
    svg.setAttribute('viewBox', `0 0 ${diagramRect.width} ${diagramRect.height}`);
    svg.setAttribute('width', diagramRect.width);
    svg.setAttribute('height', diagramRect.height);

    const paths = [];
    cards.forEach(card => {
        const anchor = card.querySelector('.rnds-card-anchor');
        const targetRect = anchor ? anchor.getBoundingClientRect() : card.getBoundingClientRect();

        const endX = anchor
            ? (targetRect.left + targetRect.width / 2) - diagramRect.left
            : targetRect.left - diagramRect.left;
        const endY = (targetRect.top + targetRect.height / 2) - diagramRect.top;

        const color = card.dataset.lineColor || '#2DD4BF';
        const opacity = card.dataset.lineOpacity || '0.85';

        const dx = Math.max(24, endX - startX);
        const cp1x = startX + dx * 0.52;
        const cp2x = endX - dx * 0.48;

        const d = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${cp1x.toFixed(1)} ${startY.toFixed(1)}, ${cp2x.toFixed(1)} ${endY.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`;

        // Brilho suave de fundo + curva principal exatamente alinhada aos centros das âncoras
        paths.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="5" stroke-opacity="0.14" stroke-linecap="round" />`);
        paths.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="2.2" stroke-opacity="${opacity}" stroke-linecap="round" />`);
    });

    svg.innerHTML = paths.join('');
}

function observeRndsFlowDiagram() {
    if (state.rndsResizeObserver) {
        state.rndsResizeObserver.disconnect();
        state.rndsResizeObserver = null;
    }

    const diagram = document.getElementById('rndsFlowDiagram');
    if (!diagram || typeof ResizeObserver === 'undefined') return;

    state.rndsResizeObserver = new ResizeObserver(() => {
        scheduleRndsFlowLinesUpdate();
    });

    state.rndsResizeObserver.observe(diagram);
    const originNode = document.getElementById('rndsOriginNode');
    if (originNode) state.rndsResizeObserver.observe(originNode);
    diagram.querySelectorAll('.rnds-aloc-card').forEach(card => {
        state.rndsResizeObserver.observe(card);
    });
}

function renderPatientTracking(cns) {
    const container = document.getElementById('patientTrackingResult');
    const patient = state.patientJourneys.find(p => p.cns === cns) || state.patientJourneys[0];
    if (!patient) return;

    const conflicts = detectMultiSphereOverlap(patient.alocacoes);
    const conflictingCodes = new Set(conflicts.map(c => c.codigoSigtap));
    const hasConflict = conflicts.length > 0;

    const actionButton = hasConflict ? `
        <button onclick="resolveDuplicateAllocations('${patient.cns}', '${conflicts[0].codigoSigtap}')" class="w-full sm:w-auto justify-center px-3.5 py-2 sm:py-1.5 rounded-xl sm:rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition flex items-center gap-1.5 cursor-pointer">
            <span>Consolidar Vaga & Liberar Duplicadas</span>
            <i data-lucide="check-check" class="w-3.5 h-3.5"></i>
        </button>
    ` : `
        <span class="w-full sm:w-auto justify-center px-3 py-1.5 rounded-xl sm:rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-semibold text-xs flex items-center gap-1.5">
            <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i>
            <span>Vaga Única Consolidada</span>
        </span>
    `;

    const alertBanner = hasConflict ? `
        <div class="my-3 px-3 py-2.5 rounded-xl bg-rose-950/80 border border-rose-500/45 flex items-start sm:items-center gap-2 text-xs text-rose-200 shadow-inner">
            <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0"></i>
            <span><strong>Detecção de Sobreposição:</strong> ${conflicts[0].procedimento} em ${conflicts[0].totalAlocacoes} esferas simultâneas.</span>
        </div>
    ` : `
        <div class="my-3 px-3 py-2.5 rounded-xl bg-emerald-950/65 border border-emerald-500/35 flex items-center gap-2 text-xs text-emerald-200">
            <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400 shrink-0"></i>
            <span><strong>Fluxo Regulado Íntegro:</strong> Sem agendamento duplicado entre esferas.</span>
        </div>
    `;

    const sphereIcons = {
        'Municipal': 'building',
        'Estadual': 'landmark',
        'Federal': 'globe'
    };

    const stackedNodesHtml = patient.alocacoes.map((aloc, idx) => {
        const isConsolidated = aloc.status.includes('Consolidado');
        const isConflicting = conflictingCodes.has(aloc.codigoSigtap);
        const isFirstConflict = isConflicting && idx === 0;

        let cardStyle = 'bg-[#213237]/90 border-white/10 text-slate-200';
        let iconBoxStyle = 'bg-white/10 text-teal-300';
        let titleText = `${aloc.esfera} • ${aloc.unidade}`;
        let dotClass = 'bg-teal-400 ring-4 ring-teal-500/20';
        let lineColor = '#2DD4BF';
        let lineOpacity = '0.8';

        if (isConsolidated) {
            cardStyle = 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-300/70 text-white shadow-lg shadow-emerald-900/40';
            iconBoxStyle = 'bg-white/20 text-white';
            titleText = `Consolidado: ${aloc.unidade}`;
            dotClass = 'bg-emerald-400 ring-4 ring-emerald-500/25';
            lineColor = '#10B981';
            lineOpacity = '0.9';
        } else if (isFirstConflict) {
            cardStyle = 'bg-[#26393F] border-teal-400/50 text-white shadow-md';
            iconBoxStyle = 'bg-teal-500/20 text-teal-300';
            dotClass = 'bg-rose-400 ring-4 ring-rose-500/25';
            lineColor = '#F43F5E';
            lineOpacity = '0.9';
        } else if (isConflicting) {
            dotClass = 'bg-rose-400 ring-4 ring-rose-500/20';
            lineColor = '#FB7185';
            lineOpacity = '0.82';
        }

        return `
            <div class="rnds-aloc-card relative flex items-center justify-between gap-2.5 pl-4 pr-3 py-2.5 rounded-xl border ${cardStyle} transition" data-line-color="${lineColor}" data-line-opacity="${lineOpacity}">
                <span class="rnds-card-anchor hidden sm:block absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${dotClass} border border-[#172428] z-20"></span>
                
                <div class="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
                    <div class="w-7 h-7 rounded-lg ${iconBoxStyle} flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                        <i data-lucide="${sphereIcons[aloc.esfera] || 'hospital'}" class="w-3.5 h-3.5"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="text-xs font-bold leading-snug break-words">${annotateAcronyms(titleText)}</p>
                        <p class="text-[11px] ${isConsolidated ? 'text-emerald-50' : 'text-slate-400'} mt-0.5">
                            ${aloc.dataAgendada} (${aloc.horario}) • ${annotateAcronyms(aloc.sistema)}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <!-- Identificação do Paciente + Botão Responsivo -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-full bg-[#24383F] border border-teal-400/30 flex items-center justify-center text-teal-200 font-bold text-xs shrink-0">
                    <i data-lucide="user" class="w-5 h-5"></i>
                </div>
                <div class="min-w-0">
                    <h3 class="text-sm font-bold text-white leading-tight truncate">${patient.nome}</h3>
                    <p class="text-[11px] font-mono text-slate-400 mt-0.5 truncate"><abbr data-acronym="CNS">CNS</abbr>: ${patient.cns}</p>
                </div>
            </div>
            ${actionButton}
        </div>

        ${alertBanner}

        <!-- Diagrama Visual de Fluxo (Vertical no Mobile, Horizontal com SVG dinâmico no Desktop/Tablet) -->
        <div id="rndsFlowDiagram" class="mt-3 grid grid-cols-1 sm:grid-cols-12 gap-0 sm:gap-3 items-center relative">
            <!-- Camada SVG Responsiva calculada dinamicamente a partir das âncoras reais -->
            <svg id="rndsFlowSvg" class="hidden sm:block absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible" aria-hidden="true"></svg>

            <!-- Nó de Origem (Solicitação / CNS) -->
            <div id="rndsOriginNode" class="sm:col-span-4 flex flex-row sm:flex-col items-center justify-between sm:justify-center text-left sm:text-center p-3 rounded-xl bg-[#111B1E] border border-white/10 relative z-10 gap-3 sm:gap-1">
                <span id="rndsOriginAnchor" class="hidden sm:block absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${hasConflict ? 'bg-rose-400 ring-4 ring-rose-500/25' : 'bg-emerald-400 ring-4 ring-emerald-500/25'} border border-[#111B1E] z-20"></span>
                <div class="flex items-center gap-2.5 sm:flex-col sm:gap-1.5">
                    <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full ${hasConflict ? 'bg-rose-500/20 border-rose-400/50 text-rose-300' : 'bg-teal-500/20 border-teal-400/50 text-teal-300'} border flex items-center justify-center shadow-inner shrink-0">
                        <i data-lucide="radio" class="w-4 h-4 sm:w-5 sm:h-5"></i>
                    </div>
                    <div>
                        <span class="text-[11px] font-bold text-slate-200 block"><abbr data-acronym="SIGTAP">SIGTAP</abbr> ${patient.alocacoes[0]?.codigoSigtap || ''}</span>
                        <span class="text-[10px] text-slate-400 block">${patient.municipioResidencia}</span>
                    </div>
                </div>
                <span class="sm:hidden text-[10px] font-semibold px-2 py-0.5 rounded-full ${hasConflict ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}">
                    ${patient.alocacoes.length} alocação(ões)
                </span>
            </div>

            <!-- Conector Vertical Exclusivo para Mobile (< 640px) -->
            <div class="sm:hidden flex flex-col items-center justify-center py-1">
                <div class="w-0.5 h-3 ${hasConflict ? 'bg-rose-400/70' : 'bg-emerald-400/70'}"></div>
                <i data-lucide="arrow-down" class="w-3.5 h-3.5 ${hasConflict ? 'text-rose-400' : 'text-emerald-400'} -my-0.5"></i>
            </div>

            <!-- Espaçador Horizontal para as Curvas SVG (>= 640px) -->
            <div class="hidden sm:block sm:col-span-1" aria-hidden="true"></div>

            <!-- Lista de Esferas Conectadas -->
            <div class="sm:col-span-7 space-y-2.5 relative z-10">
                ${stackedNodesHtml}
            </div>
        </div>
    `;
    lucide.createIcons();
    observeRndsFlowDiagram();
    scheduleRndsFlowLinesUpdate();
}

function resolveDuplicateAllocations(cns, codigoSigtap) {
    const patient = state.patientJourneys.find(p => p.cns === cns);
    if (!patient) return;

    let keptFirst = false;
    let removedCount = 0;

    patient.alocacoes = patient.alocacoes.filter(aloc => {
        if (aloc.codigoSigtap === codigoSigtap) {
            if (!keptFirst) {
                keptFirst = true;
                aloc.status = 'Agendamento Consolidado';
                return true;
            }
            removedCount++;
            return false;
        }
        return true;
    });

    renderPatientTracking(cns);
    showToast(`${removedCount} vaga(s) duplicada(s) liberada(s) para a fila do SUS!`, 'success');
}

// =========================================================================
// 5. FILTRAGEM UNIFICADA, KPIS, TABELA + CARDS MOBILE E EXPORTAÇÃO
// =========================================================================
function applyFilters() {
    const regiao = document.getElementById('filterRegiao').value;
    const uf = document.getElementById('filterEstado').value;
    const municipio = document.getElementById('filterMunicipio').value;
    const fonte = document.getElementById('filterFonte').value;
    const search = document.getElementById('tableSearch').value.toLowerCase().trim();

    // Atualiza badge indicador de filtros ativos no mobile
    const activeCount = [regiao !== 'BR', uf !== 'ALL', municipio !== 'ALL', fonte !== 'ALL'].filter(Boolean).length;
    const badge = document.getElementById('activeFiltersBadge');
    if (badge) {
        if (activeCount > 0) {
            badge.textContent = `${activeCount} ativo${activeCount > 1 ? 's' : ''}`;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    const allUnified = [...state.uploadedRecords, ...state.apiRecords];

    state.filteredRecords = allUnified.filter(item => {
        if (regiao !== 'BR' && item.regiao !== regiao && item.regiao !== 'Nacional') return false;
        if (uf !== 'ALL' && item.uf !== uf) return false;
        if (municipio !== 'ALL' && item.municipio.toLowerCase() !== municipio.toLowerCase()) return false;
        if (fonte !== 'ALL' && item.fonte !== fonte) return false;
        if (search) {
            const matchText = `${item.esfera} ${item.regiao} ${item.uf} ${item.municipio} ${item.unidade}`.toLowerCase();
            if (!matchText.includes(search)) return false;
        }
        return true;
    });

    state.currentPage = 1;
    updateKPIs();
    updateCharts();
    renderTable();
}

function resetFilters() {
    document.getElementById('filterRegiao').value = 'BR';
    document.getElementById('filterEstado').value = 'ALL';
    document.getElementById('filterFonte').value = 'ALL';
    document.getElementById('tableSearch').value = '';
    handleEstadoChange();
}

function updateKPIs() {
    const data = state.filteredRecords;
    const totalEst = data.reduce((acc, cur) => acc + cur.estabelecimentos, 0);
    const totalLeitos = data.reduce((acc, cur) => acc + cur.leitos, 0);
    const totalAtend = data.reduce((acc, cur) => acc + cur.atendimentos, 0);
    const totalRepasse = data.reduce((acc, cur) => acc + cur.repasse, 0);

    document.getElementById('kpiEstabelecimentos').textContent = totalEst.toLocaleString('pt-BR');
    document.getElementById('kpiLeitos').textContent = totalLeitos.toLocaleString('pt-BR');
    document.getElementById('kpiAtendimentos').textContent = formatCompactNumber(totalAtend);
    document.getElementById('kpiInvestimento').textContent = formatCurrencyCompact(totalRepasse);

    const ocupacao = totalLeitos > 0 ? Math.min(96, Math.max(68, Math.round((totalAtend / (totalLeitos * 55)) * 100))) : 0;
    document.getElementById('kpiOcupacao').textContent = `${ocupacao}% ocup.`;

    const factor = Math.max(0.4, Math.min(1.4, data.length / 10));
    state.charts.sparklines.forEach((chart, idx) => {
        const baseSeries = [
            [18, 26, 22, 34, 29, 41, 38, 49],
            [32, 28, 35, 31, 44, 40, 48, 52],
            [20, 29, 25, 38, 34, 46, 43, 55],
            [24, 21, 30, 28, 39, 45, 42, 54]
        ][idx];
        chart.data.datasets[0].data = baseSeries.map(v => Math.round(v * factor));
        chart.update('none');
    });
}

function renderTable() {
    const tbody = document.getElementById('unifiedTableBody');
    const mobileList = document.getElementById('unifiedTableMobileList');
    const total = state.filteredRecords.length;
    document.getElementById('tableCountBadge').textContent = `${total} ${total === 1 ? 'registro' : 'registros'}`;

    if (total === 0) {
        const emptyMsg = `Nenhum dado encontrado para os filtros selecionados. Na base sintética demonstrativa estão cadastrados apenas polos e capitais selecionados; limpe os filtros ou importe uma planilha municipal.`;
        tbody.innerHTML = `<tr><td colspan="7" class="py-8 px-4 text-center text-slate-500">${emptyMsg}</td></tr>`;
        mobileList.innerHTML = `<div class="p-6 text-center text-xs text-slate-500">${emptyMsg}</div>`;
        document.getElementById('paginationInfo').textContent = 'Mostrando 0 de 0 registros';
        document.getElementById('btnPrevPage').disabled = true;
        document.getElementById('btnNextPage').disabled = true;
        return;
    }

    const start = (state.currentPage - 1) * state.rowsPerPage;
    const end = Math.min(start + state.rowsPerPage, total);
    const pageItems = state.filteredRecords.slice(start, end);

    // 1. Renderização Desktop (Tabela)
    tbody.innerHTML = pageItems.map(item => {
        let badgeClass = 'bg-cyan-500/15 text-cyan-900 border-cyan-500/30';
        let fonteLabel = 'Sintético Federal';
        if (item.fonte === 'API_ESTADUAL') {
            badgeClass = 'bg-teal-500/15 text-teal-900 border-teal-500/30';
            fonteLabel = 'Sintético Estadual';
        } else if (item.fonte === 'UPLOAD_LOCAL') {
            badgeClass = 'bg-amber-500/15 text-amber-900 border-amber-500/30';
            fonteLabel = 'Upload Local';
        }

        return `
            <tr class="hover:bg-white/70 transition">
                <td class="py-2.5 px-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}">
                        ${item.esfera} • ${fonteLabel}
                    </span>
                </td>
                <td class="py-2.5 px-4 whitespace-nowrap text-slate-600">
                    <span class="font-bold text-slate-800">${item.uf}</span> <span class="text-[11px] text-slate-400">(${item.regiao})</span>
                </td>
                <td class="py-2.5 px-4 font-semibold text-slate-800">${item.municipio}</td>
                <td class="py-2.5 px-4 text-slate-600 max-w-xs truncate" title="${item.unidade}">${annotateAcronyms(item.unidade)}</td>
                <td class="py-2.5 px-4 text-right font-medium text-slate-700">${item.leitos.toLocaleString('pt-BR')}</td>
                <td class="py-2.5 px-4 text-right font-medium text-slate-700">${item.atendimentos.toLocaleString('pt-BR')}</td>
                <td class="py-2.5 px-4 text-right font-bold text-[#075966]">${item.repasse.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</td>
            </tr>
        `;
    }).join('');

    // 2. Renderização Mobile (Cards estruturados sem rolagem horizontal)
    mobileList.innerHTML = pageItems.map(item => {
        let badgeClass = 'bg-cyan-500/15 text-cyan-900 border-cyan-500/30';
        let fonteLabel = 'Sintético Fed.';
        if (item.fonte === 'API_ESTADUAL') {
            badgeClass = 'bg-teal-500/15 text-teal-900 border-teal-500/30';
            fonteLabel = 'Sintético Est.';
        } else if (item.fonte === 'UPLOAD_LOCAL') {
            badgeClass = 'bg-amber-500/15 text-amber-900 border-amber-500/30';
            fonteLabel = 'Upload CSV';
        }

        return `
            <div class="p-3.5 space-y-2.5 bg-white/40 hover:bg-white/75 transition">
                <div class="flex items-center justify-between gap-2">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}">
                        ${item.esfera} • ${fonteLabel}
                    </span>
                    <span class="text-[11px] font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/70">
                        ${item.uf} • ${item.regiao}
                    </span>
                </div>
                <div>
                    <h4 class="text-xs font-extrabold text-slate-800">${item.municipio}</h4>
                    <p class="text-[11px] text-slate-600 leading-snug mt-0.5">${annotateAcronyms(item.unidade)}</p>
                </div>
                <div class="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-center">
                    <div class="bg-white/70 rounded-lg p-1.5">
                        <span class="block text-[9px] uppercase font-semibold text-slate-400">Leitos</span>
                        <span class="text-xs font-bold text-slate-800 tabular-nums">${item.leitos.toLocaleString('pt-BR')}</span>
                    </div>
                    <div class="bg-white/70 rounded-lg p-1.5">
                        <span class="block text-[9px] uppercase font-semibold text-slate-400">Atendim.</span>
                        <span class="text-xs font-bold text-slate-800 tabular-nums">${formatCompactNumber(item.atendimentos)}</span>
                    </div>
                    <div class="bg-teal-500/10 rounded-lg p-1.5">
                        <span class="block text-[9px] uppercase font-semibold text-teal-700">Repasse</span>
                        <span class="text-xs font-extrabold text-[#075966] tabular-nums">${formatCurrencyCompact(item.repasse)}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('paginationInfo').textContent = `Mostrando ${start + 1} a ${end} de ${total} registros`;
    document.getElementById('btnPrevPage').disabled = state.currentPage === 1;
    document.getElementById('btnNextPage').disabled = end >= total;
}

function changePage(delta) {
    state.currentPage += delta;
    renderTable();
}

function exportUnifiedCSV() {
    if (state.filteredRecords.length === 0) {
        showToast('Não há dados filtrados para exportar.', 'warning');
        return;
    }
    const csv = Papa.unparse(state.filteredRecords.map(({ id, ...rest }) => rest));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sus_datahub_unificado_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Base unificada exportada em CSV!', 'success');
}

// =========================================================================
// 6. GRÁFICOS INTERATIVOS E SPARKLINES (CHART.JS)
// =========================================================================
function initSparklines() {
    const ids = ['sparkline1', 'sparkline2', 'sparkline3', 'sparkline4'];
    const seriesData = [
        [18, 26, 22, 34, 29, 41, 38, 49],
        [32, 28, 35, 31, 44, 40, 48, 52],
        [20, 29, 25, 38, 34, 46, 43, 55],
        [24, 21, 30, 28, 39, 45, 42, 54]
    ];

    state.charts.sparklines = ids.map((id, i) => {
        const canvas = document.getElementById(id);
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 40);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.28)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
                datasets: [{
                    data: seriesData[i],
                    borderColor: '#10B981',
                    borderWidth: 2,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 2,
                    pointBackgroundColor: '#0D9488',
                    pointBorderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: {
                    x: { display: false },
                    y: { display: false, min: 0 }
                }
            }
        });
    });
}

function initCharts() {
    const ctxBar = document.getElementById('mainBarChart').getContext('2d');
    state.charts.bar = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Atend. (mil)',
                    data: [],
                    backgroundColor: '#0D7A83',
                    borderRadius: 4,
                    barPercentage: 0.72
                },
                {
                    label: 'Leitos (x15)',
                    data: [],
                    backgroundColor: '#22B8CF',
                    borderRadius: 4,
                    barPercentage: 0.72
                },
                {
                    label: 'Repasse (Mi)',
                    data: [],
                    backgroundColor: '#F59E0B',
                    borderRadius: 4,
                    barPercentage: 0.72
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { usePointStyle: true, boxWidth: 6, padding: 10, font: { family: 'Inter', size: 10 } }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(148, 163, 184, 0.18)', borderDash: [3, 3] },
                    ticks: { font: { size: 10 }, color: '#64748B' }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 10 }, color: '#475569' }
                }
            }
        }
    });

    const ctxDoughnut = document.getElementById('sphereDoughnutChart').getContext('2d');
    state.charts.doughnut = new Chart(ctxDoughnut, {
        type: 'doughnut',
        data: {
            labels: ['Federal', 'Estadual', 'Municipal'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#0D7A83', '#38BDF8', '#F59E0B'],
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.85)',
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '62%',
            plugins: { legend: { display: false } }
        }
    });
}

function updateCharts() {
    const data = state.filteredRecords;

    const grouped = {};
    data.forEach(item => {
        const key = item.uf === 'BR' ? 'Nac.' : `${item.uf}`;
        if (!grouped[key]) grouped[key] = { atend: 0, leitos: 0, repasse: 0 };
        grouped[key].atend += item.atendimentos;
        grouped[key].leitos += item.leitos;
        grouped[key].repasse += item.repasse;
    });

    const sortedEntries = Object.entries(grouped)
        .sort((a, b) => b[1].atend - a[1].atend)
        .slice(0, 6);

    state.charts.bar.data.labels = sortedEntries.map(e => e[0]);
    state.charts.bar.data.datasets[0].data = sortedEntries.map(e => Math.round(e[1].atend / 1000));
    state.charts.bar.data.datasets[1].data = sortedEntries.map(e => Math.round(e[1].leitos / 15));
    state.charts.bar.data.datasets[2].data = sortedEntries.map(e => Math.round(e[1].repasse / 1000000));
    state.charts.bar.update();

    let fed = 0, est = 0, mun = 0;
    data.forEach(item => {
        const esf = item.esfera.toLowerCase();
        if (esf.includes('fed')) fed += item.atendimentos;
        else if (esf.includes('est')) est += item.atendimentos;
        else mun += item.atendimentos;
    });

    const total = fed + est + mun;
    state.charts.doughnut.data.datasets[0].data = [fed, est, mun];
    state.charts.doughnut.update();

    document.getElementById('pctFederal').textContent = total ? `${Math.round((fed / total) * 100)}%` : '0%';
    document.getElementById('pctEstadual').textContent = total ? `${Math.round((est / total) * 100)}%` : '0%';
    document.getElementById('pctMunicipal').textContent = total ? `${Math.round((mun / total) * 100)}%` : '0%';
}

// =========================================================================
// 7. UTILITÁRIOS DE FORMATAÇÃO E NOTIFICAÇÃO (TOAST)
// =========================================================================
function formatCompactNumber(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(1).replace('.', ',') + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1).replace('.', ',') + ' mil';
    return num.toLocaleString('pt-BR');
}

function formatCurrencyCompact(val) {
    if (val >= 1e9) return 'R$ ' + (val / 1e9).toFixed(2).replace('.', ',') + 'B';
    if (val >= 1e6) return 'R$ ' + (val / 1e6).toFixed(1).replace('.', ',') + 'M';
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const colors = {
        success: 'bg-[#172428] text-emerald-200 border-emerald-500/40',
        warning: 'bg-[#172428] text-amber-200 border-amber-500/40',
        error: 'bg-[#172428] text-rose-200 border-rose-500/40',
        info: 'bg-[#172428] text-white border-white/15'
    };

    const toast = document.createElement('div');
    toast.className = `${colors[type]} border backdrop-blur-md px-4 py-3 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2.5 pointer-events-auto transition-all duration-300 transform translate-y-2 opacity-0`;
    toast.innerHTML = `<span class="w-2 h-2 rounded-full bg-teal-400 shrink-0"></span><span>${message}</span>`;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.remove('translate-y-2', 'opacity-0'));

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3400);
}
