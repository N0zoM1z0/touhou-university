import { values as catalogValues, text as catalogText } from "../generated/i18n/data/academic-work.js";

const choice = (id, label) => ({ id, label });
const question = (id, type, prompt, options, answer, points, explanation) => ({
  id,
  type,
  prompt,
  options,
  answer,
  points,
  explanation,
});

export const academicAssignments = [
  {
    id: "his-yesterday-editions",
    courseCode: "HIS-204",
    kind: "assignment",
    dueOffset: 2,
    title: catalogText("academicAssignments.his-yesterday-editions.title"),
    brief: catalogText("academicAssignments.his-yesterday-editions.brief"),
    teacher: catalogText("academicAssignments.his-yesterday-editions.teacher"),
    questions: [
      question(
        "sequence",
        "choice",
        catalogText("academicAssignments.his-yesterday-editions.questions.0.sequence.2"),
        [
          choice("caused", catalogText("academicAssignments.his-yesterday-editions.questions.0.sequence.3.0.caused.1")),
          choice("sequence", catalogText("academicAssignments.his-yesterday-editions.questions.0.sequence.3.1.sequence.1")),
          choice("stamp", catalogText("academicAssignments.his-yesterday-editions.questions.0.sequence.3.2.stamp.1")),
        ],
        "sequence",
        10,
        catalogText("academicAssignments.his-yesterday-editions.questions.0.sequence.6"),
      ),
      question(
        "citation",
        "choice",
        catalogText("academicAssignments.his-yesterday-editions.questions.1.citation.2"),
        [
          choice("font", catalogText("academicAssignments.his-yesterday-editions.questions.1.citation.3.0.font.1")),
          choice("provenance", catalogText("academicAssignments.his-yesterday-editions.questions.1.citation.3.1.provenance.1")),
          choice("aya", catalogText("academicAssignments.his-yesterday-editions.questions.1.citation.3.2.aya.1")),
        ],
        "provenance",
        10,
        catalogText("academicAssignments.his-yesterday-editions.questions.1.citation.6"),
      ),
      question(
        "memo",
        "text",
        catalogText("academicAssignments.his-yesterday-editions.questions.2.memo.2"),
        [],
        { keywordGroups: [catalogValues("academicAssignments.his-yesterday-editions.questions.2.memo.4.keywordGroups.-"), catalogValues("academicAssignments.his-yesterday-editions.questions.2.memo.4.keywordGroups.-.2")], minLength: 18 },
        10,
        catalogText("academicAssignments.his-yesterday-editions.questions.2.memo.6"),
      ),
    ],
  },
  {
    id: "mag-material-provenance",
    courseCode: "MAG-221",
    kind: "assignment",
    dueOffset: 3,
    title: catalogText("academicAssignments.mag-material-provenance.title"),
    brief: catalogText("academicAssignments.mag-material-provenance.brief"),
    teacher: catalogText("academicAssignments.mag-material-provenance.teacher"),
    questions: [
      question(
        "minimum",
        "choice",
        catalogText("academicAssignments.mag-material-provenance.questions.0.minimum.2"),
        [
          choice("colour", catalogText("academicAssignments.mag-material-provenance.questions.0.minimum.3.0.colour.1")),
          choice("batch", catalogText("academicAssignments.mag-material-provenance.questions.0.minimum.3.1.batch.1")),
          choice("owner", catalogText("academicAssignments.mag-material-provenance.questions.0.minimum.3.2.owner.1")),
        ],
        "batch",
        12,
        catalogText("academicAssignments.mag-material-provenance.questions.0.minimum.6"),
      ),
      question(
        "replicates",
        "number",
        catalogText("academicAssignments.mag-material-provenance.questions.1.replicates.2"),
        [],
        { value: 16, tolerance: 0 },
        8,
        catalogText("academicAssignments.mag-material-provenance.questions.1.replicates.6"),
      ),
      question(
        "stop",
        "choice",
        catalogText("academicAssignments.mag-material-provenance.questions.2.stop.2"),
        [
          choice("continue", catalogText("academicAssignments.mag-material-provenance.questions.2.stop.3.0.continue.1")),
          choice("stop", catalogText("academicAssignments.mag-material-provenance.questions.2.stop.3.1.stop.1")),
          choice("rename", catalogText("academicAssignments.mag-material-provenance.questions.2.stop.3.2.rename.1")),
        ],
        "stop",
        10,
        catalogText("academicAssignments.mag-material-provenance.questions.2.stop.6"),
      ),
    ],
  },
  {
    id: "eng-waterwheel-power",
    courseCode: "ENG-231",
    kind: "assignment",
    dueOffset: 4,
    title: catalogText("academicAssignments.eng-waterwheel-power.title"),
    brief: catalogText("academicAssignments.eng-waterwheel-power.brief"),
    teacher: catalogText("academicAssignments.eng-waterwheel-power.teacher"),
    questions: [
      question(
        "power",
        "number",
        catalogText("academicAssignments.eng-waterwheel-power.questions.0.power.2"),
        [],
        { value: 5880, tolerance: 30 },
        15,
        catalogText("academicAssignments.eng-waterwheel-power.questions.0.power.6"),
      ),
      question(
        "comparison",
        "choice",
        catalogText("academicAssignments.eng-waterwheel-power.questions.1.comparison.2"),
        [
          choice("yes", catalogText("academicAssignments.eng-waterwheel-power.questions.1.comparison.3.0.yes.1")),
          choice("no", catalogText("academicAssignments.eng-waterwheel-power.questions.1.comparison.3.1.no.1")),
          choice("tape", catalogText("academicAssignments.eng-waterwheel-power.questions.1.comparison.3.2.tape.1")),
        ],
        "no",
        10,
        catalogText("academicAssignments.eng-waterwheel-power.questions.1.comparison.6"),
      ),
      question(
        "shutdown",
        "choice",
        catalogText("academicAssignments.eng-waterwheel-power.questions.2.shutdown.2"),
        [
          choice("bad", catalogText("academicAssignments.eng-waterwheel-power.questions.2.shutdown.3.0.bad.1")),
          choice("threshold", catalogText("academicAssignments.eng-waterwheel-power.questions.2.shutdown.3.1.threshold.1")),
          choice("nitori", catalogText("academicAssignments.eng-waterwheel-power.questions.2.shutdown.3.2.nitori.1")),
        ],
        "threshold",
        5,
        catalogText("academicAssignments.eng-waterwheel-power.questions.2.shutdown.6"),
      ),
    ],
  },
  {
    id: "jrn-correction-chain",
    courseCode: "JRN-210",
    kind: "assignment",
    dueOffset: 5,
    title: catalogText("academicAssignments.jrn-correction-chain.title"),
    brief: catalogText("academicAssignments.jrn-correction-chain.brief"),
    teacher: catalogText("academicAssignments.jrn-correction-chain.teacher"),
    questions: [
      question(
        "headline",
        "choice",
        catalogText("academicAssignments.jrn-correction-chain.questions.0.headline.2"),
        [
          choice("certain", catalogText("academicAssignments.jrn-correction-chain.questions.0.headline.3.0.certain.1")),
          choice("qualified", catalogText("academicAssignments.jrn-correction-chain.questions.0.headline.3.1.qualified.1")),
          choice("future", catalogText("academicAssignments.jrn-correction-chain.questions.0.headline.3.2.future.1")),
        ],
        "qualified",
        10,
        catalogText("academicAssignments.jrn-correction-chain.questions.0.headline.6"),
      ),
      question(
        "conflict",
        "choice",
        catalogText("academicAssignments.jrn-correction-chain.questions.1.conflict.2"),
        [
          choice("disclose", catalogText("academicAssignments.jrn-correction-chain.questions.1.conflict.3.0.disclose.1")),
          choice("hide", catalogText("academicAssignments.jrn-correction-chain.questions.1.conflict.3.1.hide.1")),
          choice("award", catalogText("academicAssignments.jrn-correction-chain.questions.1.conflict.3.2.award.1")),
        ],
        "disclose",
        10,
        catalogText("academicAssignments.jrn-correction-chain.questions.1.conflict.6"),
      ),
      question(
        "correction",
        "text",
        catalogText("academicAssignments.jrn-correction-chain.questions.2.correction.2"),
        [],
        { keywordGroups: [["未確認", "unconfirmed"]], minLength: 16 },
        10,
        catalogText("academicAssignments.jrn-correction-chain.questions.2.correction.6"),
      ),
    ],
  },
];
export const academicExams = [
  {
    id: "methods-midterm",
    code: "TU-MID-M01",
    durationMinutes: 18,
    title: catalogText("academicExams.methods-midterm.title"),
    lead: catalogText("academicExams.methods-midterm.lead"),
    questions: [
      question("m1", "choice", catalogText("academicExams.methods-midterm.questions.0.m1.2"), [
        choice("chance", catalogText("academicExams.methods-midterm.questions.0.m1.3.0.chance.1")),
        choice("bias", catalogText("academicExams.methods-midterm.questions.0.m1.3.1.bias.1")),
        choice("ethics", catalogText("academicExams.methods-midterm.questions.0.m1.3.2.ethics.1")),
      ], "chance", 15, catalogText("academicExams.methods-midterm.questions.0.m1.6")),
      question("m2", "choice", catalogText("academicExams.methods-midterm.questions.1.m2.2"), [
        choice("network", catalogText("academicExams.methods-midterm.questions.1.m2.3.0.network.1")),
        choice("fast", catalogText("academicExams.methods-midterm.questions.1.m2.3.1.fast.1")),
        choice("colour", catalogText("academicExams.methods-midterm.questions.1.m2.3.2.colour.1")),
      ], "network", 15, catalogText("academicExams.methods-midterm.questions.1.m2.6")),
      question("m3", "number", catalogText("academicExams.methods-midterm.questions.2.m3.2"), [], { value: 72, tolerance: 0 }, 15, catalogText("academicExams.methods-midterm.questions.2.m3.6")),
      question("m4", "choice", catalogText("academicExams.methods-midterm.questions.3.m4.2"), [
        choice("confirm", catalogText("academicExams.methods-midterm.questions.3.m4.3.0.confirm.1")),
        choice("contested", catalogText("academicExams.methods-midterm.questions.3.m4.3.1.contested.1")),
        choice("delete", catalogText("academicExams.methods-midterm.questions.3.m4.3.2.delete.1")),
      ], "contested", 15, catalogText("academicExams.methods-midterm.questions.3.m4.6")),
      question("m5", "choice", catalogText("academicExams.methods-midterm.questions.4.m5.2"), [
        choice("popular", catalogText("academicExams.methods-midterm.questions.4.m5.3.0.popular.1")),
        choice("positions", catalogText("academicExams.methods-midterm.questions.4.m5.3.1.positions.1")),
        choice("average", catalogText("academicExams.methods-midterm.questions.4.m5.3.2.average.1")),
      ], "positions", 20, catalogText("academicExams.methods-midterm.questions.4.m5.6")),
      question("m6", "choice", catalogText("academicExams.methods-midterm.questions.5.m6.2"), [
        choice("threshold", catalogText("academicExams.methods-midterm.questions.5.m6.3.0.threshold.1")),
        choice("harm", catalogText("academicExams.methods-midterm.questions.5.m6.3.1.harm.1")),
        choice("nice", catalogText("academicExams.methods-midterm.questions.5.m6.3.2.nice.1")),
      ], "nice", 20, catalogText("academicExams.methods-midterm.questions.5.m6.6")),
    ],
  },
];

export const defenceRounds = [
  {
    id: "claim",
    examiner: catalogText("defenceRounds.claim.examiner"),
    role: catalogText("defenceRounds.claim.role"),
    prompt: catalogText("defenceRounds.claim.prompt"),
    choices: [
      choice("universal", catalogText("defenceRounds.claim.choices.0.universal.1")),
      choice("scope", catalogText("defenceRounds.claim.choices.1.scope.1")),
      choice("gap", catalogText("defenceRounds.claim.choices.2.gap.1")),
    ],
    scores: { universal: 4, scope: 20, gap: 8 },
  },
  {
    id: "method",
    examiner: catalogText("defenceRounds.method.examiner"),
    role: catalogText("defenceRounds.method.role"),
    prompt: catalogText("defenceRounds.method.prompt"),
    choices: [
      choice("secret", catalogText("defenceRounds.method.choices.0.secret.1")),
      choice("record", catalogText("defenceRounds.method.choices.1.record.1")),
      choice("borrow", catalogText("defenceRounds.method.choices.2.borrow.1")),
    ],
    scores: { secret: 2, record: 20, borrow: 7 },
  },
  {
    id: "stop",
    examiner: catalogText("defenceRounds.stop.examiner"),
    role: catalogText("defenceRounds.stop.role"),
    prompt: catalogText("defenceRounds.stop.prompt"),
    choices: [
      choice("bored", catalogText("defenceRounds.stop.choices.0.bored.1")),
      choice("precommit", catalogText("defenceRounds.stop.choices.1.precommit.1")),
      choice("audience", catalogText("defenceRounds.stop.choices.2.audience.1")),
    ],
    scores: { bored: 9, precommit: 20, audience: 3 },
  },
];

export const academicGradeBands = [
  { min: 90, id: "A", label: catalogText("academicGradeBands.A.label") },
  { min: 80, id: "B", label: catalogText("academicGradeBands.B.label") },
  { min: 70, id: "C", label: catalogText("academicGradeBands.C.label") },
  { min: 60, id: "D", label: catalogText("academicGradeBands.D.label") },
  { min: 0, id: "F", label: catalogText("academicGradeBands.F.label") },
];
