/**
 * Tests for parseTasks and toggleLine logic exported from TasksView.
 */

jest.mock("@/lib/tauri-commands", () => ({
  writeArtifact: jest.fn().mockResolvedValue(undefined),
}));

import { parseTasks, toggleLine } from "@/components/changes/TasksView";

const SAMPLE_MD = `## 1. Setup

- [ ] 1.1 Create module
- [x] 1.2 Add dependencies

## 2. Core

- [ ] 2.1 Implement feature
`;

describe("parseTasks: lineIndex tracking", () => {
  it("assigns the correct lineIndex to each task", () => {
    const layers = parseTasks(SAMPLE_MD);
    const allTasks = layers.flatMap((l) => l.tasks);
    expect(allTasks).toHaveLength(3);

    const lines = SAMPLE_MD.split("\n");
    for (const task of allTasks) {
      const line = lines[task.lineIndex];
      expect(line).toMatch(/\[[x ]\]/i);
    }
  });

  it("task at lineIndex 0 of setup group is unchecked", () => {
    const layers = parseTasks(SAMPLE_MD);
    const setup = layers.find((l) => l.title === "1. Setup");
    expect(setup).toBeDefined();
    expect(setup!.tasks[0].done).toBe(false);
    expect(setup!.tasks[0].label).toMatch(/Create module/);
  });

  it("task at lineIndex 1 of setup group is checked", () => {
    const layers = parseTasks(SAMPLE_MD);
    const setup = layers.find((l) => l.title === "1. Setup");
    expect(setup!.tasks[1].done).toBe(true);
    expect(setup!.tasks[1].label).toMatch(/Add dependencies/);
  });

  it("each task's lineIndex points to a line containing the task label", () => {
    const layers = parseTasks(SAMPLE_MD);
    const lines = SAMPLE_MD.split("\n");
    for (const task of layers.flatMap((l) => l.tasks)) {
      const line = lines[task.lineIndex];
      expect(line).toContain(task.label.slice(0, 8));
    }
  });

  it("returns empty array for markdown with no tasks", () => {
    const layers = parseTasks("## Heading\n\nSome text\n");
    expect(layers).toHaveLength(0);
  });

  it("groups tasks under correct layer headings", () => {
    const layers = parseTasks(SAMPLE_MD);
    expect(layers).toHaveLength(2);
    expect(layers[0].title).toBe("1. Setup");
    expect(layers[1].title).toBe("2. Core");
  });
});

describe("toggleLine: line replacement logic", () => {
  it("marks an unchecked task as checked", () => {
    const md = "- [ ] Do the thing\n";
    const result = toggleLine(md, 0, true);
    expect(result).toBe("- [x] Do the thing\n");
  });

  it("marks a checked task as unchecked", () => {
    const md = "- [x] Done task\n";
    const result = toggleLine(md, 0, false);
    expect(result).toBe("- [ ] Done task\n");
  });

  it("preserves surrounding lines untouched", () => {
    const md = "## Group\n\n- [ ] Task one\n- [x] Task two\n";
    const result = toggleLine(md, 2, true);
    const lines = result.split("\n");
    expect(lines[0]).toBe("## Group");
    expect(lines[1]).toBe("");
    expect(lines[2]).toBe("- [x] Task one");
    expect(lines[3]).toBe("- [x] Task two");
  });

  it("returns original markdown unchanged when lineIndex is out of bounds", () => {
    const md = "- [ ] Task\n";
    const result = toggleLine(md, 999, true);
    expect(result).toBe(md);
  });

  it("handles case-insensitive [X] when unchecking", () => {
    const md = "- [X] Task\n";
    const result = toggleLine(md, 0, false);
    expect(result).toBe("- [ ] Task\n");
  });

  it("roundtrip: check then uncheck restores original", () => {
    const md = "- [ ] Roundtrip task\n";
    const checked = toggleLine(md, 0, true);
    const restored = toggleLine(checked, 0, false);
    expect(restored).toBe(md);
  });
});

describe("parseTasks + toggleLine integration: lineIndex targets the correct line", () => {
  it("toggling a parsed task's lineIndex updates the right line in the source", () => {
    const layers = parseTasks(SAMPLE_MD);
    const task = layers[0].tasks[0];
    expect(task.done).toBe(false);

    const updated = toggleLine(SAMPLE_MD, task.lineIndex, true);
    const updatedLayers = parseTasks(updated);
    const updatedTask = updatedLayers[0].tasks[0];
    expect(updatedTask.done).toBe(true);
    expect(updatedTask.label).toBe(task.label);
  });
});

describe("toggleLine: no-Tauri guard", () => {
  it("calling toggleLine without a filePath path does not throw", () => {
    expect(() => {
      toggleLine("- [ ] Task\n", 0, true);
    }).not.toThrow();
  });
});
