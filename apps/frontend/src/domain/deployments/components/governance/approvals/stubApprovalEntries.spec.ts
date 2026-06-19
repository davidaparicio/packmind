import { buildStubApprovalEntries } from './stubApprovalEntries';

const NOW = new Date('2026-06-18T12:00:00.000Z').getTime();

describe('buildStubApprovalEntries', () => {
  it('spreads approvals across several originating spaces', () => {
    const spaceIds = new Set(
      buildStubApprovalEntries(NOW).map((entry) => entry.spaceId),
    );

    expect(spaceIds.size).toBeGreaterThan(1);
  });

  it('includes a removed artefact awaiting review', () => {
    const hasRemoval = buildStubApprovalEntries(NOW).some(
      (entry) => entry.kind === 'deletion',
    );

    expect(hasRemoval).toBe(true);
  });
});
