import { useMemo } from 'react';
import {
  type ApprovalEntry,
  buildStubApprovalEntries,
} from './stubApprovalEntries';

export interface GovernanceApprovalsFeed {
  entries: ApprovalEntry[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

/**
 * Stubbed feed of change proposals awaiting the connected user's review.
 *
 * The stub spans several originating spaces so the governance overview is
 * demonstrable. When wired to the backend, the entries must be scoped to the
 * spaces the connected user belongs to in the current organization (the
 * `getUserSpaces` membership boundary), so the user can never see approvals
 * from a space they are not a member of.
 */
export function useGovernanceApprovalsFeed(): GovernanceApprovalsFeed {
  const entries = useMemo(() => buildStubApprovalEntries(Date.now()), []);

  return {
    entries,
    isLoading: false,
    isError: false,
    refetch: () => {
      // no-op while stubbed; will re-run the change-proposal queries once wired
    },
  };
}
