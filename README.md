# SUS DataHub — Gestão Integrada e Interoperabilidade do SUS

> **Plataforma web de inteligência e interoperabilidade em saúde pública que unifica dados federais, estaduais e municipais do SUS e rastreia a jornada longitudinal dos pacientes para eliminar filas e agendamentos duplicados.**

---

## Sobre o Projeto

O [**SUS DataHub**](https://saude-mais-inteligente.github.io/SUS-DataHub/) é uma plataforma web responsiva de gestão integrada para o Sistema Único de Saúde que consolida dados públicos provenientes de APIs governamentais (IBGE e DataSUS/OpenDataSUS) com planilhas locais (CSV e JSON). 

O sistema oferece filtragem territorial por região, estado e município, exibe indicadores-chave de desempenho (estabelecimentos CNES, leitos, procedimentos SIA/SIH e repasses financeiros) por meio de gráficos interativos e tabelas unificadas, além de contar com um módulo de rastreio longitudinal do paciente (CNS/RNDS) capaz de identificar e consolidar agendamentos duplicados entre as esferas municipal, estadual e federal.

---

## Origem e Desenvolvimento Colaborativo

A concepção deste projeto nasceu de forma colaborativa a partir da experiência multidisciplinar de **todas as integrantes do time** — unindo conhecimentos em saúde pública, engenharia biomédica, ciência de dados, epidemiologia computacional, gestão de projetos e design de experiência do usuário (UX/UI). 

Para transformar a idealização em um protótipo funcional, ágil e responsivo em tempo recorde, utilizamos a **Inteligência Artificial do Google Gemini** como copiloto de engenharia de software na geração, refatoração e modularização da arquitetura front-end (`HTML5`, `CSS3` e `JavaScript`).

---

## Justificativa e Problema Resolvido

O **SUS DataHub** ataca diretamente um dos maiores gargalos estruturais da gestão pública de saúde no Brasil: a **fragmentação de informações entre as três esferas de governo** (Municipal, Estadual e Federal) e a **duplicidade de solicitações nas filas de regulação**.

Na prática atual, um mesmo cidadão pode ter um procedimento ou exame solicitado simultaneamente em sistemas distintos de regulação (como SISREG municipal, centrais estaduais SER/CROSS e unidades federais). Isso gera:
1. **Subutilização de vagas e absenteísmo aparente**, pois o paciente realiza o exame em uma esfera e as vagas reservadas nas outras permanecem bloqueadas;
2. **Aumento artificial do tempo de espera** nas filas do SUS para outros usuários;
3. **Visão fragmentada para os gestores**, que precisam cruzar manualmente bases federais (DataSUS/FNS) com planilhas locais das secretarias municipais para tomar decisões orçamentárias e assistenciais.

### Como o SUS DataHub Soluciona Isso:
* **Consolidação Multi-Esfera:** Integra dados públicos governamentais com planilhas locais enviadas por secretarias municipais e unidades de saúde em uma única visão territorial.
* **Rastreio Longitudinal do Paciente (CNS / RNDS):** Monitora o histórico de regulações por meio do Cartão Nacional de Saúde (CNS) e identifica automaticamente quando um mesmo procedimento (código SIGTAP) está agendado simultaneamente nas redes Municipal, Estadual e Federal — permitindo a **consolidação da vaga única** e a liberação imediata das vagas duplicadas para outros pacientes da fila.
* **Painel Executivo e Territorial:** Permite filtrar estabelecimentos CNES, leitos SUS, volume de procedimentos (SIA/SIH) e repasses financeiros (FNS) por Região, Estado (UF), Município e Esfera de Gestão.

---

## Fontes de Dados e Captura

O sistema opera com uma arquitetura híbrida de ingestão e normalização em tempo real:

1. **API de Localidades do IBGE (Captura Dinâmica em Tempo Real):**
   * *Estados (UFs):* `https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`
   * *Municípios por UF:* `https://servicodados.ibge.gov.br/api/v1/localidades/estados/{uf}/municipios?orderBy=nome`
2. **Bases Públicas Federais e Estaduais (DataSUS / OpenDataSUS / CNES / SIA-SIH / FNS):**
   * Consolidação de indicadores de infraestrutura hospitalar (estabelecimentos ativos e leitos SUS), volume de atendimentos ambulatoriais/hospitalares e repasses financeiros fundo a fundo.
3. **Interoperabilidade de Regulação (RNDS / SISREG / SER / CROSS / SIGA):**
   * Estrutura de dados longitudinal cruzando protocolos das centrais de regulação municipal, estadual e federal por meio do identificador único do cidadão (CNS/CPF) e tabela SIGTAP.
4. **Ingestão Local via Upload (`.CSV` e `.JSON`):**
   * Leitura client-side com parser automático (`PapaParse`) e normalização de cabeçalhos (remoção de acentos, padronização de chaves e tipagem numérica) para fusão instantânea com os dados das APIs.

---

## Arquitetura e Funcionamento Detalhado

O protótipo foi construído sem dependências de build pesado, garantindo leveza, portabilidade e execução direta em navegadores modernos (desktop, tablet e smartphone):

```text
sus-datahub/
├── index.html   # Estrutura semântica, layout Bento Grid, modais e navegação responsiva (Sidebar + Bottom Nav)
├── style.css    # Estilização Glassmorphism/Soft UI (.frosted-card), tema escuro RNDS (.dark-rnds-card) e animações
└── script.js    # Gerenciamento de estado global, integração IBGE, motor de detecção de duplicidades, Chart.js e exportação CSV
```

### Principais Módulos Técnicos (`script.js`)
* **Gerenciamento de Estado Reativo (`state`):** Centraliza os registros das APIs (`apiRecords`), arquivos importados (`uploadedRecords`), filtros ativos (`filteredRecords`) e jornadas de pacientes (`patientJourneys`).
* **Motor de Detecção de Sobreposição (`detectMultiSphereOverlap`):** Agrupa as alocações ativas de um paciente por `codigoSigtap` e verifica se há interseção entre esferas distintas (`Municipal`, `Estadual`, `Federal`), disparando alertas visuais e habilitando a função `resolveDuplicateAllocations()` para liberar vagas excedentes.
* **Visualização de Dados (`Chart.js`):** Renderiza 4 *sparklines* de tendência nos cards de KPIs, um gráfico de barras agrupadas comparando atendimentos, leitos e repasses por UF, e um gráfico de rosca (*doughnut*) exibindo a proporção de atendimentos por esfera.
* **Experiência Mobile-First:** Adapta automaticamente a tabela unificada para cartões estruturados em telas menores que `768px`, além de transformar o diagrama de fluxo SVG da RNDS em um fluxo vertical conectado no mobile.
* **Exportação Padronizada (`exportUnifiedCSV`):** Permite baixar toda a base filtrada e consolidada em formato `.CSV` pronto para auditoria ou análise externa.

---

## Roadmap: Evolução e Aplicação de Inteligência Artificial

Para a próxima fase de evolução do **SUS DataHub** em ambiente produtivo, planejamos sair da análise descritiva e baseada em regras determinísticas para uma camada de **Inteligência Artificial Preditiva e Prescritiva**:

### 1. Próximos Passos Técnicos
* **Pipeline ETL Automatizado:** Conexão direta via back-end (Python/FastAPI) aos arquivos `.dbc` do DataSUS (PySUS) e barramento FHIR da Rede Nacional de Dados em Saúde (RNDS).
* **Entity Resolution Probabilístico:** Cruzamento inteligente de cadastros de pacientes mesmo diante de falhas de preenchimento (homônimos, ausência de CNS ou divergência de digitação).
* **Predição de Demanda e Desabastecimento/Lotação:** Antecipação de gargalos em leitos hospitalares e filas de exames especializados por região de saúde.
* **Agente Copiloto para Gestores:** Interface conversacional em linguagem natural para consulta rápida de indicadores epidemiológicos e financeiros.

### 2. Modelos de Algoritmos Sugeridos e Justificativa

| Aplicação no SUS DataHub | Algoritmo / Arquitetura Recomendada | Justificativa Técnica |
| :--- | :--- | :--- |
| **Predição de Risco de Absenteísmo (*No-Show*) e Gargalos de Fila** | **LightGBM / XGBoost** *(Gradient Boosted Decision Trees)* | Dados tabulares do SUS (CNES, SIA/SIH, SISREG) possuem alta dimensionalidade, variáveis categóricas (CID, SIGTAP, município) e valores ausentes. Modelos baseados em *Gradient Boosting* oferecem estado da arte em performance tabular, baixo custo computacional de inferência e alta interpretabilidade via **SHAP Values** (essencial para auditoria na gestão pública). |
| **Deduplicação Inteligente de Pacientes (*Record Linkage*)** | **Fellegi-Sunter Probabilístico + Embeddings de Texto (Sentence-BERT / Levenshtein)** | No mundo real do SUS, um mesmo cidadão pode possuir múltiplos cartões CNS provisórios ou erros gráficos no nome/nome da mãe. A combinação de distância fonética/lexical com *embeddings* semânticos permite calcular a probabilidade de unicidade sem depender apenas de chave exata. |
| **Previsão de Ocupação de Leitos e Sazonalidade Epidemiológica** | **Temporal Fusion Transformer (TFT) ou Prophet** | Permite capturar múltiplas sazonalidades (surtos respiratórios, arboviroses, feriados) combinadas com covariáveis externas (dados climáticos e demográficos do IBGE) para recomendar o remanejamento preventivo de repasses e leitos. |

---

## Time Idealizador

* **Aline Barreto Mendes** — [LinkedIn](https://www.linkedin.com/in/alinebarretomendes/)
* **Anna Patricia Pachas Manrique** — [LinkedIn](https://www.linkedin.com/in/anna-patricia-pachas-manrique-414806ab/)
* **Jéssica de Andrade Gomes** — [LinkedIn](https://www.linkedin.com/in/jessicadeandrade27/)
* **Marina Micas Jardim** — [LinkedIn](https://www.linkedin.com/in/marinamicas/)
