import { Fragment, useState } from 'react';
import {
  PMAlert,
  PMBox,
  PMHeading,
  PMHStack,
  PMIcon,
  PMStatus,
  PMText,
  PMVStack,
} from '@packmind/ui';
import { LuChevronRight, LuCircleCheck } from 'react-icons/lu';
import type { SpaceId } from '@packmind/types';
import { getSpaceColorPalette } from '../../../../organizations/components/sidebar/SpaceNavBlock';
import { GovernanceApprovalRow } from './GovernanceApprovalRow';
import type { ApprovalEntry } from './stubApprovalEntries';

const CARD_INSET = 5;

interface GovernanceApprovalsSectionProps {
  entries: ApprovalEntry[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  orgSlug: string;
}

type SpaceGroup = {
  spaceId: SpaceId;
  spaceName: string;
  entries: ApprovalEntry[];
};

export function GovernanceApprovalsSection({
  entries,
  isLoading,
  isError,
  onRetry,
  orgSlug,
}: Readonly<GovernanceApprovalsSectionProps>) {
  const groups = groupBySpace(entries);
  const [collapsedSpaces, setCollapsedSpaces] = useState<ReadonlySet<SpaceId>>(
    new Set(),
  );

  const toggleSpace = (spaceId: SpaceId) => {
    setCollapsedSpaces((previous) => {
      const next = new Set(previous);
      if (next.has(spaceId)) {
        next.delete(spaceId);
      } else {
        next.add(spaceId);
      }
      return next;
    });
  };

  return (
    <PMVStack align="stretch" gap={3}>
      <PMHStack justify="space-between" align="baseline">
        <PMHeading
          level="h2"
          color="faded"
          fontSize="xs"
          fontWeight="medium"
          textTransform="uppercase"
          letterSpacing="0.08em"
        >
          Approvals
        </PMHeading>
        {!isLoading && !isError && entries.length > 0 && (
          <PMText fontSize="sm" color="secondary">
            {buildApprovalsHeading(entries.length, groups.length)}
          </PMText>
        )}
      </PMHStack>
      <PMBox
        bg="background.primary"
        borderRadius="md"
        borderWidth="1px"
        borderColor="border.tertiary"
        paddingY={isError || isLoading ? CARD_INSET : 0}
        overflow="hidden"
      >
        {isError ? (
          <PMBox paddingX={CARD_INSET}>
            <PMAlert.Root status="error">
              <PMAlert.Indicator />
              <PMAlert.Content>
                <PMAlert.Title>Couldn't load approvals.</PMAlert.Title>
                <PMAlert.Description>
                  <PMBox
                    as="button"
                    onClick={onRetry}
                    bg="transparent"
                    border="none"
                    padding={0}
                    cursor="pointer"
                    color="text.primary"
                    fontSize="sm"
                    fontWeight="medium"
                    textDecoration="underline"
                    _focusVisible={{
                      outline: '2px solid',
                      outlineColor: 'border.brand',
                      outlineOffset: '2px',
                      borderRadius: 'sm',
                    }}
                  >
                    Retry
                  </PMBox>
                </PMAlert.Description>
              </PMAlert.Content>
            </PMAlert.Root>
          </PMBox>
        ) : isLoading ? (
          <PMVStack align="stretch" gap={0}>
            <SkeletonRows />
          </PMVStack>
        ) : entries.length === 0 ? (
          <PMVStack
            gap={2}
            align="center"
            textAlign="center"
            paddingX={CARD_INSET}
            paddingY={10}
          >
            <PMIcon fontSize="2xl" color="text.success" aria-hidden>
              <LuCircleCheck />
            </PMIcon>
            <PMText fontSize="sm" color="primary" fontWeight="medium">
              You're all caught up
            </PMText>
            <PMText fontSize="xs" color="secondary">
              No changes are waiting for your review across your spaces.
            </PMText>
          </PMVStack>
        ) : (
          <PMVStack align="stretch" gap={0}>
            {groups.map((group) => {
              const isExpanded = !collapsedSpaces.has(group.spaceId);
              const regionId = `approvals-space-${group.spaceId}`;
              return (
                <Fragment key={group.spaceId}>
                  <ApprovalSpaceHeader
                    spaceName={group.spaceName}
                    reviewCount={group.entries.length}
                    isExpanded={isExpanded}
                    regionId={regionId}
                    onToggle={() => toggleSpace(group.spaceId)}
                  />
                  {isExpanded && (
                    <PMVStack id={regionId} align="stretch" gap={0}>
                      {group.entries.map((entry, index) => (
                        <GovernanceApprovalRow
                          key={entry.id}
                          entry={entry}
                          orgSlug={orgSlug}
                          isLast={index === group.entries.length - 1}
                        />
                      ))}
                    </PMVStack>
                  )}
                </Fragment>
              );
            })}
          </PMVStack>
        )}
      </PMBox>
    </PMVStack>
  );
}

function ApprovalSpaceHeader({
  spaceName,
  reviewCount,
  isExpanded,
  regionId,
  onToggle,
}: Readonly<{
  spaceName: string;
  reviewCount: number;
  isExpanded: boolean;
  regionId: string;
  onToggle: () => void;
}>) {
  const colorPalette = getSpaceColorPalette(spaceName);

  return (
    <PMBox
      as="button"
      onClick={onToggle}
      aria-expanded={isExpanded}
      aria-controls={regionId}
      aria-label={`${spaceName}, ${reviewCount} ${
        reviewCount === 1 ? 'change' : 'changes'
      } to review, ${isExpanded ? 'collapse' : 'expand'}`}
      width="full"
      textAlign="left"
      cursor="pointer"
      paddingX={CARD_INSET}
      paddingY={2.5}
      bg="background.secondary"
      borderTopWidth="1px"
      borderBottomWidth="1px"
      borderColor="border.tertiary"
      _first={{ borderTopWidth: 0 }}
      position="sticky"
      top={0}
      zIndex={1}
      transition="background-color 120ms ease-out"
      _hover={{ bg: 'background.tertiary' }}
      _focusVisible={{
        outline: '2px solid',
        outlineColor: 'border.brand',
        outlineOffset: '-2px',
      }}
    >
      <PMHStack gap={2} align="center" justify="space-between">
        <PMHStack gap={2} align="center" minW={0}>
          <PMIcon
            color="text.faded"
            fontSize="sm"
            flexShrink={0}
            aria-hidden
            transform={isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'}
            transition="transform 150ms ease-out"
          >
            <LuChevronRight />
          </PMIcon>
          <PMStatus.Root colorPalette={colorPalette} as="span">
            <PMStatus.Indicator />
          </PMStatus.Root>
          <PMText
            fontSize="sm"
            fontWeight="semibold"
            color="primary"
            truncate
            minW={0}
          >
            {spaceName}
          </PMText>
        </PMHStack>
        <PMText
          fontSize="xs"
          color="faded"
          fontVariantNumeric="tabular-nums"
          flexShrink={0}
        >
          {reviewCount} {reviewCount === 1 ? 'change' : 'changes'} to review
        </PMText>
      </PMHStack>
    </PMBox>
  );
}

function groupBySpace(entries: ApprovalEntry[]): SpaceGroup[] {
  const map = new Map<SpaceId, SpaceGroup>();
  for (const entry of entries) {
    let group = map.get(entry.spaceId);
    if (!group) {
      group = {
        spaceId: entry.spaceId,
        spaceName: entry.spaceName,
        entries: [],
      };
      map.set(entry.spaceId, group);
    }
    group.entries.push(entry);
  }
  return Array.from(map.values()).sort(
    (a, b) =>
      b.entries.length - a.entries.length ||
      a.spaceName.localeCompare(b.spaceName),
  );
}

function buildApprovalsHeading(total: number, spaceCount: number): string {
  if (total === 1) {
    return '1 change to review';
  }
  if (spaceCount === 1) {
    return `${total} changes to review`;
  }
  return `${total} changes to review across ${spaceCount} spaces`;
}

function SkeletonRows() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <PMBox
          key={i}
          paddingX={CARD_INSET}
          paddingY={3}
          minHeight="60px"
          borderBottomWidth={i === 2 ? '0' : '1px'}
          borderColor="border.tertiary"
          display="flex"
          alignItems="center"
        >
          <PMHStack justify="space-between" align="center" width="full" gap={4}>
            <PMBox
              height="14px"
              width={`${40 + i * 10}%`}
              bg="background.secondary"
              borderRadius="sm"
            />
            <PMBox
              height="14px"
              width="80px"
              bg="background.secondary"
              borderRadius="sm"
            />
          </PMHStack>
        </PMBox>
      ))}
    </>
  );
}
