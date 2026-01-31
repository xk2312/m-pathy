// lib/i18n.maios.ts

export const dict = {
  en: {
    hero: {
      title: "MAIOS",
      subtitle: "Modular Artificial Intelligence Operating System",
      intro: "Inner infrastructure for governed AI systems"
    },

    clarification: {
      title: "Important clarification",
      body: [
        "m-pathy is not MAIOS.",
        "m-pathy is a professional AI workspace.",
        "MAIOS is the inner operating system that governs how AI is allowed to reason.",
        "What you see on m-pathy.ai is a client implementation.",
        "What you read on this page is the system behind it.",
        "m-pathy uses MAIOS.",
        "MAIOS exists independently of m-pathy.",
        "This page is about MAIOS."
      ]
    },

    problem_statement: {
      title: "Your AI already makes decisions",
      subtitle: "You just cannot defend how they were made.",
      body: [
        "AI outputs influence hiring, legal judgment, strategy, and risk every day.",
        "Most organizations cannot explain under which system conditions these outputs were produced, which rules applied, or who was responsible.",
        "This is not a model problem.",
        "This is not a tooling problem.",
        "This is an inner infrastructure problem."
      ]
    },

    problems: {
      title: "The problems MAIOS solves",
      items: [
        {
          title: "We cannot explain our AI outputs when it matters",
          accordion: "explanation"
        },
        {
          title: "Governance exists on paper, not in execution",
          accordion: "explanation"
        },
        {
          title: "Responsibility inside AI systems is structurally unclear",
          accordion: "explanation"
        },
        {
          title: "AI behavior drifts without visibility",
          accordion: "explanation"
        },
        {
          title: "Expert reasoning and system behavior are mixed",
          accordion: "explanation"
        },
        {
          title: "Telemetry is treated as logging, not as control",
          accordion: "explanation"
        }
      ]
    },

    what_it_is: {
      title: "What MAIOS is",
      body: [
        "MAIOS is an inner operating system that enforces how AI is allowed to reason before any output exists.",
        "MAIOS governs how reasoning may start, under which modes behavior is framed, which experts may analyze, when governance is invoked, and whether an output is allowed to exist.",
        "MAIOS does not replace your AI.",
        "MAIOS governs your AI."
      ],
      accordion: "how MAIOS works internally"
    },

    what_it_is_not: {
      title: "What MAIOS is not",
      body: [
        "MAIOS does not store data.",
        "MAIOS does not persist telemetry.",
        "MAIOS does not manage infrastructure.",
        "MAIOS does not certify compliance.",
        "MAIOS enforces admissible outputs.",
        "Compliance happens in your system."
      ]
    },

    audience: {
      title: "Who MAIOS is designed for",
      body: [
        "MAIOS is designed for organizations operating in high risk and regulated AI environments.",
        "This includes environments where AI outputs influence people’s rights, safety, access, or legal standing."
      ],
      sectors: [
        "Medical and healthcare systems",
        "Government and public sector institutions",
        "Legal and judicial environments",
        "Financial services and insurance",
        "Critical infrastructure and security domains",
        "Enterprise organizations at scale"
      ],
      footer: [
        "MAIOS does not certify compliance.",
        "MAIOS enables systems to operate in compliance."
      ],
      accordion: "sector specific depth"
    },

    offering: {
      title: "The MAIOS offering",
      core: {
        title: "MAIOS Core",
        body: [
          "MAIOS Core is the universal inner layer.",
          "It provides deterministic system space, mandatory telemetry contract, output blocking execution rule, explicit start and completion logic, drift exposure, and responsibility separation.",
          "MAIOS Core has no predefined agents.",
          "MAIOS Core has no predefined experts.",
          "MAIOS Core has no predefined governance models.",
          "MAIOS Core is sufficient for small and mid sized organizations."
        ]
      },
      inventory: {
        title: "MAIOS Inventory Mapping",
        body: [
          "MAIOS Inventory Mapping adapts MAIOS to existing systems.",
          "It declares existing agents, experts, and systems, binds them to MAIOS telemetry, and maps governance and responsibility structures.",
          "MAIOS Inventory Mapping requires MAIOS Core.",
          "MAIOS does not impose an inventory.",
          "MAIOS references what already exists."
        ]
      },
      accordion: "implementation details"
    },

    proof: {
      title: "m-pathy as proof",
      body: [
        "m-pathy is a governed AI workspace built on MAIOS.",
        "It demonstrates that governed AI infrastructure can be built, operated, and verified in production.",
        "MAIOS works without m-pathy."
      ],
      accordion: "archive, truth hash, sealing, chaining"
    },

    consulting: {
      title: "Implementation and governance consulting",
      body: [
        "For organizations operating at scale or under regulation.",
        "We support integration, inventory mapping, audit design, cryptographic sealing strategies, governance design, and preparation for audits and regulators.",
        "This is not onboarding.",
        "This is inner infrastructure work."
      ],
      accordion: "consulting scope"
    },

    contact: {
      title: "Send us a message",
      body: [
        "Start a focused conversation about your system."
      ],
      fields: [
        "Message type",
        "Message",
        "Email address",
        "Company (optional)",
        "Role (optional)"
      ],
      footer: [
        "Messages are sent by email and stored in our system.",
        "No automated responses.",
        "No marketing follow ups."
      ]
    },

    closing: {
      body: [
        "m-pathy shows what is possible.",
        "MAIOS makes it possible everywhere."
      ]
    }
  }
};
