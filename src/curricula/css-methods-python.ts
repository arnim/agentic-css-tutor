import type { CourseSession, Curriculum, CurriculumMilestone } from "./types.ts";

export const CSS_METHODS_PYTHON_CURRICULUM = {
	id: "css-methods-python-agentic-intro",
	title: "Agentic Introduction to Computational Social Science with Python",
	sourceName: "GESIS CSS Introduction to Computational Social Science methods with Python",
	sourceUrl: "https://github.com/gesiscss/css_methods_python",
	licenseNote:
		"Content map adapted from the public css_methods_python course repository. Keep attribution to the original GESIS/Social ComQuant authors when redistributing derived teaching materials.",
	description:
		"A project-based, agentic teaching path that turns the css_methods_python notebook course into an interactive Pi tutoring mode. The tutor guides the learner from research-question formation through Python data work, data collection, preprocessing, analysis, interpretation, ethics, and reproducibility.",
	sessions: [
		{
			id: "A1",
			section: "A",
			sectionTitle: "Introduction",
			title: "Computing infrastructure",
			notebookPath: "a_introduction/1_computing_infrastructure.ipynb",
			focus: "Set up a reproducible Python/Jupyter workflow for CSS work.",
			concepts: ["Anaconda/conda environments", "Jupyter notebooks", "Git", "Google Colab", "reproducible execution"],
			learningObjectives: [
				"Create or inspect an environment defined in a file.",
				"Read, execute, and write a Jupyter Notebook.",
				"Understand local/cloud execution choices for course notebooks.",
			],
			starterActivities: [
				"Inspect the repository structure and identify notebooks, data, and environment files.",
				"Check whether Python/Jupyter dependencies are available locally or choose Binder/Colab.",
			],
			masteryChecks: [
				"Learner can explain where code will run and how dependencies are managed.",
				"Learner can execute or reason through a notebook cell and save the result.",
			],
		},
		{
			id: "A2",
			section: "A",
			sectionTitle: "Introduction",
			title: "Data management and relational databases",
			notebookPath: "a_introduction/2_data_management_and_relational_databases.ipynb",
			focus: "Use Pandas and relational thinking to structure social-science data.",
			concepts: ["Pandas DataFrames", "rows and columns", "filtering", "joins", "relational databases", "redundancy", "consistency"],
			learningObjectives: [
				"Use Pandas to manage and process data.",
				"Understand two-dimensional dataframe structure and row/column addressing.",
				"Combine and filter dataframes.",
				"Explain how relational databases reduce redundancy and improve consistency.",
				"Transfer and save structured data.",
			],
			starterActivities: [
				"Load or sketch a small social dataset as a dataframe.",
				"Identify entities, attributes, and possible tables.",
			],
			masteryChecks: [
				"Learner can distinguish content from structure in data.",
				"Learner can justify a tidy or relational representation for a CSS dataset.",
			],
		},
		{
			id: "A3",
			section: "A",
			sectionTitle: "Introduction",
			title: "Scientific computing and data visualization",
			notebookPath: "a_introduction/3_scientific_computing_and_data_visualization.ipynb",
			focus: "Represent, compute on, and visually explore social data.",
			concepts: ["NumPy arrays", "SciPy sparse matrices", "exploratory data analysis", "Matplotlib", "Seaborn", "visual interpretation"],
			learningObjectives: [
				"Work mathematically with data.",
				"Use NumPy and understand n-dimensional arrays.",
				"Understand sparse data and sparse matrices.",
				"Explore data using NumPy, Matplotlib, and Seaborn.",
			],
			starterActivities: [
				"Create a quick visual summary of an outcome or relationship.",
				"Discuss what the visual does and does not show.",
			],
			masteryChecks: [
				"Learner can connect a plot to a substantive social-science claim without overclaiming.",
				"Learner can explain why sparse representations matter for text or network data.",
			],
		},
		{
			id: "B1",
			section: "B",
			sectionTitle: "Data collection methods",
			title: "API harvesting",
			notebookPath: "b_data_collection_methods/1_api_harvesting.ipynb",
			focus: "Collect digital trace data through APIs and document provenance.",
			concepts: ["APIs", "Wikipedia harvesting", "precollected datasets", "revision histories", "dataset documentation", "provenance"],
			learningObjectives: [
				"Explain when an API is preferable to scraping.",
				"Use Python packages to request structured online data.",
				"Document source, query, time, and collection limitations.",
			],
			starterActivities: [
				"Pick an online source and identify available API documentation or constraints.",
				"Draft a provenance note for a small data collection task.",
			],
			masteryChecks: [
				"Learner can describe what population the collected data represents.",
				"Learner can name at least one API limitation or ethical concern.",
			],
		},
		{
			id: "B2",
			section: "B",
			sectionTitle: "Data collection methods",
			title: "Data parsing and static web scraping",
			notebookPath: "b_data_collection_methods/2_data_parsing_and_static_web_scraping.ipynb",
			focus: "Parse HTML/RSS and extract structured information from static pages responsibly.",
			concepts: ["HTML", "Beautiful Soup", "CSS selectors", "static scraping", "RSS feeds", "robots/terms awareness"],
			learningObjectives: [
				"Read basic HTML structure and locate target elements.",
				"Use Beautiful Soup to parse static web content.",
				"Transform page content into analyzable records.",
			],
			starterActivities: [
				"Inspect a page structure before writing scraping code.",
				"Extract titles, dates, links, or article snippets into a dataframe.",
			],
			masteryChecks: [
				"Learner can explain why a selector is robust or fragile.",
				"Learner can discuss legal/ethical constraints before scraping.",
			],
		},
		{
			id: "B3",
			section: "B",
			sectionTitle: "Data collection methods",
			title: "Dynamic web scraping",
			notebookPath: "b_data_collection_methods/3_dynamic_web_scraping.ipynb",
			focus: "Understand when browser automation is needed for dynamic webpages.",
			concepts: ["Selenium", "dynamic pages", "browser automation", "pagination/search", "fragility", "platform rules"],
			learningObjectives: [
				"Distinguish static from dynamic pages.",
				"Understand the basic Selenium workflow.",
				"Recognize why dynamic scraping is brittle and ethically sensitive.",
			],
			starterActivities: [
				"Compare page source with rendered browser content.",
				"Decide whether an API, static parser, or browser automation is appropriate.",
			],
			masteryChecks: [
				"Learner can justify not scraping when terms, privacy, or fragility make it inappropriate.",
			],
		},
		{
			id: "C1",
			section: "C",
			sectionTitle: "Data preprocessing methods",
			title: "Network construction and visualization",
			notebookPath: "c_data_preprocessing_methods/1_network_construction_and_visualization.ipynb",
			focus: "Construct and visualize social networks from node/edge data.",
			concepts: ["relational thinking", "nodes", "edges", "nodelists", "edgelists", "NetworkX", "attributes", "network visualization"],
			learningObjectives: [
				"Think relationally about social data.",
				"Manage network data in nodelists and edgelists.",
				"Construct networks and enrich them with attributes.",
				"Draw networks with visualization dos and don'ts in mind.",
			],
			starterActivities: [
				"Define what a tie means in a chosen social context.",
				"Build a tiny graph from an edge list and discuss its limitations.",
			],
			masteryChecks: [
				"Learner can say what nodes and edges represent substantively.",
				"Learner avoids treating a hairball visualization as evidence by itself.",
			],
		},
		{
			id: "C2",
			section: "C",
			sectionTitle: "Data preprocessing methods",
			title: "Multilayer and multimodal network construction",
			notebookPath: "c_data_preprocessing_methods/2_multilayer_and_multimodal_network_construction.ipynb",
			focus: "Represent richer networks with multiple edge types, time slices, or node modes.",
			concepts: ["multilayer networks", "link streams", "network snapshots", "bipartite networks", "projection", "information loss"],
			learningObjectives: [
				"Construct multilayer networks with multiple types of edges.",
				"Aggregate dynamic edge streams into snapshots.",
				"Construct and project bipartite networks.",
				"Explain what information is removed in transformations.",
			],
			starterActivities: [
				"Choose whether a data source has one-mode, two-mode, temporal, or multilayer structure.",
				"Discuss what a projection would hide or distort.",
			],
			masteryChecks: [
				"Learner can describe the tradeoff between richness and analyzability.",
			],
		},
		{
			id: "C3",
			section: "C",
			sectionTitle: "Data preprocessing methods",
			title: "Natural Language Processing",
			notebookPath: "c_data_preprocessing_methods/3_natural_language_processing.ipynb",
			focus: "Extract entities and represent texts for computational analysis.",
			concepts: ["regular expressions", "named entity recognition", "spaCy", "stopwords", "parts of speech", "bag-of-words", "TF-IDF", "document similarity"],
			learningObjectives: [
				"Use regular expressions for pattern extraction.",
				"Extract named entities from short texts.",
				"Build a preprocessing pipeline for text representation.",
				"Compare bag-of-words, TF-IDF, and similarity representations.",
			],
			starterActivities: [
				"Inspect a few texts before preprocessing.",
				"Define what should count as signal and noise for the research question.",
			],
			masteryChecks: [
				"Learner can explain how preprocessing choices change the measurement of text concepts.",
			],
		},
		{
			id: "D1",
			section: "D",
			sectionTitle: "Data analysis methods",
			title: "Micro-level network analysis and community detection",
			notebookPath: "d_data_analysis_methods/1_micro_level_network_analysis_and_community_detection.ipynb",
			focus: "Analyze actors' network positions and detect communities.",
			concepts: ["centrality", "closure", "brokerage", "Girvan-Newman", "Louvain", "modularity", "Granovetter"],
			learningObjectives: [
				"Measure centrality, closure, and brokerage.",
				"Perform Girvan-Newman and Louvain community detection.",
				"Explain modularity maximization and its role in community detection.",
				"Use graph theory as a relational language.",
			],
			starterActivities: [
				"Compute one actor-level metric and interpret it substantively.",
				"Compare algorithmic communities to an expected social grouping.",
			],
			masteryChecks: [
				"Learner can distinguish a mathematical centrality score from social importance.",
			],
		},
		{
			id: "D2",
			section: "D",
			sectionTitle: "Data analysis methods",
			title: "Macro-level network analysis and network modeling",
			notebookPath: "d_data_analysis_methods/2_macro_level_network_analysis_and_network_modeling.ipynb",
			focus: "Describe and model whole-network structure.",
			concepts: ["social cohesion", "core/periphery", "segregation", "separation", "inequality", "complex networks", "random networks", "small-world", "scale-free", "stochastic blockmodels"],
			learningObjectives: [
				"Measure macro-level concepts such as cohesion, separation, and inequality.",
				"Distinguish descriptive and modeling paradigms.",
				"Conceptualize network processes as micro-macro dynamics and feedback loops.",
				"Understand random, small-world, scale-free, and blockmodel approaches.",
			],
			starterActivities: [
				"Choose a macro-level network property and connect it to a social mechanism.",
				"Compare an observed network to a simple null model.",
			],
			masteryChecks: [
				"Learner can avoid turning descriptive structure into unsupported causal claims.",
			],
		},
		{
			id: "D3",
			section: "D",
			sectionTitle: "Data analysis methods",
			title: "Unsupervised machine learning",
			notebookPath: "d_data_analysis_methods/3_unsupervised_machine_learning.ipynb",
			focus: "Use dimensionality reduction and clustering for exploratory social data analysis.",
			concepts: ["V-Dem", "factor analysis", "PCA", "K-Means", "DBSCAN", "agglomerative clustering", "construct validity"],
			learningObjectives: [
				"Use dimensionality reduction to explore latent structure.",
				"Compare clustering algorithms and parameters.",
				"Interpret clusters as analytical constructs, not natural facts.",
			],
			starterActivities: [
				"Pick features and state what social concept they may proxy.",
				"Run or reason through one clustering workflow and inspect sensitivity.",
			],
			masteryChecks: [
				"Learner can explain why cluster labels require substantive validation.",
			],
		},
		{
			id: "D4",
			section: "D",
			sectionTitle: "Data analysis methods",
			title: "Topic modeling",
			notebookPath: "d_data_analysis_methods/4_topic_modeling.ipynb",
			focus: "Discover, assess, and interpret latent themes in text corpora.",
			concepts: ["LSA", "LDA", "topic number selection", "topic coherence", "pyLDAvis", "interpretability"],
			learningObjectives: [
				"Fit or understand LSA and LDA topic models.",
				"Assess topic models qualitatively and quantitatively.",
				"Visualize and label topics with caution.",
			],
			starterActivities: [
				"Inspect top words and example documents for a topic.",
				"Explain what a topic model can and cannot infer about meaning.",
			],
			masteryChecks: [
				"Learner can justify topic labels using documents, not only word lists.",
			],
		},
		{
			id: "D5",
			section: "D",
			sectionTitle: "Data analysis methods",
			title: "Supervised machine learning",
			notebookPath: "d_data_analysis_methods/5_supervised_machine_learning.ipynb",
			focus: "Contrast explanation and prediction using supervised models.",
			concepts: ["linear regression", "logistic regression", "prediction", "classification", "train/test split", "evaluation", "overfitting"],
			learningObjectives: [
				"Use regression for explanation/statistical modeling.",
				"Use supervised learning for prediction and classification.",
				"Evaluate predictive performance and limits.",
				"Separate predictive accuracy from causal explanation.",
			],
			starterActivities: [
				"Define outcome, features, and prediction/explanation goal.",
				"Interpret an evaluation metric in social-science terms.",
			],
			masteryChecks: [
				"Learner can state why a predictive feature is not automatically a causal factor.",
			],
		},
	],
	milestones: [
		{
			id: "welcome",
			label: "CSS intro",
			title: "Orient to the agentic CSS teaching mode",
			hint: "The learner has been welcomed, understands this is a Pi teaching mode for computational social science, knows Pi can inspect/edit/run code with full local permissions, and has been asked for their learning goal or project interest.",
		},
		{
			id: "learningGoal",
			label: "Learning goal",
			title: "Choose a CSS learning goal or mini-project",
			hint: "The learner picked a topic, data source, method, notebook, or applied social-science question to work toward.",
			completionMessage:
				"Invite the learner to co-design the path. Ask whether they want a guided tour, a notebook-driven lab, or a mini research project. Do not dump a long plan unless they explicitly ask for one.",
		},
		{
			id: "researchQuestion",
			label: "Research question",
			title: "Formulate a computational social science research question",
			hint: "The learner has stated a clear empirical question with a social phenomenon, units/cases, relevant population or corpus, and an outcome/relationship/structure of interest.",
			completionMessage:
				"Next, help the learner connect concepts to data and measurement. Ask what observable traces or variables could represent the key concepts.",
		},
		{
			id: "environment",
			label: "Environment",
			title: "Set up or inspect the Python/Jupyter workflow",
			hint: "The learner has identified how they will run code and notebooks, and either checked the environment/repository layout or chosen Binder/Colab/local execution.",
			relatedSessions: ["A1"],
		},
		{
			id: "dataManagement",
			label: "Data management",
			title: "Represent social data with Pandas/relational thinking",
			hint: "The learner has loaded, inspected, sketched, or reasoned through a dataframe/table design and can identify rows, columns, entities, joins, or tidy/relational structure.",
			relatedSessions: ["A2"],
		},
		{
			id: "exploration",
			label: "Exploration",
			title: "Explore data computationally and visually",
			hint: "The learner has computed or interpreted an exploratory summary/plot and connected it to a tentative social-science interpretation without overclaiming.",
			relatedSessions: ["A3"],
		},
		{
			id: "collection",
			label: "Collection",
			title: "Collect or evaluate digital/social data sources responsibly",
			hint: "The learner has selected/evaluated a data source or collection method such as API harvesting, static scraping, or dynamic scraping, and addressed provenance, platform constraints, privacy, or ethics.",
			relatedSessions: ["B1", "B2", "B3"],
		},
		{
			id: "preprocessing",
			label: "Preprocessing",
			title: "Transform raw traces into network/text/feature representations",
			hint: "The learner has built or reasoned about a representation such as nodelist/edgelist, multilayer/bipartite network, regex/NER extraction, bag-of-words, TF-IDF, or document similarity.",
			relatedSessions: ["C1", "C2", "C3"],
		},
		{
			id: "analysis",
			label: "Analysis",
			title: "Apply and interpret a CSS analysis method",
			hint: "The learner has applied or seriously reasoned through one analysis method such as centrality/community detection, network modeling, clustering/dimensionality reduction, topic modeling, regression, or classification.",
			relatedSessions: ["D1", "D2", "D3", "D4", "D5"],
			completionMessage:
				"Transition to interpretation. Ask what claim the result supports, what it does not support, and what alternative explanation or validity threat remains.",
		},
		{
			id: "interpretationEthics",
			label: "Interpretation & ethics",
			title: "Interpret claims, limits, validity, and ethics",
			hint: "The learner has articulated whether the work is descriptive, predictive, or causal; stated limitations/validity threats; and considered ethics such as privacy, bias, representation, consent, or downstream harm.",
			completionMessage:
				"Encourage a short reproducible artifact: notebook, script, README, or methods memo with data provenance, environment notes, and limitations.",
		},
		{
			id: "reproducibleArtifact",
			label: "Reproducible artifact",
			title: "Produce or improve a reproducible CSS artifact",
			hint: "The learner has created or improved a notebook/script/README/methods note that records the question, data, method, results, limitations, and enough execution details to reproduce or audit the work.",
		},
	],
} as const satisfies Curriculum;

export type CssMilestoneId = (typeof CSS_METHODS_PYTHON_CURRICULUM.milestones)[number]["id"];

export const CSS_MILESTONE_IDS = CSS_METHODS_PYTHON_CURRICULUM.milestones.map((milestone) => milestone.id) as [
	CssMilestoneId,
	...CssMilestoneId[],
];

export const CSS_MILESTONES_BY_ID = Object.fromEntries(
	CSS_METHODS_PYTHON_CURRICULUM.milestones.map((milestone) => [milestone.id, milestone]),
) as Record<CssMilestoneId, CurriculumMilestone>;

export const CSS_SESSIONS_BY_ID = Object.fromEntries(
	CSS_METHODS_PYTHON_CURRICULUM.sessions.map((session) => [session.id, session]),
) as Record<string, CourseSession>;
