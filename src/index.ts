import { StringEnum } from "@mariozechner/pi-ai";
import type { ExtensionAPI, ExtensionContext, Theme } from "@mariozechner/pi-coding-agent";
import { Box, Text, truncateToWidth, visibleWidth } from "@mariozechner/pi-tui";
import { Type } from "@sinclair/typebox";
import {
	CSS_METHODS_PYTHON_CURRICULUM,
	CSS_MILESTONE_IDS,
	CSS_MILESTONES_BY_ID,
	CSS_SESSIONS_BY_ID,
	type CssMilestoneId,
} from "./curricula/css-methods-python.ts";
import { buildFocusPrompt, buildKickoffPrompt, formatCourseMap, formatMilestoneSummary } from "./prompts/css-tutor.ts";

const MARK_TOOL_NAME = "mark_css_milestone_done";
const KICKOFF_MESSAGE_TYPE = "css-tutor-kickoff";
const INFO_MESSAGE_TYPE = "css-tutor-info";
const EVENT_MESSAGE_TYPE = "css-tutor-hidden-event";
const STARTING_MESSAGE = "Preparing a computational social science teaching path for you.";

interface MarkMilestoneDoneDetails {
	milestone: CssMilestoneId;
	title: string;
	note?: string;
	alreadyDone: boolean;
	completedMilestones: CssMilestoneId[];
	doneCount: number;
	remainingMilestones: CssMilestoneId[];
	nextMilestone?: CssMilestoneId;
}

interface PendingTutorEvent {
	content: string;
	id?: string;
}

function isMilestoneId(value: unknown): value is CssMilestoneId {
	return typeof value === "string" && (CSS_MILESTONE_IDS as readonly string[]).includes(value);
}

function orderedUniqueMilestones(milestones: Iterable<CssMilestoneId>): CssMilestoneId[] {
	const set = new Set<CssMilestoneId>(milestones);
	return CSS_MILESTONE_IDS.filter((milestone) => set.has(milestone));
}

function nextMilestone(completedMilestones: readonly CssMilestoneId[]): CssMilestoneId | undefined {
	return CSS_MILESTONE_IDS.find((milestone) => !completedMilestones.includes(milestone));
}

function reconstructCompletedMilestones(ctx: ExtensionContext): CssMilestoneId[] {
	const done = new Set<CssMilestoneId>();
	for (const entry of ctx.sessionManager.getEntries() as Array<{
		type?: string;
		message?: { role?: string; toolName?: string; details?: { milestone?: unknown } };
	}>) {
		if (entry.type !== "message") continue;
		const message = entry.message;
		if (message?.role !== "toolResult" || message.toolName !== MARK_TOOL_NAME) continue;
		if (isMilestoneId(message.details?.milestone)) done.add(message.details.milestone);
	}
	return orderedUniqueMilestones(done);
}

function hasConversationMessages(ctx: ExtensionContext): boolean {
	return (ctx.sessionManager.getBranch() as Array<{ type?: string; message?: { role?: string } }>).some(
		(entry) => entry.type === "message" && (entry.message?.role === "user" || entry.message?.role === "assistant"),
	);
}

function hasUserMessages(ctx: ExtensionContext): boolean {
	return (ctx.sessionManager.getBranch() as Array<{ type?: string; message?: { role?: string } }>).some(
		(entry) => entry.type === "message" && entry.message?.role === "user",
	);
}

function formatTokens(count: number): string {
	if (count < 1000) return count.toString();
	if (count < 10000) return `${(count / 1000).toFixed(1)}k`;
	if (count < 1000000) return `${Math.round(count / 1000)}k`;
	if (count < 10000000) return `${(count / 1000000).toFixed(1)}M`;
	return `${Math.round(count / 1000000)}M`;
}

function infoBox(theme: Theme, title: string, content: string): Box {
	const box = new Box(1, 1, (text) => theme.bg("customMessageBg", text));
	box.addChild(new Text(`${theme.fg("accent", theme.bold(title))}\n${content}\n`, 0, 0));
	return box;
}

export default function cssAgenticTutorExtension(pi: ExtensionAPI) {
	let completedMilestones: CssMilestoneId[] = [];
	let pendingTutorEvents: PendingTutorEvent[] = [];
	let kickoffSent = false;
	let milestoneMarksThisTurn = 0;

	pi.registerMessageRenderer(KICKOFF_MESSAGE_TYPE, (_message, _options, theme) => {
		const box = new Box(1, 1, (text) => theme.bg("customMessageBg", text));
		box.addChild(
			new Text(
				[
					theme.fg("accent", theme.bold("Agentic CSS Tutor")),
					theme.fg("muted", STARTING_MESSAGE),
				].join("\n") + "\n",
				0,
				0,
			),
		);
		return box;
	});

	pi.registerMessageRenderer(INFO_MESSAGE_TYPE, (message, _options, theme) => {
		const content = typeof message.content === "string" ? message.content : JSON.stringify(message.content, null, 2);
		const title =
			message.details && typeof message.details === "object" && "title" in message.details
				? String((message.details as { title?: unknown }).title ?? "CSS Tutor")
				: "CSS Tutor";
		return infoBox(theme, title, content);
	});

	const sendInfo = (title: string, content: string) => {
		pi.sendMessage({
			customType: INFO_MESSAGE_TYPE,
			content,
			details: { title },
			display: true,
		});
	};

	const renderFooter = (ctx: ExtensionContext) => {
		if (!ctx.hasUI) return;

		ctx.ui.setFooter((tui, theme, footerData) => {
			const dispose = footerData.onBranchChange(() => tui.requestRender());

			return {
				dispose,
				invalidate() {},
				render(width: number): string[] {
					const doneCount = completedMilestones.length;
					const next = nextMilestone(completedMilestones);
					const tutor = theme.fg("accent", theme.bold(`CSS Tutor ${doneCount}/${CSS_MILESTONE_IDS.length}`));
					const nextText = next
						? theme.fg("warning", `Next: ${CSS_MILESTONES_BY_ID[next].label}`)
						: theme.fg("success", "All CSS tutor milestones complete");
					const leftTop = `${tutor}${theme.fg("dim", " • ")}${nextText}`;

					let pwd = process.cwd();
					const home = process.env.HOME || process.env.USERPROFILE;
					if (home && pwd.startsWith(home)) {
						pwd = `~${pwd.slice(home.length)}`;
					}
					const branch = footerData.getGitBranch();
					if (branch) pwd = `${pwd} (${branch})`;
					const rightTop = theme.fg("dim", pwd);

					const leftTopWidth = visibleWidth(leftTop);
					const rightTopWidth = visibleWidth(rightTop);
					let topLine: string;
					if (leftTopWidth + 1 + rightTopWidth <= width) {
						topLine = `${leftTop}${" ".repeat(width - leftTopWidth - rightTopWidth)}${rightTop}`;
					} else {
						const leftBudget = Math.max(0, width - rightTopWidth - 1);
						if (leftBudget >= 12) {
							const leftTruncated = truncateToWidth(leftTop, leftBudget, theme.fg("dim", "..."));
							topLine = `${leftTruncated}${" ".repeat(Math.max(1, width - visibleWidth(leftTruncated) - rightTopWidth))}${rightTop}`;
						} else {
							topLine = truncateToWidth(leftTop, width, theme.fg("dim", "..."));
						}
					}
					topLine = truncateToWidth(topLine, width, theme.fg("dim", "..."));

					const contextUsage = ctx.getContextUsage();
					const contextWindow = contextUsage?.contextWindow ?? ctx.model?.contextWindow ?? 0;
					const contextPercentValue = contextUsage?.percent ?? 0;
					const contextPercent = contextUsage?.percent !== null ? contextPercentValue.toFixed(1) : "?";
					const contextDisplay = `${contextPercent}%/${formatTokens(contextWindow)}`;
					const modelName = ctx.model?.id || "no-model";
					const source = "Source: css_methods_python";
					const stats = theme.fg("dim", `${source} • ${contextDisplay} • ${modelName}`);
					return [topLine, truncateToWidth(stats, width, theme.fg("dim", "..."))];
				},
			};
		});
	};

	const refreshFromSession = (ctx: ExtensionContext) => {
		completedMilestones = reconstructCompletedMilestones(ctx);
		kickoffSent = (ctx.sessionManager.getBranch() as Array<{ type?: string; customType?: string }>).some(
			(entry) => entry.type === "custom" && entry.customType === KICKOFF_MESSAGE_TYPE,
		);
		renderFooter(ctx);
	};

	const maybeSendKickoff = (ctx: ExtensionContext) => {
		if (kickoffSent || hasConversationMessages(ctx)) return;
		kickoffSent = true;
		pi.sendMessage(
			{
				customType: KICKOFF_MESSAGE_TYPE,
				content: buildKickoffPrompt(CSS_METHODS_PYTHON_CURRICULUM, MARK_TOOL_NAME),
				display: true,
			},
			{ triggerTurn: true },
		);
	};

	const queueHiddenEvent = (content: string, id?: string) => {
		if (id && pendingTutorEvents.some((event) => event.id === id)) return;
		if (pendingTutorEvents.some((event) => event.content === content)) return;
		pendingTutorEvents.push({ content, id });
	};

	pi.registerTool({
		name: MARK_TOOL_NAME,
		label: "Mark CSS Milestone Done",
		description: "Mark one computational social science learning milestone as completed.",
		promptSnippet: "Mark a CSS tutor milestone as done when the learner has genuinely completed it.",
		promptGuidelines: [
			`Use ${MARK_TOOL_NAME} when the learner actually completes a CSS learning milestone.`,
			`Do not call ${MARK_TOOL_NAME} just because you explained a concept; the learner must have done or demonstrated something.`,
		],
		parameters: Type.Object({
			milestone: StringEnum(CSS_MILESTONE_IDS, { description: "The CSS learning milestone that was completed" }),
			note: Type.Optional(Type.String({ description: "Optional short note about what the learner achieved" })),
		}),

		async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
			if (!hasUserMessages(ctx)) {
				return {
					content: [
						{
							type: "text",
							text: `Cannot mark CSS milestones yet. Wait for at least one real user follow-up message after the initial tutor welcome before calling ${MARK_TOOL_NAME}.`,
						},
					],
				};
			}

			if (milestoneMarksThisTurn >= 1) {
				return {
					content: [
						{
							type: "text",
							text: `Only one CSS tutor milestone can be marked per assistant turn. Do not call ${MARK_TOOL_NAME} again in this turn.`,
						},
					],
				};
			}

			const current = new Set(completedMilestones);
			const alreadyDone = current.has(params.milestone);
			current.add(params.milestone);
			completedMilestones = orderedUniqueMilestones(current);
			milestoneMarksThisTurn += 1;
			renderFooter(ctx);

			const remainingMilestones = CSS_MILESTONE_IDS.filter((milestone) => !current.has(milestone));
			const next = nextMilestone(completedMilestones);
			const milestone = CSS_MILESTONES_BY_ID[params.milestone];
			const details: MarkMilestoneDoneDetails = {
				milestone: params.milestone,
				title: milestone.title,
				note: params.note?.trim() || undefined,
				alreadyDone,
				completedMilestones: [...completedMilestones],
				doneCount: completedMilestones.length,
				remainingMilestones,
				nextMilestone: next,
			};

			const completedLabels = completedMilestones.map((id) => CSS_MILESTONES_BY_ID[id].label).join(", ");
			const remainingLabels = remainingMilestones.map((id) => CSS_MILESTONES_BY_ID[id].label).join(", ");
			const text = alreadyDone
				? [
						`Milestone already completed: ${milestone.label}.`,
						`Do not call ${MARK_TOOL_NAME} again for this milestone.`,
						`Already completed milestones: ${completedLabels}.`,
						remainingLabels ? `Remaining milestones: ${remainingLabels}.` : "All CSS tutor milestones are complete.",
					].join(" ")
				: [
						`Milestone completed: ${milestone.label}.`,
						`Do not call ${MARK_TOOL_NAME} again for this milestone.`,
						`Already completed milestones: ${completedLabels}.`,
						remainingLabels ? `Remaining milestones: ${remainingLabels}.` : "All CSS tutor milestones are complete.",
						...(milestone.completionMessage
							? [
									`Internal next-step guidance (apply only because this milestone was newly completed in this call; ignore if this milestone was already completed earlier): ${milestone.completionMessage}`,
								]
							: []),
					].join(" ");

			return {
				content: [{ type: "text", text }],
				details,
			};
		},

		renderCall() {
			return new Text("", 0, 0);
		},

		renderResult() {
			return new Text("", 0, 0);
		},
	});

	pi.registerCommand("css-progress", {
		description: "Show Agentic CSS Tutor progress.",
		handler: async () => {
			sendInfo(
				"CSS Tutor Progress",
				`${formatMilestoneSummary(CSS_METHODS_PYTHON_CURRICULUM.milestones, completedMilestones)}\n\nSource: ${CSS_METHODS_PYTHON_CURRICULUM.sourceUrl}`,
			);
		},
	});

	pi.registerCommand("css-syllabus", {
		description: "Show the css_methods_python course map, or details for a session like A2/D4.",
		getArgumentCompletions: (prefix: string) => {
			const normalized = prefix.trim().toUpperCase();
			const items = CSS_METHODS_PYTHON_CURRICULUM.sessions.map((session) => ({
				value: session.id,
				label: `${session.id}: ${session.title}`,
			}));
			const filtered = items.filter((item) => item.value.startsWith(normalized) || item.label.toUpperCase().includes(normalized));
			return filtered.length > 0 ? filtered : null;
		},
		handler: async (args) => {
			const id = args.trim().toUpperCase();
			const session = CSS_SESSIONS_BY_ID[id];
			if (session) {
				sendInfo(
					`${session.id}: ${session.title}`,
					[
						`Notebook: ${session.notebookPath}`,
						`Focus: ${session.focus}`,
						`Concepts: ${session.concepts.join(", ")}`,
						"",
						"Learning objectives:",
						...session.learningObjectives.map((objective) => `- ${objective}`),
						"",
						"Starter activities:",
						...session.starterActivities.map((activity) => `- ${activity}`),
						"",
						"Mastery checks:",
						...session.masteryChecks.map((check) => `- ${check}`),
					].join("\n"),
				);
				return;
			}

			sendInfo("CSS Methods Python Course Map", formatCourseMap(CSS_METHODS_PYTHON_CURRICULUM));
		},
	});

	pi.registerCommand("css-focus", {
		description: "Focus the tutor on a css_methods_python session or topic, e.g. /css-focus C3 or /css-focus topic modeling.",
		getArgumentCompletions: (prefix: string) => {
			const normalized = prefix.trim().toUpperCase();
			const items = CSS_METHODS_PYTHON_CURRICULUM.sessions.map((session) => ({
				value: session.id,
				label: `${session.id}: ${session.title}`,
			}));
			const filtered = items.filter((item) => item.value.startsWith(normalized) || item.label.toUpperCase().includes(normalized));
			return filtered.length > 0 ? filtered : null;
		},
		handler: async (args, ctx) => {
			const focus = args.trim();
			if (!focus) {
				ctx.ui.notify("Usage: /css-focus A2, /css-focus C3, or /css-focus your topic", "info");
				return;
			}
			const hidden = buildFocusPrompt(CSS_METHODS_PYTHON_CURRICULUM, focus);
			pi.sendMessage(
				{
					customType: EVENT_MESSAGE_TYPE,
					content: hidden,
					details: { focus },
					display: false,
				},
				{ triggerTurn: true },
			);
			ctx.ui.notify(`CSS tutor focus set to ${focus}.`, "info");
		},
	});

	pi.on("session_start", async (_event, ctx) => {
		refreshFromSession(ctx);
		maybeSendKickoff(ctx);
		if (ctx.hasUI) ctx.ui.notify("Agentic CSS Tutor is active.", "info");
	});

	pi.on("session_switch", async (_event, ctx) => {
		refreshFromSession(ctx);
		maybeSendKickoff(ctx);
	});

	pi.on("session_fork", async (_event, ctx) => {
		refreshFromSession(ctx);
	});

	pi.on("before_agent_start", async () => {
		milestoneMarksThisTurn = 0;
		if (pendingTutorEvents.length === 0) return;
		const queuedEvents = pendingTutorEvents;
		pendingTutorEvents = [];
		const content = queuedEvents.map((event) => event.content).join("\n\n");
		const eventIds = queuedEvents.map((event) => event.id).filter((id): id is string => typeof id === "string" && id.length > 0);
		return {
			message: {
				customType: EVENT_MESSAGE_TYPE,
				content,
				details: eventIds.length > 0 ? { eventIds } : undefined,
				display: false,
			},
		};
	});

	pi.on("model_select", async (_event, ctx) => {
		renderFooter(ctx);
	});

	// Public helper for other extensions/commands in the same runtime.
	pi.registerCommand("css-source", {
		description: "Show the upstream course repository used by this tutor.",
		handler: async () => {
			sendInfo(
				"CSS Tutor Source",
				`${CSS_METHODS_PYTHON_CURRICULUM.sourceName}\n${CSS_METHODS_PYTHON_CURRICULUM.sourceUrl}\n\n${CSS_METHODS_PYTHON_CURRICULUM.licenseNote}`,
			);
		},
	});

	// Keep this function referenced so future event producers can use it without changing the hidden-event injection path.
	void queueHiddenEvent;
}
