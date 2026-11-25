# SUS DataHub — Gestão Integrada e Interoperabilidade do SUS

> **Plataforma web de inteligência e interoperabilidade em saúde pública que unifica dados federais, estaduais e municipais do SUS e rastreia a jornada longitudinal dos pacientes para eliminar filas e agendamentos duplicados.**

🔗 **Acesse o Protótipo Funcional:** [https://saude-mais-inteligente.github.io/SUS-DataHub/](https://saude-mais-inteligente.github.io/SUS-DataHub/)

---

## Sobre o Projeto

O [**SUS DataHub**](https://saude-mais-inteligente.github.io/SUS-DataHub/) é uma plataforma web responsiva de gestão integrada para o Sistema Único de Saúde (SUS) projetada para consolidar dados públicos governamentais com planilhas locais (`.CSV` e `.JSON`) enviadas por secretarias de saúde e unidades assistenciais.

O sistema oferece:
* **Filtragem territorial hierárquica em tempo real** (Região Federal, Estado/UF e Município via API do IBGE) combinada com o filtro **Fonte de Dados** e busca textual livre;
* **Painel de 4 Indicadores-Chave de Desempenho (KPIs)** com mini-gráficos (*sparklines*): Estabelecimentos CNES, Leitos SUS Cadastrados (com taxa estimada de ocupação), Procedimentos (SIA/SIH) e Repasses Financeiros (FNS);
* **Gráficos interativos** (barras agrupadas por localidade/esfera e rosca de distribuição proporcional por esfera de gestão);
* **Ingestão local client-side** (arrastar e soltar, modal dedicado, download de planilha modelo e simulação rápida) e **base unificada paginada** (tabela no desktop e cards sem rolagem horizontal no mobile) com **exportação em `.CSV`**;
* **Dicionário interativo de siglas** (`ACRONYM_DICTIONARY`) com *tooltips* flutuantes acessíveis por mouse e foco de teclado sobre 33 siglas técnicas do SUS;
* **Módulo de Rastreio Longitudinal do Paciente (CNS / RNDS)** com detecção automática de agendamentos duplicados entre as esferas Municipal, Estadual e Federal, diagrama visual responsivo com curvas Bézier dinâmicas e consolidação de vaga única em um clique.

---

## Origem e Desenvolvimento Colaborativo

A concepção do projeto nasceu de forma colaborativa a partir da experiência multidisciplinar de **todas as integrantes do time (Equipe CattleIA)**, unindo conhecimentos em saúde pública, engenharia biomédica, ciência de dados, epidemiologia computacional, gestão de projetos e design de experiência do usuário (UX/UI).

Para transformar a idealização em um protótipo funcional, ágil e responsivo em tempo recorde, utilizamos a **Inteligência Artificial do Google Gemini** como copiloto de engenharia de software na geração, refatoração e modularização da arquitetura front-end (`HTML5`, `CSS3` e `JavaScript`).

---

## Justificativa e Problema Resolvido

O **SUS DataHub** ataca diretamente dois gargalos estruturais da gestão pública de saúde no Brasil: a **fragmentação de dados entre as três esferas de governo** (Municipal, Estadual e Federal) e a **duplicidade de solicitações nas filas de regulação**.

Atualmente, um mesmo cidadão pode ter um procedimento ou exame solicitado simultaneamente em sistemas distintos de regulação (como SISREG municipal, centrais estaduais SER/CROSS e e-SUS Regulação na esfera federal). Isso provoca:
1. **Subutilização de vagas e absenteísmo aparente**, pois o paciente realiza o procedimento em uma esfera enquanto as vagas reservadas nas demais permanecem bloqueadas;
2. **Aumento artificial do tempo de espera** nas filas do SUS para outros usuários;
3. **Visão fragmentada para os gestores**, que precisam cruzar manualmente bases federais (DataSUS/FNS) com planilhas locais das secretarias municipais para tomar decisões orçamentárias e assistenciais.

### Como o SUS DataHub Atua:
* **Consolidação Multi-Esfera:** Integra dados de infraestrutura e produção assistencial das esferas federal e estadual com planilhas locais importadas via navegador em uma única visão territorial.
* **Rastreio Longitudinal do Paciente (CNS / RNDS):** Monitora alocações por meio do Cartão Nacional de Saúde (CNS) e do código do procedimento (SIGTAP), identificando automaticamente quando há sobreposição entre esferas distintas e permitindo a **consolidação da vaga única** com liberação imediata das vagas excedentes.
* **Painel Executivo e Territorial:** Permite filtrar indicadores por Região Federal, Estado (UF), Município, Fonte de Dados e busca textual livre, contando com explicações instantâneas (*tooltips*) ao passar o mouse ou focar via teclado qualquer sigla técnica do SUS.

---

## Funcionamento do Filtro "Fonte de Dados"

O seletor **Fonte de Dados** (`#filterFonte` em `index.html`, processado por `applyFilters()` em `script.js`) permite ao gestor alternar entre a visão consolidada de toda a rede e recortes isolados por origem da informação. Sempre que uma opção é selecionada, o sistema recalcula instantaneamente os **4 KPIs e seus *sparklines***, o **gráfico de barras**, o **gráfico de rosca por esfera**, a **base tabular/cards mobile** (reiniciando a paginação para a página 1) e o **escopo de exportação `.CSV`**.

Abaixo está o comportamento exato de cada uma das 4 opções disponíveis no menu:

| Opção Exibida no Filtro | Valor Interno (`value`) | O Que Acontece Quando Acionada |
| :--- | :--- | :--- |
| **Esfera de Gestão (Unificado)** *(Padrão)* | `ALL` | **Não aplica restrição de origem.** Combina em uma única visão todos os registros carregados em memória (`[...state.uploadedRecords, ...state.apiRecords]`): os **5 registros** da base sintética federal, os **8 registros** da base sintética estadual e todos os **arquivos locais importados** pelo usuário (que aparecem no topo da lista). Os KPIs somam toda a rede filtrada, o gráfico de barras ranqueia as até 6 maiores localidades/UFs por volume de atendimentos e o gráfico de rosca exibe a proporção combinada entre **Federal, Estadual e Municipal**. |
| **Base Sintética DataSUS / OpenDataSUS** | `API_FEDERAL` | **Isola exclusivamente a esfera federal simulada** (`fonte === 'API_FEDERAL'`). Mantém apenas os 5 registros sintéticos que representam polos federais (EBSERH/Nacional, Campinas/SP, Rede Federal RJ, Recife/PE e Manaus/AM). Os KPIs passam a somar apenas esses polos, a tabela exibe somente registros com o selo ciano `Federal • Sintético Federal` e o gráfico de rosca passa a indicar **100% Federal** (0% Estadual e 0% Municipal). |
| **Base Sintética Secretaria Estadual (SES)** | `API_ESTADUAL` | **Isola exclusivamente a rede estadual simulada** (`fonte === 'API_ESTADUAL'`). Mantém apenas os 8 registros sintéticos de secretarias estaduais (SES-SP, SES-RJ, SES-MG/FHEMIG, SESAB/BA, SES-RS, SESA-PR, SESPA/PA e SES-GO). Todos os indicadores, o gráfico de barras e a tabela são recalculados sobre a gestão estadual (selo verde-azulado `Estadual • Sintético Estadual`) e o gráfico de rosca exibe **100% Estadual** (0% Federal e 0% Municipal). |
| **Arquivos Importados (CSV/JSON)** | `UPLOAD_LOCAL` | **Isola exclusivamente os registros enviados pelo usuário** (`fonte === 'UPLOAD_LOCAL'`), sejam provenientes de upload de arquivos `.CSV`/`.JSON` ou do botão **"+ Simular Upload Municipal"**. <br>• **Antes de importar qualquer arquivo:** a consulta retorna `0 registros`, os KPIs são zerados (`0`, `0% ocup.`, `R$ 0`), os gráficos esvaziam (0% nas três esferas), a paginação é desabilitada e a base exibe uma mensagem orientando a limpar os filtros ou importar uma planilha municipal.<br>• **Após importar ou simular upload:** exibe apenas os dados normalizados locais (selo âmbar `Upload Local` / `Upload CSV`), permitindo auditar os números importados isoladamente antes de analisá-los em conjunto com as bases governamentais. |

### Interação com os Demais Controles do Painel
* **Filtragem Combinada (E / AND):** O filtro **Fonte de Dados** opera em conjunto com **Região Federal**, **Estado (UF)**, **Município** e o campo de **busca textual** da base unificada (`#tableSearch`). Exemplo: selecionar `Estado = RJ` + `Fonte de Dados = Base Sintética DataSUS / OpenDataSUS` retorna apenas o registro da Rede Federal RJ.
* **Indicador Mobile & Redefinição:** Em telas menores (`< 1024px`), escolher qualquer opção diferente de `Esfera de Gestão (Unificado)` contabiliza automaticamente no selo `#activeFiltersBadge` do painel retrátil de filtros. O botão **Limpar** (`resetFilters()`) restaura o seletor para `ALL` junto aos filtros territoriais.
* **Exportação Fiel ao Recorte:** Os botões **Exportar Relatório** e **Exportar Dados Unificados (CSV)** (`exportUnifiedCSV()`) exportam exatamente o subconjunto ativo em `state.filteredRecords`. Caso a combinação escolhida resulte em 0 registros, um alerta (*toast*) informa que não há dados filtrados para exportação.

---

## Transparência de Dados: O Que É Real vs. O Que É Sintético no Protótipo

Para garantir rigor técnico e transparência sobre o estágio atual do protótipo publicado em [https://saude-mais-inteligente.github.io/SUS-DataHub/](https://saude-mais-inteligente.github.io/SUS-DataHub/), a tabela abaixo detalha exatamente quais componentes operam com **dados reais** e quais utilizam **dados sintéticos (mockados)** em `script.js`:

| Módulo / Funcionalidade | Tipo de Dado | Implementação Atual (`script.js` / `index.html`) | Detalhamento Técnico |
| :--- | :--- | :--- | :--- |
| **Filtro de Estados (UFs) e Regiões** | **Real (Tempo Real)** | `loadIBGEStates()` via `fetch()` | Consome ao vivo a API oficial de Localidades do IBGE. |
| **Filtro de Municípios por UF** | **Real (Tempo Real)** | `handleEstadoChange()` via `fetch()` | Carrega dinamicamente todos os municípios da UF selecionada diretamente da API do IBGE. |
| **Upload de Planilhas (`.CSV` / `.JSON`)** | **Real (Client-Side)** | `processUploadedFile()` + `ingestNormalizedData()` | Lê, normaliza cabeçalhos (remove acentos/padroniza chaves como `cidade`/`municipio`, `estado`/`uf`, `valor`/`repasse`) e funde arquivos reais enviados pelo usuário usando `PapaParse` e `FileReader`. |
| **Exportação da Base Unificada (`.CSV`)** | **Real (Dinâmico)** | `exportUnifiedCSV()` | Gera e baixa um arquivo `.CSV` real contendo exatamente o cruzamento dos dados filtrados no momento. |
| **Indicadores DataSUS / CNES / SIA-SIH / FNS** | **Sintético (Simulado)** | `syncApis()` (`state.apiRecords`) | Simula latência de rede (`setTimeout` de 400ms) e carrega 13 registros estruturados (5 federais `API_FEDERAL` e 8 estaduais `API_ESTADUAL`) representando polos de referência (EBSERH, SES-SP, SES-RJ, FHEMIG, SESAB, etc.). |
| **Rastreio Longitudinal (CNS / RNDS)** | **Sintético (Simulado)** | `initPatientJourneys()` (`state.patientJourneys`) | Utiliza 3 jornadas fictícias de pacientes (*Maria Helena S.* em 3 esferas, *Carlos Eduardo M.* em 2 esferas e *Ana Beatriz R.* em fluxo regular) para demonstrar o motor real de detecção de sobreposição (`detectMultiSphereOverlap`) e resolução (`resolveDuplicateAllocations`). |
| **Botão "+ Simular Upload Municipal"** | **Sintético (Demonstração)** | `injectSampleUpload()` e `downloadSampleCSV()` | Injeta 3 registros municipais fictícios (Duque de Caxias/RJ, Santos/SP e Feira de Santana/BA) ou gera planilha modelo `.CSV` para testes rápidos sem necessidade de arquivo externo. |
| **Taxa de Ocupação e Sparklines dos KPIs** | **Sintético / Heurístico** | `updateKPIs()` e `initSparklines()` | A taxa de ocupação de leitos é estimada por fórmula heurística baseada na razão `atendimentos / (leitos * 55)` (limitada entre 68% e 96%), e os 4 mini-gráficos (*sparklines*) escalam séries-base fixas conforme o volume de registros filtrados. |

---

## APIs Utilizadas e Links Oficiais

### 1. APIs Reais Ativas no Protótipo (Consumo Direto via Front-end)
* **IBGE — Listagem de Estados (UFs) ordenados por nome:**
  `https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`
* **IBGE — Listagem de Municípios por UF ordenados por nome:**
  `https://servicodados.ibge.gov.br/api/v1/localidades/estados/{uf}/municipios?orderBy=nome`

### 2. Bibliotecas Externas (CDNs utilizadas em `index.html`)
* **Tailwind CSS:** `https://cdn.tailwindcss.com`
* **Chart.js:** `https://cdn.jsdelivr.net/npm/chart.js`
* **PapaParse (Parser CSV):** `https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js`
* **Lucide Icons:** `https://unpkg.com/lucide@latest`
* **Google Fonts (Inter):** `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap`

### 3. Portais e Barramentos Governamentais-Alvo para Integração em Produção
* **OpenDataSUS (Ministério da Saúde):** `https://opendatasus.saude.gov.br/`
* **DataSUS / Transferência de Arquivos (CNES, SIA, SIH):** `https://datasus.saude.gov.br/transferencia-de-arquivos/`
* **RNDS (Rede Nacional de Dados em Saúde — Padrão HL7 FHIR):** `https://rnds-guia.saude.gov.br/`

---

## Arquitetura e Escolhas Técnicas

```text
sus-datahub/
├── index.html   # Estrutura semântica, Bento Grid, filtros, modais, tooltips de siglas e navegação responsiva
├── style.css    # Glassmorphism/Soft UI (.frosted-card), tema escuro RNDS (.dark-rnds-card), animações (.eq-bar) e siglas
├── script.js    # Estado global, API IBGE, filtros, normalização CSV/JSON, motor RNDS + SVG dinâmico, Chart.js e exportação
└── README.md    # Documentação técnica, transparência de dados, guia de filtros e roadmap
```

1. **Arquitetura Front-end Pura (`HTML5` + `Tailwind CDN` + `Vanilla JS`):**
   * **Por quê:** Eliminou a necessidade de pipelines de build complexos (Webpack/Vite) e servidores dedicados durante a fase de prototipagem, permitindo hospedagem gratuita, instantânea e auditável via **GitHub Pages**.
2. **Ingestão Local Client-Side com `PapaParse` e Normalização Automática:**
   * **Por quê:** Secretarias municipais frequentemente operam com planilhas heterogêneas (colunas com acentos, maiúsculas/minúsculas variadas ou nomes alternativos como `cidade`/`municipio`, `estado`/`uf`, `estabelecimento`/`unidade`, `valor`/`repasse`). A função `ingestNormalizedData()` padroniza essas chaves em tempo real no navegador, sem exigir que o gestor reformate sua planilha antes do upload.
3. **Contraste Visual Deliberado (Soft UI Claro vs. Módulo RNDS Escuro):**
   * **Por quê:** O painel gerencial usa cartões translúcidos claros (`.frosted-card`) para leitura confortável de grandes volumes numéricos, enquanto o módulo de **Rastreio Longitudinal (CNS/RNDS)** usa tema escuro (`.dark-rnds-card`) para atrair imediatamente o foco do regulador para alertas críticos de sobreposição de vagas.
4. **Diagrama de Fluxo RNDS com Curvas SVG Calculadas Dinamicamente (`ResizeObserver`):**
   * **Por quê:** Em telas desktop/tablet (`>= 640px`), as linhas que ramificam do nó de origem (`#rndsOriginAnchor`) até cada card de alocação (`.rnds-card-anchor`) são traçadas em tempo real por `updateRndsFlowLines()` via `getBoundingClientRect()` e curvas Bézier cúbicas dentro de `#rndsFlowSvg`. Monitoradas por `ResizeObserver` (`observeRndsFlowDiagram()`), `window.resize` e `document.fonts.ready`, as ramificações permanecem alinhadas com precisão absoluta ao centro da borda de cada card — independentemente da quantidade de vagas (1, 2, 3 ou mais), do tamanho da tela ou de quebras de linha no texto. Abaixo de `640px`, o diagrama alterna automaticamente para um conector vertical compacto.
5. **Dicionário Interativo de Siglas (`ACRONYM_DICTIONARY` + Tooltips Acessíveis):**
   * **Por quê:** A gestão do SUS envolve dezenas de siglas técnicas (`CNES`, `SIA`, `SIH`, `FNS`, `CNS`, `RNDS`, `SISREG`, `SER`, `SIGTAP`, `CROSS`, `SIGA`, `EBSERH`, entre outras — 33 termos mapeados). As funções `annotateAcronyms()` e `initAcronymTooltips()` exibem um *tooltip* flutuante (`#acronymTooltip`) tanto ao passar o mouse (`mouseover`/`mouseout`) quanto na navegação por teclado (`focusin`/`focusout`), com `aria-label` preenchido automaticamente.
6. **Responsividade Mobile-First Real (Adaptação Estrutural, Não Apenas Redimensionamento):**
   * **Por quê:** Gestores e auditores consultam indicadores em tablets e smartphones. Em telas `< 1024px`, os filtros recolhem em um painel retrátil com selo de filtros ativos (`toggleMobileFilters()`); em `< 768px`, a tabela unificada (8 registros por página) é substituída por cartões estruturados (`#unifiedTableMobileList`) para eliminar rolagem horizontal; e em `< 640px`, a barra lateral esquerda converte-se em uma *Bottom Navigation Bar* fixa com botão central flutuante de importação.
7. **Uso de Dados Sintéticos para DataSUS e RNDS nesta Etapa:**
   * **Por quê:** Bases reais da RNDS contêm dados pessoais sensíveis protegidos pela **LGPD** e exigem autenticação mútua por certificado digital (ICP-Brasil / OAuth2) via back-end, além de bloqueios de **CORS** em endpoints governamentais que impedem chamadas diretas via navegador. Os dados sintéticos permitiram validar toda a lógica de negócio (detecção de conflitos por código SIGTAP e consolidação de vagas) com segurança jurídica e técnica.

---

## Propostas Futuras e Roadmap de Continuidade

Para evoluir o **SUS DataHub** de um protótipo front-end validado para uma plataforma produtiva de inteligência em saúde pública, o roadmap divide-se em três frentes estratégicas:

### Fase 1 — Engenharia de Dados, Back-end e Governança (LGPD)
* **Pipeline ETL Automatizado:** Desenvolvimento de back-end em **Python (FastAPI)** com ingestão agendada de arquivos `.dbc` do DataSUS (via biblioteca `PySUS`) e APIs do OpenDataSUS, armazenando dados tratados em banco analítico (PostgreSQL + TimescaleDB ou DuckDB).
* **Integração Real ao Barramento RNDS (HL7 FHIR):** Implementação de camada segura de interoperabilidade com centrais de regulação (SISREG, SER, CROSS, SIGA) respeitando a **LGPD**, com mascaramento de dados (PII), controle de acesso baseado em papéis (RBAC) e trilha de auditoria de quem consolidou ou liberou cada vaga.
* **Chaveamento Padronizado:** Vinculação obrigatória de todos os registros ao código IBGE de 7 dígitos, código CNES do estabelecimento e código SIGTAP do procedimento.

### Fase 2 — Inteligência Artificial Preditiva e Prescritiva
Sair da análise descritiva e de regras determinísticas para modelos de Aprendizado de Máquina aplicados à gestão do SUS:

| Aplicação no SUS DataHub | Algoritmo / Arquitetura Recomendada | Justificativa Técnica |
| :--- | :--- | :--- |
| **Predição de Risco de Absenteísmo (*No-Show*) e Gargalos de Fila** | **LightGBM / XGBoost** *(Gradient Boosted Decision Trees)* | Dados tabulares do SUS (CNES, SIA/SIH, SISREG) possuem alta dimensionalidade, variáveis categóricas (CID, SIGTAP, município) e valores ausentes. Modelos de *Gradient Boosting* oferecem estado da arte em dados tabulares, baixo custo de inferência e alta interpretabilidade via **SHAP Values** (essencial para auditoria pública). |
| **Deduplicação Inteligente de Pacientes (*Record Linkage*)** | **Fellegi-Sunter Probabilístico + Embeddings de Texto (Sentence-BERT / Levenshtein)** | No cenário real do SUS, um mesmo cidadão pode possuir múltiplos cartões CNS provisórios ou erros gráficos no nome/nome da mãe. A combinação de distância fonética/lexical com *embeddings* semânticos permite calcular a probabilidade de unicidade sem depender apenas de chave exata. |
| **Previsão de Ocupação de Leitos e Sazonalidade Epidemiológica** | **Temporal Fusion Transformer (TFT) ou Prophet** | Captura múltiplas sazonalidades (surtos respiratórios, arboviroses, feriados) combinadas com covariáveis externas (dados climáticos e demográficos do IBGE) para recomendar o remanejamento preventivo de repasses e leitos. |

### Fase 3 — Experiência do Gestor e Escala Nacional
* **Agente Copiloto Conversacional para Gestores:** Interface em linguagem natural (LLM com *Text-to-SQL* / RAG sobre a base consolidada) permitindo consultas rápidas como *"Quais municípios do RJ têm maior sobreposição de ultrassonografia nos últimos 30 dias?"*.
* **Alertas Proativos:** Envio automático de notificações para centrais de regulação quando a fila de um procedimento ultrapassar o tempo máximo clínico recomendado ou quando houver alta taxa de duplicidade em uma região de saúde.

---

## Time Idealizador

* **Aline Barreto Mendes** — [LinkedIn](https://www.linkedin.com/in/alinebarretomendes/)
* **Anna Patricia Pachas Manrique** — [LinkedIn](https://www.linkedin.com/in/anna-patricia-pachas-manrique-414806ab/)
* **Jéssica de Andrade Gomes** — [LinkedIn](https://www.linkedin.com/in/jessicadeandrade27/)
* **Marina Micas Jardim** — [LinkedIn](https://www.linkedin.com/in/marinamicas/)