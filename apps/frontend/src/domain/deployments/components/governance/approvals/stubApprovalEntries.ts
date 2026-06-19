import { createSpaceId, type SpaceId } from '@packmind/types';

export type ApprovalArtefactType = 'standards' | 'commands' | 'skills';

/**
 * What the proposal does to the artefact. Each maps to a different
 * review-changes route and a different row treatment:
 * - `update`: edits an existing artefact
 * - `creation`: proposes a brand-new artefact
 * - `deletion`: proposes removing an existing artefact
 */
export type ApprovalKind = 'update' | 'creation' | 'deletion';

export interface ApprovalEntry {
  id: string;
  spaceId: SpaceId;
  spaceSlug: string;
  spaceName: string;
  artefactType: ApprovalArtefactType;
  artefactId: string;
  artefactName: string;
  kind: ApprovalKind;
  summary: string;
  proposedBy: string;
  proposedAt: string;
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

/**
 * Originating spaces for the stubbed approvals. Several spaces are seeded on
 * purpose so the governance page shows the cross-space overview. The real feed
 * will replace this with the spaces the connected user belongs to in the
 * current organization (see useGovernanceApprovalsFeed).
 */
const STUB_SPACES = [
  {
    id: createSpaceId('stub-space-design-system'),
    slug: 'design-system',
    name: 'Design System',
  },
  {
    id: createSpaceId('stub-space-platform'),
    slug: 'platform',
    name: 'Platform',
  },
  {
    id: createSpaceId('stub-space-core-api'),
    slug: 'core-api',
    name: 'Core API',
  },
] as const;

type ApprovalTemplate = {
  spaceIndex: number;
  artefactType: ApprovalArtefactType;
  artefactName: string;
  kind: ApprovalKind;
  summary: string;
  proposedBy: string;
  ageMs: number;
};

const TEMPLATES: ApprovalTemplate[] = [
  {
    spaceIndex: 0,
    artefactType: 'standards',
    artefactName: 'error-handling',
    kind: 'update',
    summary: 'tighten the retry-and-log rule',
    proposedBy: 'Émilie Martin',
    ageMs: 40 * 60 * 1000,
  },
  {
    spaceIndex: 0,
    artefactType: 'skills',
    artefactName: 'release-notes',
    kind: 'creation',
    summary: 'proposes a new skill',
    proposedBy: 'Maya Leroy',
    ageMs: 3 * HOUR,
  },
  {
    spaceIndex: 1,
    artefactType: 'commands',
    artefactName: 'scaffold-endpoint',
    kind: 'update',
    summary: 'add a DTO validation step',
    proposedBy: 'Hugo Dupont',
    ageMs: 6 * HOUR,
  },
  {
    spaceIndex: 1,
    artefactType: 'standards',
    artefactName: 'legacy-logging',
    kind: 'deletion',
    summary: 'remove the deprecated logger rule',
    proposedBy: 'Antoine Bernard',
    ageMs: 20 * HOUR,
  },
  {
    spaceIndex: 2,
    artefactType: 'standards',
    artefactName: 'api-conventions',
    kind: 'update',
    summary: 'rename the pagination params',
    proposedBy: 'Sarah Cohen',
    ageMs: 1 * DAY + 4 * HOUR,
  },
  {
    spaceIndex: 2,
    artefactType: 'commands',
    artefactName: 'review-pr',
    kind: 'creation',
    summary: 'proposes a new command',
    proposedBy: 'Joan Racenet',
    ageMs: 2 * DAY,
  },
];

/**
 * Builds stubbed change proposals awaiting review, spread across several
 * originating spaces so the governance overview is meaningful. Includes a
 * mix of edits, new artefacts, and a removed artefact.
 */
export function buildStubApprovalEntries(now: number): ApprovalEntry[] {
  return TEMPLATES.map((template, index) => {
    const space = STUB_SPACES[template.spaceIndex];
    return {
      id: `stub-approval-${index}`,
      spaceId: space.id,
      spaceSlug: space.slug,
      spaceName: space.name,
      artefactType: template.artefactType,
      artefactId: `stub-${template.artefactType}-${index}`,
      artefactName: template.artefactName,
      kind: template.kind,
      summary: template.summary,
      proposedBy: template.proposedBy,
      proposedAt: new Date(now - template.ageMs).toISOString(),
    };
  });
}
