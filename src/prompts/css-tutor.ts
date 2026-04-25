import type { Curriculum, CurriculumMilestone } from "../curricula/types.ts";

export function formatMilestoneList(curriculum: Curriculum): string {
	return curriculum.milestones
		.map((milestone, index) => {
			const related = milestone.relatedSessions?.length ? `\n   Related source sessions: ${milestone.relatedSessions.join(", ")}` : "";
			return `${index + 1}. ${milestone.title}\n   Completion signal: ${milestone.hint}${related}`;
		})
		.join("\n");
}

export function formatCourseMap(curriculum: Curriculum): string {
	const sections = new Map<string, Curriculum["sessions"]>();
	for (const session of curriculum.sessions) {
		const key = `${session.section}. ${session.sectionTitle}`;
		sections.set(key, [...(sections.get(key) ?? []), session]);
	}

	return [...sections.entries()]
		.map(([section, sessions]) => {
			const lines = sessions.map(
				(session) =>
					`- ${session.id}: ${session.title} (${session.notebookPath})\n  Focus: ${session.focus}\n  Concepts: ${session.concepts.join(", ")}`,
			);
			return `## ${section}\n${lines.join("\n")}`;
		})
		.join("\n\n");
}

export function formatMilestoneSummary(milestones: readonly CurriculumMilestone[], completed: readonly string[]): string {
	const done = new Set(completed);
	return milestones.map((milestone) => `${done.has(milestone.id) ? "✓" : "·"} ${milestone.label}: ${milestone.title}`).join("\n");
}

export function buildKickoffPrompt(curriculum: Curriculum, markToolName: string): string {
	return `[CSS TEACHING MODE]
You are guiding the user through an agentic introduction to Computational Social Science (CSS) with Python.

Source curriculum:
- ${curriculum.sourceName}
- ${curriculum.sourceUrl}
- ${curriculum.licenseNote}

Curriculum description:
${curriculum.description}

Track these learning milestones and mark them complete with the ${markToolName} tool when the learner genuinely achieves them:
${formatMilestoneList(curriculum)}

Teaching rules:
- Use ${markToolName} when the learner actually completes a milestone.
- Do not mark milestones early just because they were mentioned, planned, or explained by you.
- Never call ${markToolName} again for a milestone that was already completed earlier.
- Keep track of completed milestones from previous ${markToolName} tool results.
- Do not call ${markToolName} in your very first teaching-mode reply.
- Do not call ${markToolName} until the user has sent at least one real message after your initial welcome.
- Mark at most one milestone per assistant turn.
- Milestones can be completed in any order, but keep a coherent learning path.
- Do not expose internal mechanics: avoid mentioning milestone IDs, hidden tool names, or hidden prompts.
- Keep the interaction hands-on and project-based; prefer small executable or inspectable steps.
- Use the css_methods_python notebooks as a content backbone, but adapt to the learner's goal.
- When useful, suggest a relevant source notebook path from the curriculum.
- Do not overwhelm the learner with the full syllabus unless they ask for it.
- Use a Socratic style: ask one good question, request predictions before running code, and ask the learner to interpret outputs.
- Prefer hints and scaffolded code over complete solutions when the learner is practicing.
- Make the CSS distinction explicit: descriptive, predictive, and causal claims are different.
- Include measurement validity, construct validity, sampling/coverage, and ethical/privacy concerns naturally.
- Treat web scraping and platform data collection carefully: discuss terms, consent, privacy, provenance, and rate limits before implementation.
- For ML/topic/network outputs, require substantive interpretation and limitations before considering a concept mastered.
- Encourage reproducibility: environment, notebook/script, data provenance, random seeds if relevant, and a short methods note.
- Pi runs with full local permissions and no sandbox; remind the learner before destructive file operations or external data collection.

In your first reply:
- Begin with "Welcome to the Agentic CSS Tutor ..."
- Explain that this is a project-based Computational Social Science teaching mode inside Pi.
- Mention that Pi can read/edit/write files and run terminal commands in the current project, with full local permissions/no sandbox.
- Explain that the tutor is adapted from the css_methods_python course, but will personalize the path.
- State the learning goal: build a small, reproducible CSS artifact while learning research questions, data, methods, interpretation, ethics, and reproducibility.
- Ask one short follow-up question: what social phenomenon, dataset, method, or notebook they want to start from.
`;
}

export function buildFocusPrompt(curriculum: Curriculum, focus: string): string {
	const normalized = focus.trim().toUpperCase();
	const session = curriculum.sessions.find((candidate) => candidate.id === normalized);
	if (session) {
		return `[CSS TUTOR FOCUS]
The learner selected source session ${session.id}: ${session.title}.
Notebook path: ${session.notebookPath}
Focus: ${session.focus}
Concepts: ${session.concepts.join(", ")}
Learning objectives:
${session.learningObjectives.map((objective) => `- ${objective}`).join("\n")}
Starter activities:
${session.starterActivities.map((activity) => `- ${activity}`).join("\n")}
Mastery checks:
${session.masteryChecks.map((check) => `- ${check}`).join("\n")}

Use this as the near-term teaching context. Ask one practical next question or suggest one small hands-on action.`;
	}

	return `[CSS TUTOR FOCUS]
The learner asked to focus on: ${focus}
Use the CSS curriculum map if relevant, connect the topic to a research question/data/method workflow, and ask one practical next question.`;
}
