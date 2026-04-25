export interface CourseSession {
	id: string;
	section: "A" | "B" | "C" | "D";
	sectionTitle: string;
	title: string;
	notebookPath: string;
	focus: string;
	concepts: readonly string[];
	learningObjectives: readonly string[];
	starterActivities: readonly string[];
	masteryChecks: readonly string[];
}

export interface CurriculumMilestone {
	id: string;
	label: string;
	title: string;
	hint: string;
	completionMessage?: string;
	relatedSessions?: readonly string[];
}

export interface Curriculum {
	id: string;
	title: string;
	sourceName: string;
	sourceUrl: string;
	licenseNote: string;
	description: string;
	sessions: readonly CourseSession[];
	milestones: readonly CurriculumMilestone[];
}
